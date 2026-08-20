/**
 * ENAULD spinning globe — the Organizational Capacity figure.
 *
 * No library. Land rings and country markers are drawn onto a 2D canvas through an
 * orthographic projection, and the sphere spins by advancing the projection's centre
 * longitude. Labels are real <button> elements in an overlay that shares the canvas
 * coordinate space, so they are focusable and keyboard-operable.
 *
 * Data comes from window.ENAULD_GLOBE (globe-data.js); selecting a country hands its
 * code to window.ENAULD_OPEN_COUNTRY, which index.html implements as the modal.
 *
 * Markup contract — a container with [data-globe] holding:
 *   [data-globe-stage] > canvas + [data-globe-labels]
 * and, optionally, a [data-globe-list] sibling.
 */
(function () {
  'use strict';

  var DEG = Math.PI / 180;

  /** Degrees per second. One revolution every 72s — slow enough to read a label. */
  var SPIN = 5;

  /** How many labels may share the sphere at once before it reads as clutter. */
  var MAX_LABELS = 7;

  /** Past this much movement a press is a spin, not a click. */
  var CLICK_SLOP = 5;

  /** Pointer must land this close to a marker centre to select it. */
  var HIT_RADIUS = 14;

  /** Direction to walk the limb when closing a clipped land ring. */
  var LIMB_CCW = true;

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /**
   * Orthographic projection. Positive z is the hemisphere facing the viewer, so `visible`
   * is what stops the far side of the sphere from being painted over the near side.
   */
  function project(lat, lng, rotation, radius, cx, cy) {
    var phi = lat * DEG;
    var lambda = (lng - rotation) * DEG;
    var cosPhi = Math.cos(phi);

    return {
      x: cx + cosPhi * Math.sin(lambda) * radius,
      y: cy - Math.sin(phi) * radius,
      z: cosPhi * Math.cos(lambda),
      visible: cosPhi * Math.cos(lambda) >= 0,
    };
  }

  /** Screen point back to lat/lng. Returns null outside the sphere. */
  function unproject(x, y, rotation, radius, cx, cy) {
    var dx = (x - cx) / radius;
    var dy = (cy - y) / radius;
    var rho2 = dx * dx + dy * dy;
    if (rho2 > 1) { return null; }

    var lat = Math.asin(dy) / DEG;
    var lng = Math.atan2(dx, Math.sqrt(Math.max(0, 1 - rho2))) / DEG + rotation;

    return { lat: lat, lng: ((lng + 180) % 360 + 360) % 360 - 180 };
  }

  /**
   * Pre-compute the trig for a ring of [lng, lat] pairs. Rotation is the only thing that
   * changes between frames and it factors out of the projection, so every frame after
   * this one is pure arithmetic — no sin/cos over 5k coastline points.
   */
  function preTrig(ring) {
    var a = new Float64Array(ring.length * 4);

    for (var i = 0; i < ring.length; i++) {
      var phi = ring[i][1] * DEG;
      var lng = ring[i][0] * DEG;
      a[i * 4] = Math.sin(phi);
      a[i * 4 + 1] = Math.cos(phi);
      a[i * 4 + 2] = Math.sin(lng);
      a[i * 4 + 3] = Math.cos(lng);
    }

    return a;
  }

  function drawGraticule(ctx, rotation, radius, cx, cy) {
    var lat, lng, first, p;
    ctx.beginPath();

    for (lat = -60; lat <= 60; lat += 30) {
      first = true;
      for (lng = -180; lng <= 180; lng += 3) {
        p = project(lat, lng, rotation, radius, cx, cy);
        if (!p.visible) { first = true; continue; }
        if (first) { ctx.moveTo(p.x, p.y); first = false; } else { ctx.lineTo(p.x, p.y); }
      }
    }

    for (lng = -180; lng < 180; lng += 30) {
      first = true;
      for (lat = -90; lat <= 90; lat += 3) {
        p = project(lat, lng, rotation, radius, cx, cy);
        if (!p.visible) { first = true; continue; }
        if (first) { ctx.moveTo(p.x, p.y); first = false; } else { ctx.lineTo(p.x, p.y); }
      }
    }

    ctx.stroke();
  }

  /** '#rrggbb' -> 'r, g, b' so colours from CSS tokens can carry a runtime alpha. */
  function channels(hex) {
    var value = String(hex || '').trim();
    var full = value.length === 4
      ? '#' + value[1] + value[1] + value[2] + value[2] + value[3] + value[3]
      : value;
    var m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(full);
    if (!m) { return '255, 255, 255'; }
    return parseInt(m[1], 16) + ', ' + parseInt(m[2], 16) + ', ' + parseInt(m[3], 16);
  }

  function init(container) {
    var data = window.ENAULD_GLOBE;
    if (!data || !data.countries) { return; }

    var canvas = container.querySelector('canvas');
    var stage = container.querySelector('[data-globe-stage]');
    var labelLayer = container.querySelector('[data-globe-labels]');
    if (!canvas || !stage) { return; }

    var ctx = canvas.getContext('2d');
    if (!ctx) { return; }

    var root = getComputedStyle(document.documentElement);

    // Region colours live in the stylesheet, so markers, legend swatches and label dots
    // all resolve from one place.
    var regionRGB = {};
    Object.keys(data.regions).forEach(function (slug) {
      var hex = root.getPropertyValue('--region-' + slug).trim();
      regionRGB[slug] = channels(hex || '#ffffff');
    });

    var accent = channels(root.getPropertyValue('--burgundy').trim() || '#8B1A1A');

    var points = Object.keys(data.countries).map(function (code) {
      var c = data.countries[code];
      return { code: code, name: c.name, lat: c.lat, lng: c.lng, region: c.region };
    });

    var landRings = (data.land || []).map(preTrig);
    var scratchLength = landRings.reduce(function (max, a) {
      return Math.max(max, a.length / 4);
    }, 0);
    var sx = new Float64Array(scratchLength);
    var sy = new Float64Array(scratchLength);
    var sz = new Float64Array(scratchLength);

    var rotation = 20;
    var hovered = null;

    // The three gradients depend only on the geometry, so they are rebuilt on resize
    // rather than three times a frame.
    var oceanFill = null;
    var shadeFill = null;
    var glowFill = null;
    var side = 0;
    var radius = 0;

    // Marker screen positions from the last painted frame, for click hit-testing.
    // Only ~7 countries can carry a label at once, so the markers are how the other
    // 49 are reachable on the sphere itself.
    var lastVisible = [];

    var reduceMotion = window.matchMedia
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------------------------------------------------------------------------
     * Sizing
     * ------------------------------------------------------------------------- */

    function size() {
      var box = container.getBoundingClientRect();
      var available = box.width || container.clientWidth;
      if (!available) { return; }

      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      // Fill the card rather than floating in it; the cap only bites on very wide layouts.
      side = Math.max(240, Math.min(Math.floor(available), 520));

      canvas.width = Math.round(side * dpr);
      canvas.height = Math.round(side * dpr);
      canvas.style.width = side + 'px';
      canvas.style.height = side + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Lock the label layer to the canvas box so both share one coordinate space.
      stage.style.width = side + 'px';
      stage.style.height = side + 'px';

      // Leave room for the atmosphere glow so it is never clipped by the canvas edge.
      radius = side / 2 - 20;

      buildGradients(side / 2, side / 2);
    }

    function buildGradients(cx, cy) {
      oceanFill = ctx.createRadialGradient(
        cx - radius * 0.38, cy - radius * 0.42, radius * 0.08,
        cx, cy, radius
      );
      oceanFill.addColorStop(0, '#1d3d70');
      oceanFill.addColorStop(0.5, '#12294b');
      oceanFill.addColorStop(1, '#071531');

      // A soft terminator: lit toward the top-left, falling away to the limb.
      shadeFill = ctx.createRadialGradient(
        cx - radius * 0.45, cy - radius * 0.45, radius * 0.18,
        cx, cy, radius
      );
      shadeFill.addColorStop(0, 'rgba(255,255,255,.10)');
      shadeFill.addColorStop(0.6, 'rgba(0,0,0,0)');
      shadeFill.addColorStop(1, 'rgba(0,0,0,.45)');

      glowFill = ctx.createRadialGradient(cx, cy, radius, cx, cy, radius + 20);
      glowFill.addColorStop(0, 'rgba(' + accent + ', .34)');
      glowFill.addColorStop(1, 'rgba(' + accent + ', 0)');
    }

    /* ---------------------------------------------------------------------------
     * Painting
     * ------------------------------------------------------------------------- */

    function paintSphere(cx, cy) {
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = oceanFill;
      ctx.fill();
    }

    function paintSurface(cx, cy) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.clip();

      ctx.strokeStyle = 'rgba(255,255,255,.09)';
      ctx.lineWidth = 0.5;
      drawGraticule(ctx, rotation, radius, cx, cy);

      paintLand(cx, cy);

      ctx.restore();
    }

    /**
     * Land, in one projection pass per ring.
     *
     * Fill and stroke need different geometry at the horizon, so each ring is projected
     * once into the scratch arrays and both paths are emitted from that.
     *
     * Fill: far-side points are pushed outside the sphere along their own azimuth, and
     * the caller's circular clip trims the excess. Simply dropping them would leave an
     * open arc that fill() closes with a straight chord — those chords were the pale
     * slabs that swept across the globe as it turned. Pushing outward also puts a fully
     * hidden ring entirely outside the clip, so it disappears on its own.
     *
     * Stroke: far-side points break the sub-path instead, so no coastline is drawn along
     * the limb where a landmass merely runs out of visible sphere.
     */
    function paintLand(cx, cy) {
      var rad = rotation * DEG;
      var sinR = Math.sin(rad);
      var cosR = Math.cos(rad);

      ctx.fillStyle = 'rgba(222, 233, 250, .50)';

      // Every ring's coastline goes into one path so the whole world strokes once.
      // Fills stay per-ring: sharing a path would let separate landmasses combine
      // under the nonzero winding rule.
      var coast = new Path2D();

      /** Where edge i->j crosses the horizon, as a screen point plus its canvas angle. */
      function crossing(i, j) {
        var t = sz[i] / (sz[i] - sz[j]);
        var vx = sx[i] + (sx[j] - sx[i]) * t;
        var vy = sy[i] + (sy[j] - sy[i]) * t;
        var m = Math.sqrt(vx * vx + vy * vy) || 1;
        vx /= m;
        vy /= m;
        // Canvas y grows downward, hence the negated vy in both places.
        return { x: cx + vx * radius, y: cy - vy * radius, ang: Math.atan2(-vy, vx) };
      }

      for (var r = 0; r < landRings.length; r++) {
        var a = landRings[r];
        var n = a.length / 4;
        var anyVisible = false;
        var i, o, j;

        for (i = 0; i < n; i++) {
          o = i * 4;
          var sinPhi = a[o];
          var cosPhi = a[o + 1];
          var sinLng = a[o + 2];
          var cosLng = a[o + 3];

          // Angle-difference identities: lambda = lng - rotation, so no trig per point.
          var sinLam = sinLng * cosR - cosLng * sinR;
          var cosLam = cosLng * cosR + sinLng * sinR;

          sx[i] = cosPhi * sinLam;
          sy[i] = sinPhi;
          sz[i] = cosPhi * cosLam;

          if (sz[i] >= 0) { anyVisible = true; }
        }

        if (!anyVisible) { continue; }

        /* Fill.
         *
         * The ring is clipped against the visible hemisphere and every gap is closed by
         * walking the limb itself. Closing with a straight chord instead (which is what
         * fill() does to an open path) painted slabs across the globe, and detouring the
         * far-side points outside the sphere floods it whenever a landmass spans more
         * than half the world — Eurasia and Antarctica both do. */
        var started = false;
        var firstEntry = null;
        var pendingExit = null;

        ctx.beginPath();

        for (i = 0; i < n; i++) {
          j = (i + 1) % n;

          if (sz[i] >= 0) {
            var px = cx + sx[i] * radius;
            var py = cy - sy[i] * radius;
            if (started) { ctx.lineTo(px, py); } else { ctx.moveTo(px, py); started = true; }
          }

          if (sz[i] >= 0 && sz[j] < 0) {
            var exit = crossing(i, j);
            ctx.lineTo(exit.x, exit.y);
            pendingExit = exit.ang;
          } else if (sz[i] < 0 && sz[j] >= 0) {
            var entry = crossing(i, j);

            if (pendingExit !== null) {
              // Rejoin along the limb rather than cutting straight across the disc.
              ctx.arc(cx, cy, radius, pendingExit, entry.ang, LIMB_CCW);
              pendingExit = null;
            } else if (started) {
              ctx.lineTo(entry.x, entry.y);
            } else {
              ctx.moveTo(entry.x, entry.y);
              started = true;
            }

            if (firstEntry === null) { firstEntry = entry.ang; }
          }
        }

        if (started) {
          if (pendingExit !== null && firstEntry !== null) {
            ctx.arc(cx, cy, radius, pendingExit, firstEntry, LIMB_CCW);
          }
          ctx.closePath();
          ctx.fill();
        }

        // Stroke: break at the horizon so no coastline is drawn along the limb where a
        // landmass merely runs out of visible sphere.
        var drawing = false;
        for (i = 0; i < n; i++) {
          if (sz[i] < 0) { drawing = false; continue; }

          var qx = cx + sx[i] * radius;
          var qy = cy - sy[i] * radius;

          if (drawing) { coast.lineTo(qx, qy); } else { coast.moveTo(qx, qy); drawing = true; }
        }
      }

      ctx.strokeStyle = 'rgba(240, 246, 255, .62)';
      ctx.lineWidth = 0.7;
      ctx.stroke(coast);
    }

    function paintShading(cx, cy) {
      // A soft terminator: lit toward the top-left, falling away to the limb.
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = shadeFill;
      ctx.fill();

      // Rim highlight, then the atmosphere bleeding outward past the edge.
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(190, 212, 245, .30)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Fill the annulus only. A radial gradient paints everything inside its inner
      // circle with the stop-0 colour, which would wash the whole sphere in accent.
      ctx.beginPath();
      ctx.arc(cx, cy, radius + 20, 0, Math.PI * 2);
      ctx.arc(cx, cy, radius, 0, Math.PI * 2, true);
      ctx.fillStyle = glowFill;
      ctx.fill();
    }

    function paintMarkers(cx, cy) {
      var visible = [];

      points.forEach(function (p) {
        var pt = project(p.lat, p.lng, rotation, radius, cx, cy);
        if (!pt.visible) { return; }

        // Fade markers toward the limb so they do not pop in and out.
        var alpha = Math.min(1, Math.max(0, (pt.z - 0.04) * 4.5));
        if (alpha <= 0.01) { return; }

        var rgb = regionRGB[p.region] || '255, 255, 255';
        var isHovered = hovered === p.code;
        var r = isHovered ? 5 : 3.5;

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, r + 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + rgb + ', ' + (alpha * (isHovered ? 0.42 : 0.22)) + ')';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + rgb + ', ' + alpha + ')';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,' + (alpha * (isHovered ? 0.95 : 0.7)) + ')';
        ctx.lineWidth = isHovered ? 1.4 : 1;
        ctx.stroke();

        visible.push({ point: p, x: pt.x, y: pt.y, z: pt.z, alpha: alpha });
      });

      lastVisible = visible;
      return visible;
    }

    /* ---------------------------------------------------------------------------
     * Labels
     *
     * A fixed pool of buttons is reused frame to frame. Rebuilding innerHTML each
     * frame would drop hover and focus 60 times a second.
     * ------------------------------------------------------------------------- */

    var labelPool = [];

    /** Rendered pill width per country, measured once when a label first shows that name. */
    var labelWidth = {};

    if (labelLayer) {
      for (var n = 0; n < MAX_LABELS; n++) {
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'globe-label';
        button.hidden = true;
        // No swatch inside the pill — the marker it sits beside already carries the
        // region colour, so a second dot only repeats it.
        labelLayer.appendChild(button);
        labelPool.push(button);
      }
    }

    /** Which country the focused label is showing, so spinning never moves it out from under the user. */
    function focusedCode() {
      var active = document.activeElement;
      if (!active || !labelLayer || !labelLayer.contains(active)) { return null; }
      return active.dataset.code || null;
    }

    /** Pills are 17px tall, so 28px of vertical clearance keeps a visible gap. */
    function clashes(candidate, placed) {
      for (var i = 0; i < placed.length; i++) {
        if (!placed[i]) { continue; }
        if (Math.abs(placed[i].y - candidate.y) < 28
          && Math.abs(placed[i].x - candidate.x) < 100) {
          return true;
        }
      }
      return false;
    }

    function paintLabels(visible) {
      if (!labelLayer) { return; }

      var byCode = {};
      visible.forEach(function (v) { byCode[v.point.code] = v; });

      var pinned = focusedCode();
      var slots = new Array(labelPool.length);
      var placed = [];
      var taken = {};
      var k;

      function claim(index, item) {
        slots[index] = item;
        placed.push(item);
        taken[item.point.code] = true;
      }

      // 1. A focused label never moves out from under the keyboard.
      if (pinned && byCode[pinned]) {
        for (k = 0; k < labelPool.length; k++) {
          if (labelPool[k].dataset.code === pinned) { claim(k, byCode[pinned]); break; }
        }
      }

      // 2. Each slot keeps the country it is already showing while that country stays
      //    reasonably visible. Without this the top-N-by-depth set is recomputed every
      //    frame and the pills visibly flick between countries as the globe turns.
      for (k = 0; k < labelPool.length; k++) {
        if (slots[k]) { continue; }
        var held = labelPool[k].dataset.code;
        var v = held && !taken[held] ? byCode[held] : null;
        if (v && v.alpha > 0.35 && !clashes(v, placed)) { claim(k, v); }
      }

      // 3. Fill what is left with the countries nearest the centre of the disc. The
      //    acquire threshold sits above the release threshold in step 2, so a label is
      //    only picked up well inside the limb — that gap is the hysteresis.
      var candidates = visible
        .filter(function (v) { return !taken[v.point.code] && v.alpha > 0.5; })
        .sort(function (a, b) { return b.z - a.z; });

      for (k = 0; k < labelPool.length; k++) {
        if (slots[k]) { continue; }
        for (var i = 0; i < candidates.length; i++) {
          var c = candidates[i];
          if (taken[c.point.code] || clashes(c, placed)) { continue; }
          claim(k, c);
          break;
        }
      }

      for (k = 0; k < labelPool.length; k++) {
        var el = labelPool[k];
        var item = slots[k];

        if (!item) {
          if (!el.hidden) { el.hidden = true; }
          continue;
        }

        if (el.hidden) { el.hidden = false; }

        var code = item.point.code;

        if (el.dataset.code !== code) {
          el.dataset.code = code;
          el.textContent = item.point.name;
          el.setAttribute('aria-label', item.point.name + ' — view engagements');
          // Measured once per country, while the element is visible and unflipped.
          if (labelWidth[code] === undefined) {
            el.classList.remove('is-flipped');
            labelWidth[code] = el.offsetWidth;
          }
        }

        // Flip to the left of the marker when the pill would otherwise run past the
        // canvas edge, rather than at a fixed x — long names need to flip sooner.
        var flip = item.x + 12 + (labelWidth[code] || 80) > side - 4;

        el.style.left = item.x.toFixed(1) + 'px';
        el.style.top = item.y.toFixed(1) + 'px';
        el.style.opacity = Math.min(1, item.alpha + 0.15).toFixed(2);
        el.classList.toggle('is-flipped', flip);
      }
    }

    function render(now) {
      if (!side) { return; }

      var cx = side / 2;
      var cy = side / 2;

      ctx.clearRect(0, 0, side, side);
      paintSphere(cx, cy);
      paintSurface(cx, cy);
      paintShading(cx, cy);
      paintLabels(paintMarkers(cx, cy, now));
    }

    /* ---------------------------------------------------------------------------
     * Interaction
     * ------------------------------------------------------------------------- */

    function select(code) {
      if (typeof window.ENAULD_OPEN_COUNTRY === 'function') {
        window.ENAULD_OPEN_COUNTRY(code);
      }
    }

    function pointerAt(event) {
      var rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    }

    /** Nearest marker under the pointer, or null. Closest wins when two overlap. */
    function markerAt(event) {
      var p = pointerAt(event);
      var best = null;
      var bestDistance = HIT_RADIUS;

      for (var i = 0; i < lastVisible.length; i++) {
        var v = lastVisible[i];
        var distance = Math.sqrt((v.x - p.x) * (v.x - p.x) + (v.y - p.y) * (v.y - p.y));
        if (distance <= bestDistance) {
          bestDistance = distance;
          best = v.point.code;
        }
      }

      return best;
    }

    var down = null;
    var dragging = false;
    var dragged = false;
    var dragX = 0;
    var hoverPause = false;
    var velocity = 0;

    /** The globe holds still whenever someone is reading it, or the modal is over it. */
    function isPaused() {
      return hoverPause
        || dragging
        || reduceMotion
        || !!focusedCode()
        || document.body.classList.contains('globe-modal-open');
    }

    container.addEventListener('pointerenter', function () { hoverPause = true; });
    container.addEventListener('pointerleave', function () {
      hoverPause = false;
      hovered = null;
      container.classList.remove('is-clickable');
    });

    container.addEventListener('pointerdown', function (event) {
      down = { x: event.clientX, y: event.clientY, id: event.pointerId };
      dragX = event.clientX;
      dragging = false;
      dragged = false;
      velocity = 0;

      // Stops the press from starting a text selection that then drags across the
      // card as a highlighted smear. Label buttons are exempt so they still focus.
      if (!(labelLayer && labelLayer.contains(event.target))) {
        event.preventDefault();
      }
    });

    container.addEventListener('pointermove', function (event) {
      if (!down) {
        var over = markerAt(event);
        hovered = over;
        container.classList.toggle('is-clickable', !!over);
        return;
      }

      if (!dragging) {
        var moved = Math.abs(event.clientX - down.x) + Math.abs(event.clientY - down.y);
        if (moved <= CLICK_SLOP) { return; }

        // Capture only once this is definitely a drag. Capturing on pointerdown would
        // retarget the following click away from the label button that was pressed.
        dragging = true;
        dragged = true;
        try { container.setPointerCapture(down.id); } catch (e) { /* ignore */ }
      }

      var delta = (event.clientX - dragX) * -0.35;
      rotation = (rotation + delta) % 360;
      velocity = delta;
      dragX = event.clientX;
    });

    // Belt and braces for the selection smear: some browsers begin a selection from a
    // press that started outside the card and was dragged in.
    container.addEventListener('selectstart', function (event) { event.preventDefault(); });
    container.addEventListener('dragstart', function (event) { event.preventDefault(); });

    function endGesture(event) {
      if (down && dragging) {
        try { container.releasePointerCapture(down.id); } catch (e) { /* ignore */ }
      }
      down = null;
      dragging = false;
    }

    container.addEventListener('pointerup', function (event) {
      var wasDragged = dragged;
      endGesture(event);

      if (wasDragged) { return; }
      // A label button raises its own click; do not open the same country twice.
      if (labelLayer && labelLayer.contains(event.target)) { return; }

      var code = markerAt(event);
      if (code) { select(code); }
    });

    container.addEventListener('pointercancel', function (event) {
      endGesture(event);
      dragged = true; // a cancelled gesture should never read as a click
    });

    if (labelLayer) {
      labelLayer.addEventListener('click', function (event) {
        var button = event.target.closest('button.globe-label');
        if (!button || !button.dataset.code) { return; }
        // Releasing a spin-drag over a label must not open it.
        if (dragged) { return; }
        select(button.dataset.code);
      });
    }

    /* ---------------------------------------------------------------------------
     * Country list — the complete, keyboard-reachable roster. Regions only survive as
     * marker colours and as the grouping order here; naming them was clutter.
     * ------------------------------------------------------------------------- */

    var list = document.querySelector('[data-globe-list]');
    if (list) {
      var order = Object.keys(data.regions);

      var sorted = points.slice().sort(function (a, b) {
        var byRegion = order.indexOf(a.region) - order.indexOf(b.region);
        return byRegion !== 0 ? byRegion : a.name.localeCompare(b.name);
      });

      list.innerHTML = sorted.map(function (p) {
        return '<li><button type="button" class="globe-list-item" data-code="' + esc(p.code)
          + '"><span class="globe-legend-dot" style="background: var(--region-' + esc(p.region)
          + ')"></span>' + esc(p.name) + '</button></li>';
      }).join('');

      list.addEventListener('click', function (event) {
        var button = event.target.closest('button.globe-list-item');
        if (button) { select(button.dataset.code); }
      });

      // Hovering a name in the list lights up its marker on the sphere.
      list.addEventListener('pointerover', function (event) {
        var button = event.target.closest('button.globe-list-item');
        hovered = button ? button.dataset.code : null;
      });
      list.addEventListener('pointerleave', function () { hovered = null; });
    }

    /* ---------------------------------------------------------------------------
     * Loop
     * ------------------------------------------------------------------------- */

    var running = false;
    var lastFrame = 0;

    function frame(now) {
      if (!running) { return; }

      var elapsed = lastFrame ? now - lastFrame : 0;
      lastFrame = now;

      if (!isPaused()) {
        rotation = (rotation + (elapsed / 1000) * SPIN) % 360;
      } else if (Math.abs(velocity) > 0.05 && !dragging) {
        // Let a flick coast to a stop instead of stopping dead under the cursor.
        rotation = (rotation + velocity) % 360;
        velocity *= 0.92;
      }

      render(now);
      requestAnimationFrame(frame);
    }

    function start() {
      if (running) { return; }
      running = true;
      lastFrame = 0;
      requestAnimationFrame(frame);
    }

    function stop() {
      running = false;
    }

    size();
    render(0);

    // The section sits high on a long page; a canvas loop running out of view is
    // wasted battery on mobile.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { start(); } else { stop(); }
        });
      }, { rootMargin: '120px 0px' }).observe(container);
    } else {
      start();
    }

    var resizeTimer = null;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        size();
        render(performance.now());
      }, 150);
    });
  }

  function boot() {
    document.querySelectorAll('[data-globe]').forEach(init);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
