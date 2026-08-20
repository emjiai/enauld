# Implementation Plan — Organizational Capacity section with interactive spinning globe

**Target:** a new two-column section on `frontend/index.html`, inserted **above** the Services
section. Left column = the Organizational Capacity narrative. Right column = a spinning 3D globe
with labelled country markers; clicking a label or marker opens a modal listing that country's
**Location / Agency-Company / Description** engagement rows.

---

## 1. Decisions made up front

### 1.1 Rendering approach — canvas 2D orthographic projection, no library

Two references were reviewed:

| Reference | Technique | Verdict |
|---|---|---|
| `bridge-explorer-seven.vercel.app` | **three.js / WebGL2**, sphere textured with `earth_atmos_2048.jpg` fetched from `threejs.org`, HTML `.globe-pin` label overlays projected from 3D each frame | Photoreal, but pulls in three.js (~600 KB) plus a remote texture. Rejected. |
| `bridge-portal-public/public/js/globe.js` | **Canvas 2D**, hand-rolled orthographic projection, land drawn from a ring JSON, markers + HTML label overlay share the same projection | Zero dependencies, ~550 lines, already proven. **Chosen.** |

Reasons the canvas-2D port wins for this repo:

- `CLAUDE.md` mandates *no build step, no package manager, no backend*. A vendored three.js build
  plus a texture is a lot of weight for one panel; the canvas globe is one `.js` file.
- The remote `threejs.org` texture is a third-party runtime dependency that would break the panel
  if that host changes. Not acceptable for a consultancy site.
- The site must survive being opened over `file://` (see `index.html:917`, which guards a `fetch`
  with `location.protocol !== 'file:'`). Canvas 2D + a `<script src>` data file works on `file://`;
  WebGL texture loading from a local file does not (canvas taint).
- Colours are read from CSS custom properties in the reference, so the globe inherits the
  navy/burgundy palette automatically.

Take the *visual language* from the Vercel site (pill-shaped labels with a coloured dot, soft
atmosphere glow) and the *mechanism* from `globe.js`.

### 1.2 Data sourcing — reuse `projects-data.js`, do not duplicate

`frontend/projects-data.js` already carries exactly the three modal fields, per project:

```js
{ slug, period, location, agency, position, title, summary, description, activities, result }
```

34 projects, each with `location`, `agency`, `description`. **Do not re-key this content into a
new file.** The only thing missing is a machine-readable country list — `location` is free text
(`"Côte d'Ivoire, Guinea, Guinea-Bissau, Liberia, Togo, Chad, Cameroon, Equatorial Guinea and
Benin"`), which cannot be joined on reliably.

**Change:** add one additive field, `countries: [...]` (array of ISO 3166-1 alpha-2 codes, lower
case), to each entry in `projects-data.js`. Nothing else in that file changes, so `project.html`
and the Track Record cards are unaffected.

### 1.3 Files

| File | Status | Purpose |
|---|---|---|
| `frontend/index.html` | edit | new `<section id="capacity">`, its CSS, the modal markup, nav entries, `<script src>` |
| `frontend/projects-data.js` | edit | add `countries: [...]` to each of the 34 entries |
| `frontend/globe-data.js` | **new** | `window.ENAULD_GLOBE = { land: [...], countries: {...}, regions: {...} }` |
| `frontend/globe.js` | **new** | the renderer, ported from `bridge-portal-public/public/js/globe.js` |

Two new small files rather than inlining, mirroring the existing `projects-data.js` convention.
`globe-data.js` is a `.js` file, not `.json`, specifically so it loads over `file://`.

---

## 2. Content — left column

Source: `frontend/documentation/organizational_capacity.md` (verbatim, one paragraph). Split it
into a lead paragraph plus supporting detail so it reads like the rest of the page, and pull the
client names out into a logo/name strip. The "(see Figure 1)" cross-reference is dropped — the
globe *is* Figure 1 now.

Proposed left column:

- `<div class="label">Organizational Capacity</div>`
- `<h2>` — "Evidence delivered across more than 50 countries."
- Lead `<p>`: "ENAULD, led by Dr. Ngozi Akwataghibe, has successfully delivered high-quality
  evaluations, assessments and applied research for WHO, UNICEF, WFP, the World Bank, Gavi the
  Vaccine Alliance, the Alliance for Health Policy and Systems Research (AHPSR), 3ie, the Bill &
  Melinda Gates Foundation and other international development partners across more than 50
  countries."
- `<p>`: "Its portfolio spans diverse development, humanitarian, fragile, conflict-affected and
  resource-constrained contexts across Africa, Asia, the Middle East, Europe and Latin America."
- `<p>`: "ENAULD's operational model combines global expertise with strong national partnerships,
  ensuring contextual relevance, local ownership, and safe, ethical field engagement."
- A three-up stat strip reusing the existing `.feature-grid` / `.feature` classes:
  `50+ countries` · `34 engagements` · `10 regions`
  (counts derived at runtime from `ENAULD_GLOBE.countries` and `ENAULD_PROJECTS` so they never
  drift from the data.)

Note on the apostrophe: `organizational_capacity.md` uses a typographic `’`. Keep `’` in the HTML
(the page already uses it, e.g. `index.html:632`), and keep `&amp;` for the ampersand in
"Bill &amp; Melinda Gates Foundation".

---

## 3. Country roster and coordinates

Compiled from `frontend/documentation/geographical_spread.md` and the legend in
`frontend/documentation/image.png`. The image's ten-colour legend becomes the globe's marker
legend, so the two figures stay visually consistent.

Regions (colour tokens defined in §5.2):

`west-africa`, `north-africa`, `central-africa`, `east-africa`, `southern-africa`,
`middle-east`, `asia`, `north-america`, `europe`, `indian-ocean`

`globe-data.js` country entries take the shape:

```js
countries: {
  ng: { name: "Nigeria", lat: 9.1, lng: 8.7, region: "west-africa" },
  ...
}
```

Full roster (55 entries) — capital-or-centroid coordinates, rounded to 1 dp:

**West Africa** — ng Nigeria 9.1/8.7 · gh Ghana 7.9/-1.0 · lr Liberia 6.4/-9.4 ·
sl Sierra Leone 8.5/-11.8 · sn Senegal 14.5/-14.5 · gm The Gambia 13.4/-15.5 ·
gw Guinea-Bissau 11.8/-15.2 · gn Guinea 9.9/-9.7 · ci Côte d'Ivoire 7.5/-5.5 ·
tg Togo 8.6/0.8 · bj Benin 9.3/2.3 · bf Burkina Faso 12.2/-1.6 · ml Mali 17.6/-4.0 ·
cv Cabo Verde 16.0/-24.0

**North Africa** — dz Algeria 28.0/1.7 · ma Morocco 31.8/-7.1 · tn Tunisia 33.9/9.5 ·
eg Egypt 26.8/30.8 · sd Sudan 12.9/30.2

**Central Africa** — td Chad 15.5/18.7 · cm Cameroon 7.4/12.4 · cf Central African Republic 6.6/20.9 ·
cd DR Congo -4.0/21.8 · cg Republic of Congo -0.2/15.8 · gq Equatorial Guinea 1.6/10.3 ·
ga Gabon -0.8/11.6

**East Africa** — et Ethiopia 9.1/40.5 · so Somalia 5.2/46.2 · ke Kenya -0.0/37.9 ·
ug Uganda 1.4/32.3 · tz Tanzania -6.4/34.9 · rw Rwanda -1.9/29.9 · bi Burundi -3.4/29.9 ·
ss South Sudan 7.9/29.7

**Southern Africa** — ao Angola -11.2/17.9 · bw Botswana -22.3/24.7 · na Namibia -22.9/18.5 ·
zm Zambia -13.1/27.8 · zw Zimbabwe -19.0/29.2 · mw Malawi -13.3/34.3 · mz Mozambique -18.7/35.5 ·
za South Africa -30.6/22.9 · ls Lesotho -29.6/28.2 · sz Eswatini -26.5/31.5

**Middle East** — ye Yemen 15.6/48.5 · om Oman 21.5/56.0

**Asia** — cn China 35.9/104.2 · mm Myanmar 21.9/95.9 · la Laos 19.9/102.5 ·
kh Cambodia 12.6/105.0 · vn Vietnam 14.1/108.3

**North America** — mx Mexico 23.6/-102.6

**Europe** — gb United Kingdom 55.4/-3.4 · nl Netherlands 52.1/5.3

**Indian Ocean** — sc Seychelles -4.7/55.5 · mg Madagascar -18.8/47.0

**Sanity check before building:** count the roster (55) against the "more than 50 countries"
claim in the copy, and against the ARISE entry's "38 countries". Do **not** try to plot ARISE's 38
individually — attribute it to `ke` (Kenya), matching how `projects-data.js` already summarises it
as `"38 countries, including Kenya"`, and let the modal description carry the full scope.

### 3.1 Land outlines

Copy `bridge-portal-public/public/data/land.json` (65 KB, `[[[lng,lat],...],...]`) and wrap it as
`window.ENAULD_GLOBE.land = [...]` inside `globe-data.js`. No re-derivation needed. Do **not**
copy `countries.json` from that project — it only holds 6 polygons (usa, uk, canada, ireland,
south-africa, uae) and is irrelevant here. **Country-polygon hit-testing is dropped**; markers
and labels are the only interactive targets, which keeps the payload at ~70 KB total.

---

## 4. `countries` mapping to add to `projects-data.js`

One line per project. Add `countries` immediately after the existing `location` field.

| slug | `countries` |
|---|---|
| wfp-tindouf-nutrition | `["dz"]` |
| arise-midterm | `["ke"]` |
| ghana-school-feeding | `["gh"]` |
| wfp-tsolata-malawi | `["mw"]` |
| who-oman | `["om"]` |
| who-somalia | `["so"]` |
| gavi-hsis-nigeria | `["ng"]` |
| mcgovern-dole-cameroon | `["cm"]` |
| mcgovern-dole-cote-divoire | `["ci"]` |
| unicef-south-sudan-cpe | `["ss"]` |
| wfp-congo-school-feeding | `["cg"]` |
| golama-military-doctors | `["nl"]` |
| unicef-cfc | `["cd","gn","lr"]` |
| wfp-south-sudan-school-feeding | `["ss"]` |
| unicef-health-cpd-nigeria | `["ng"]` |
| unicef-cholera-rrt-yemen | `["ye"]` |
| krc7-birth-registration | `["ci","gn","gw","lr","tg","td","cm","gq","bj"]` |
| car-joint-response | `["cf"]` |
| gep3-girls-education | `["ng"]` |
| comic-relief-gsk-malaria | `["tz","mz","sl","gh","la","mm","kh"]` |
| arc-supply-chain-mel | `["ng"]` |
| advisory-review-projects | `["gb","tg","mw","ng","ug","ls","sz","zm","zw"]` |
| par-rew-immunization | `["ng"]` |
| measles-campaigns-gavi | `["ng"]` |
| liberia-health-sector | `["lr"]` |
| unicef-wash-operational-research | `["ng"]` |
| participatory-eval-rew | `["ng"]` |
| rbf-capitalization-writeshop | `["ng"]` |
| wash-impact-six-states | `["ng"]` |
| obio-chis-bia | `["ng"]` |
| hrh-seychelles | `["sc"]` |
| hrh-liberia | `["lr"]` |
| hrh-nigeria | `["ng"]` |
| masters-impact-review | `["nl","cn","vn","za","mx","sd"]` |

**Countries in the roster with no project row** (from the wider geographical-focus list in
`geographical_spread.md` and the map figure, but not in the 34-project track record):
`sn, gm, bf, ml, cv, ma, tn, eg, ga, et, ke*, rw, bi, ao, bw, na, om*, …`
These still get a marker and a label. Their modal shows the country name, its region, and a
single line: *"Part of ENAULD's wider geographical footprint. Detailed engagement records are
published under Track Record."* with a link to `#track-record`. (`ke` and `om` do have rows —
they are listed here only as a reminder to verify each one against the table above at build time,
rather than assuming.)

---

## 5. Markup

### 5.1 Section — insert between `index.html:643` (`</section>` of `#about`) and `index.html:645` (`<section ... id="services">`)

```html
<section class="section soft" id="capacity">
  <div class="container">
    <div class="label">Organizational Capacity</div>
    <div class="section-head">
      <h2>Evidence delivered across more than 50 countries.</h2>
      <p>Evaluations, assessments and applied research for WHO, UNICEF, WFP, the World Bank,
         Gavi, AHPSR, 3ie and the Bill &amp; Melinda Gates Foundation.</p>
    </div>

    <div class="capacity-grid">
      <!-- LEFT: narrative (see §2) -->
      <div class="capacity-copy">
        <p class="lead">…</p>
        <p class="lead">…</p>
        <p class="lead">…</p>
        <div class="feature-grid capacity-stats">
          <article class="feature"><h3 data-capacity-count="countries">50+</h3><p>Countries</p></article>
          <article class="feature"><h3 data-capacity-count="projects">34</h3><p>Engagements</p></article>
          <article class="feature"><h3 data-capacity-count="regions">10</h3><p>Regions</p></article>
        </div>
      </div>

      <!-- RIGHT: globe -->
      <div class="capacity-globe-card">
        <div class="globe" data-globe>
          <div class="globe-stage" data-globe-stage>
            <canvas></canvas>
            <div class="globe-labels" data-globe-labels></div>
          </div>
        </div>

        <ul class="globe-legend" aria-hidden="true"><!-- 10 region swatches, built by JS --></ul>

        <!-- Accessible + keyboard route to every country. Collapsed to a scroll area
             on desktop, expanded on mobile where the globe is hidden. -->
        <div class="globe-list-wrap">
          <p class="globe-list-hint">Drag to spin. Select a country for its engagements.</p>
          <ul class="globe-list" data-globe-list><!-- built by JS: one button per country --></ul>
        </div>
      </div>
    </div>
  </div>
</section>
```

The section takes `class="section soft"`. That means `#services` (currently `section soft`) must
change to `class="section"` so the alternating light/soft banding down the page is preserved —
check `#about` (plain) → `#capacity` (soft) → `#services` (plain) → `#team` (plain) reads
correctly, and flip `#services` back if it does not.

### 5.2 Modal — add after the existing gallery modal (`index.html:794`–~`812`)

Reuse the established `.gallery-modal` interaction pattern (`display:none` → `.open`, click
backdrop to close, Escape to close) rather than `<dialog>`, so the two modals behave identically.

```html
<div class="globe-modal" id="globe-modal" aria-hidden="true" role="dialog" aria-modal="true"
     aria-labelledby="globe-modal-title">
  <div class="globe-modal-panel">
    <button class="globe-modal-close" type="button" aria-label="Close">…same svg as gallery…</button>
    <header class="globe-modal-head">
      <span class="globe-modal-region" id="globe-modal-region"></span>
      <h3 id="globe-modal-title"></h3>
      <p id="globe-modal-count"></p>
    </header>
    <div class="globe-modal-body" id="globe-modal-body"><!-- table injected --></div>
  </div>
</div>
```

Body table, exactly the three columns requested:

```html
<table class="globe-modal-table">
  <thead><tr><th scope="col">Location</th><th scope="col">Agency / Company</th><th scope="col">Description</th></tr></thead>
  <tbody>
    <tr>
      <td>Algeria</td>
      <td>WFP / Konterra</td>
      <td><a href="project.html?id=wfp-tindouf-nutrition">Evaluation of nutrition integration…</a>
          <span class="globe-modal-period">May 2026 – Ongoing</span></td>
    </tr>
  </tbody>
</table>
```

Values map straight from `ENAULD_PROJECTS`: `location` → Location, `agency` → Agency / Company,
`description` (falling back to `summary`) → Description. Linking the description to
`project.html?id=<slug>` connects the globe to the existing per-project pages for free.

Escape every injected string (`replace(/[&<>"]/g, …)`) — the same discipline `globe.js` already
applies at its label layer.

### 5.3 Nav

Add `<a href="#capacity">Capacity</a>` after `About` in both `.nav-links` (`index.html:575`) and
`#mobile-menu` (`index.html:591`). The desktop bar already carries 8 links at 22 px gaps; verify
at 1041 px (just above the mobile breakpoint) that a 9th does not force a wrap — if it does, drop
`Health` and `IMT` from the desktop bar only, since both are reachable from the Services cards.

### 5.4 Script tags — after `index.html:813`

```html
<script src="projects-data.js"></script>
<script src="globe-data.js"></script>
<script src="globe.js" defer></script>
```

---

## 6. CSS (add inside the existing `<style>`, before the `@media` block at `index.html:509`)

### 6.1 Layout

```css
.capacity-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; }
.capacity-stats { margin-top: 34px; }
.capacity-stats .feature h3 { font-size: 34px; color: var(--navy); margin-bottom: 2px; }
.capacity-stats .feature p { font-size: 13px; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); }
```

### 6.2 Globe card

The globe reads best on a dark ground (both references use one), and the site is otherwise light —
so the card is navy, matching `.team-card` which is already `background: var(--navy)`. This keeps
the light-theme rule in `CLAUDE.md` intact: one dark *card*, not a dark section.

```css
.capacity-globe-card {
  background: var(--navy);
  border-radius: 8px;
  padding: 28px;
  color: var(--white);
  overflow: hidden;
}
.globe { position: relative; display: flex; justify-content: center; cursor: grab; touch-action: pan-y; }
.globe:active { cursor: grabbing; }
.globe.is-clickable { cursor: pointer; }
.globe-stage { position: relative; line-height: 0; }
.globe canvas { display: block; max-width: 100%; }
.globe-labels { position: absolute; inset: 0; pointer-events: none; line-height: 1; }
.globe-label {
  position: absolute; transform: translate(10px, -50%);
  display: inline-flex; align-items: center; gap: 5px;
  white-space: nowrap; border-radius: 999px;
  background: rgba(8,14,28,.72); backdrop-filter: blur(3px);
  padding: 3px 9px; font-size: 11px; font-weight: 700;
  color: rgba(255,255,255,.94); pointer-events: auto; cursor: pointer;
  transition: background-color .18s ease;
}
.globe-label::before { content:""; width:6px; height:6px; border-radius:999px; background: var(--label-dot, #fff); }
.globe-label:hover, .globe-label:focus-visible { background: var(--burgundy); }
```

`touch-action: pan-y` is essential — without it the drag-to-spin gesture swallows vertical page
scrolling on mobile.

### 6.3 Region palette

Ten CSS custom properties on `:root`, sampled from `image.png`'s legend and desaturated slightly
to sit against navy:

```css
--region-west-africa: #7fbf5a;   --region-north-africa: #f2cf5b;
--region-central-africa: #a985d8; --region-east-africa: #6cc9bd;
--region-southern-africa: #f0a05a; --region-middle-east: #ee7f74;
--region-asia: #4a86d6;           --region-north-america: #f08c3a;
--region-europe: #8e6bd0;         --region-indian-ocean: #d95fa0;
```

`globe.js` reads these with `getComputedStyle(document.documentElement).getPropertyValue(...)`,
the same trick the reference uses for `--brand`, so markers, legend swatches and label dots all
come from one place.

### 6.4 Modal

Copy the `.gallery-modal` rules (`index.html:360`–`413`) as `.globe-modal`, swapping the figure
for a panel: `max-width: 940px; background: var(--white); border-radius: 10px; max-height: 88vh;
overflow: auto;`. Table styling: navy `<thead>`, `border-bottom: 1px solid var(--border-light)`
per row, `vertical-align: top`, description column `line-height: 1.6`.

### 6.5 Responsive — additions to the existing media queries

`@media (max-width: 1040px)` (`index.html:509`):
```css
.capacity-grid { grid-template-columns: 1fr; gap: 40px; }
```

`@media (max-width: 760px)` (`index.html:543`):
```css
.capacity-globe-card { padding: 20px; }
.globe-modal-table, .globe-modal-table thead, .globe-modal-table tbody,
.globe-modal-table tr, .globe-modal-table td { display: block; }
.globe-modal-table thead { display: none; }
.globe-modal-table td::before { content: attr(data-th); display:block; font-size:11px;
  text-transform:uppercase; letter-spacing:.08em; color: var(--muted); }
```

The three-column table cannot survive a 360 px viewport, so each cell stacks with its header as a
`data-th` label — set `data-th="Location"` / `"Agency / Company"` / `"Description"` on every `<td>`
when building the rows. This satisfies the `CLAUDE.md` mobile-responsiveness rule.

Add `.capacity-globe-card { padding: 24px }` to the 760 px block per the existing pattern at
`index.html:548`, which already lists `.card, .team-card, .project, …`.

---

## 7. `globe.js` — port notes

Start from `bridge-portal-public/public/js/globe.js` and apply these changes. Keep the file's
existing structure and comment style; it is well factored already.

**Keep as-is:** `project()`, `drawRing()`, `drawGraticule()`, `unproject()`, the `size()` DPR
handling, the drag/click gesture split (`CLICK_SLOP` 5 px / `CLICK_MS` 400 ms), the
`prefers-reduced-motion` check, and the `requestAnimationFrame` loop.

**Remove:**
- `drawArc()` and everything hub-related — there is no hub-and-spoke story here.
- `countries` polygon fetch, `inRing()`, and the polygon branch of `countryAt()`. Hit-testing is
  marker-only.
- `urlFor()` / `window.open` fallback. Selection always opens the modal.
- The two `fetch()` calls at the bottom — data now arrives via `window.ENAULD_GLOBE`.

**Change:**

1. **Data source.** Replace the `fetch` bootstrap with a direct read:
   `var G = window.ENAULD_GLOBE || {}; var land = G.land || null;` and build `points` from
   `G.countries` as `[{code, name, lat, lng, region}, …]`. Guard the whole `init()` with
   `if (!window.ENAULD_GLOBE) return;` so a missing file degrades to an empty card rather than a
   console error.

2. **Palette.** Swap the green/dark ocean gradient for the navy palette:
   ocean `#12294b → #0b1f3f → #071531`; graticule `rgba(255,255,255,.08)`; land fill
   `rgba(214,222,236,.30)` with stroke `rgba(226,232,244,.42)`. The outer glow becomes
   `rgba(139,26,26,…)` (burgundy) at low alpha, tying the globe to the brand accent.

3. **Marker colour per region.** Read the ten `--region-*` properties once at init into a lookup,
   then fill each marker with its region colour at `alpha` and halo it at `alpha * 0.25`. Every
   marker is the same radius (3.5 px) — there is no hub.

4. **Label selection.** The reference caps at 4 labels. Raise the cap to **7** and add simple
   collision avoidance: sort candidates by `z` descending (nearest the centre first), and skip a
   candidate whose projected position is within 26 px vertically and 90 px horizontally of an
   already-placed label. Also flip a label to the left side (`transform: translate(-100%, -50%)`
   with the dot after the text) when `pt.x > side * 0.62`, so labels near the right limb do not
   overflow the card.

5. **Labels are `<button>`, not `<a>`.** There is no per-country URL, so emit
   `<button type="button" class="globe-label" data-code="ng" style="--label-dot:…; left:…; top:…">`
   and delegate `click` on the label layer. Buttons are natively focusable, which the anchors were
   only incidentally.

6. **Selection.** Replace `selectCountry()`'s CustomEvent-plus-`window.open` with a direct call
   into the modal opener, exposed as `window.ENAULD_GLOBE_OPEN = openCountry`. Keep it a function
   reference rather than an event so the modal code in `index.html` stays a plain function.

7. **Spin speed.** Reference is 6°/s (60 s per revolution). Use **5°/s** — 72 s per revolution,
   slow enough to read labels without pausing. Pause on `mouseenter` as the reference does, and
   also pause when the modal is open (check `#globe-modal.open`) so the globe is not spinning
   behind the overlay.

8. **IntersectionObserver.** The reference animates unconditionally. Wrap the RAF loop so it only
   runs while the card intersects the viewport — this section sits high on a long page, and a
   permanently running canvas loop is wasted battery on mobile. Fall through to always-on if
   `IntersectionObserver` is undefined.

9. **Country list.** Build `[data-globe-list]` from `G.countries` at init: one
   `<button class="globe-list-item" data-code>` per country, sorted by region then name, each
   with its region dot. Clicking one calls the same `openCountry(code)`. This is the keyboard and
   screen-reader path, and the answer to "all the locations labelled" — the canvas can only
   legibly show ~7 at a time, the list shows all 55.

---

## 8. Modal logic (inline in `index.html`, next to the gallery modal script)

```js
function projectsFor(code) {
  return (window.ENAULD_PROJECTS || []).filter(p => (p.countries || []).indexOf(code) !== -1);
}
```

`openCountry(code)`:
1. Look up `ENAULD_GLOBE.countries[code]`; bail if unknown.
2. Set region eyebrow (region label, title-cased from the slug), `<h3>` to the country name.
3. `rows = projectsFor(code)`. Set the count line to
   `rows.length + (rows.length === 1 ? ' engagement' : ' engagements')`.
4. If `rows.length`, render the three-column table (§5.2). Otherwise render the wider-footprint
   fallback paragraph from §4.
5. Add `.open`, set `aria-hidden="false"`, `body.classList.add('menu-open')` to lock scroll
   (the class already does `overflow:hidden`, `index.html:70`), and move focus to the close
   button.

Close on: the close button, a backdrop click (`e.target === modal`), and `Escape`. The existing
gallery Escape handler at `index.html:953` checks its own modal, so add a sibling handler rather
than editing that one — both can coexist.

**Focus trap:** the gallery modal does not trap focus today. Match that (do not trap), but do
restore focus to the triggering label/list button on close, since the globe's triggers are
buttons in the flow and losing focus position there is more disruptive than in the gallery.

---

## 9. Build order

1. Write `globe-data.js` — land rings copied from `bridge-portal-public/public/data/land.json`,
   plus the 55-country roster and the 10 region definitions from §3.
2. Add `countries: [...]` to all 34 entries in `projects-data.js` per §4.
3. Write `globe.js` per §7.
4. Add the CSS block (§6) to `index.html`.
5. Add the section markup (§5.1) above `#services`, the modal (§5.2), the nav entries (§5.3) and
   the script tags (§5.4).
6. Wire the modal logic (§8).
7. Run the checks in §10.

Steps 1–3 are independent of 4–6 and can be done in either order; step 6 depends on both.

---

## 10. Verification

- [ ] Open `frontend/index.html` directly over `file://`. The globe renders and spins — no fetch,
      no console errors. This is the check that catches a `.json`-instead-of-`.js` regression.
- [ ] Serve with `npx serve frontend` and confirm the same.
- [ ] Globe spins at ~72 s/revolution; labels appear and fade near the limb without popping.
- [ ] Drag spins the globe; a drag does not fire a click; a clean click on a label opens the modal.
- [ ] Vertical page scroll still works with a touch drag started on the globe (`touch-action`).
- [ ] Click Nigeria → modal lists **10** engagement rows (ng appears 10 times in §4). Click
      Seychelles → 1 row. Click Senegal → the wider-footprint fallback. Verify these three counts
      against the table in §4 after the data edit, not before.
- [ ] Every Description cell links to a `project.html?id=<slug>` page that actually resolves.
- [ ] Escape, backdrop click and the close button all close the modal; focus returns to the
      trigger; the globe pauses while the modal is open.
- [ ] Region legend colours match the marker colours and the `image.png` legend.
- [ ] Widths 360 / 768 / 1024 / 1440: the grid collapses to one column at ≤1040 px, the globe
      never overflows its card, and the modal table stacks at ≤760 px.
- [ ] `prefers-reduced-motion: reduce` — globe renders static, still clickable.
- [ ] Nav bar does not wrap at 1041 px with the added `Capacity` link.
- [ ] The alternating `soft` banding down the page still alternates (§5.1).
- [ ] Lighthouse/Performance: confirm the RAF loop stops when the section scrolls out of view.

---

## 11. Risks and fallbacks

| Risk | Mitigation |
|---|---|
| 55 markers is visually noisy at 420 px | Cap visible labels at 7 with collision avoidance (§7.4); all markers stay drawn but unlabelled until near the centre. If still crowded, reduce marker radius to 3 px before reducing the roster. |
| Free-text `location` drifts from `countries` | `countries` is authoritative for the globe; `location` stays the display string. Cross-check both when adding a project — worth a one-line note at the top of `projects-data.js`. |
| Canvas globe looks flat next to the Vercel reference | The atmosphere glow + terminator shading in the reference `render()` do most of the work; keep both. If a photoreal look is later required, the swap point is `render()` alone — the projection, hit-testing and label layer are texture-agnostic. |
| `land.json` licence | Confirm provenance before copying (Natural Earth is public domain; verify that is the source in `bridge-portal-public` and carry any attribution into a comment at the top of `globe-data.js`). |
| Copying data across projects | `land.json` and `globe.js` come from `bridge-portal-public`, an unrelated codebase. Only geometry and generic rendering code are copied — no BRIDGE content, branding or colours. |
