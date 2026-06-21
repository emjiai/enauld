---
name: workerbull-landing-setup
description: >
  Full setup skill for WorkerBull product landing pages. Use this skill whenever
  the user provides an HTML design file (from Gamma, Figma export, or any static
  mock) and wants to turn it into a production-ready WorkerBull landing page.
  Covers everything end-to-end: extracting content from bundled design files,
  scaffolding the React + Babel single-file app, porting all sections as React
  components, wiring EmailJS for the booking modal, adding full mobile
  responsiveness with a hamburger menu, creating vercel.json, and writing the
  README. Trigger this skill any time the user says things like "create a landing
  page", "set up a new product page", "port this design to code", "build a page
  like Bossi", or "new WorkerBull page".
---

# WorkerBull Landing Page Setup Skill

This skill captures the exact pattern used to build WorkerBull product landing pages —
starting from a design file and ending with a fully deployed, mobile-responsive,
email-wired single-file React app.

Read `references/component-patterns.md` for detailed React component code patterns.
Read `references/css-system.md` for the complete CSS variable system and responsive rules.

---

## 1. Understand the Brief

Before touching code, establish:

- **What product is this page for?** (Name, one-line description, target audience)
- **Where is the design file?** (Gamma export HTML, static mockup, screenshot, or description)
- **What is the booking/CTA action?** (EmailJS booking modal, external link, Stripe, etc.)
- **Does the page need a booking form?** If yes, confirm the EmailJS keys from `.env`
- **Where will the file live?** (Usually a new subfolder under `otwaa/`, e.g. `otwaa/productname/`)

If the design is a Gamma-exported HTML bundle (large single file with base64 assets),
extract its content first — see §2.

---

## 2. Extract Content from a Bundled Design File

Gamma and similar tools export a self-contained HTML file where all assets (fonts, images)
are base64-encoded inside `<script type="__bundler/manifest">` and
`<script type="__bundler/template">` tags. The visible HTML is inside the template.

**Extract it with Python:**

```python
import re, json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('path/to/Design.html', 'r', encoding='utf-8') as f:
    content = f.read()

template_match = re.search(r'<script type="__bundler/template">(.*?)</script>', content, re.DOTALL)
if template_match:
    template = json.loads(template_match.group(1))
    body_idx = template.find('<body')
    css_blocks = re.findall(r'<style>(.*?)</style>', template, re.DOTALL)
    
    with open('extracted_body.txt', 'w', encoding='utf-8') as out:
        out.write(template[body_idx:])
    with open('extracted_styles.txt', 'w', encoding='utf-8') as out:
        for i, s in enumerate(css_blocks):
            out.write(f'/* BLOCK {i} */\n{s}\n\n')
    print('Done')
```

From the extracted files, collect:
- All section headings, body copy, CTA labels, feature names/descriptions
- Pricing tiers (names, prices, feature lists)
- FAQ questions and answers
- Testimonial quotes
- Nav link labels and anchor IDs
- Any external URLs referenced (Stripe links, mailto, etc.)
- The color scheme (CSS variables from `:root`)
- SVG icon paths used for feature cards

Delete the temp extraction files when done.

---

## 3. Project Structure to Create

```
otwaa/
└── productname/
    ├── index.html        ← Single-file React app (the main deliverable)
    ├── public/
    │   └── favicon.ico   ← Copy from otwaa/frontend/public/ if needed
    ├── vercel.json       ← Deployment config
    ├── .env              ← EmailJS keys (never committed)
    └── README.md
```

---

## 4. Build `index.html` — The Single-File React App

### 4a. Head section

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>[Product] — [Tagline] | WorkerBull</title>
<link rel="icon" type="image/x-icon" href="public/favicon.ico">
<meta name="description" content="[SEO description ~150 chars]">
<meta name="robots" content="index, follow">
<meta property="og:type" content="website">
<meta property="og:title" content="[Product] — [Tagline] | WorkerBull">
<meta property="og:description" content="[OG description]">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js"
  integrity="sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L" crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js"
  integrity="sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm" crossorigin="anonymous"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js"
  integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y" crossorigin="anonymous"></script>
<!-- Only include EmailJS if the page has a booking/contact form -->
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
<script>emailjs.init('DhBapWbS8FZDIVHeP');</script>
<style>
  /* CSS goes here — see §4b */
</style>
</head>
<body>
<script type="text/babel">
  /* React components go here — see §4c */
  ReactDOM.createRoot(document.getElementById('root')).render(<App />);
</script>
<div id="root"></div>
</body>
</html>
```

### 4b. CSS system

The full CSS variable system and all component styles are documented in
`references/css-system.md`. Always start from the system there and add
product-specific overrides below it.

Key rules:
- Never use external CSS frameworks (no Tailwind, no Bootstrap)
- All colours via CSS custom properties (`--gold`, `--bg`, `--text`, etc.)
- Light/dark theme via `[data-theme="dark"]` on `<html>`
- `font-family: 'Outfit', system-ui, sans-serif` throughout
- All responsive layout via CSS media queries in the `<style>` block —
  do **not** use inline responsive styles for layout

### 4c. React component architecture

Every page uses the same component tree pattern:

```
App
├── Nav            (sticky, hamburger on mobile, theme toggle)
├── Hero           (headline, sub, CTAs, visual/mock)
├── Trust          (logo strip — "trusted by X")
├── Features       (capability grid, usually 3×3 or 2×3)
├── Showcase       (alternating text + visual spotlight sections)
├── HowItWorks     (numbered steps, usually 4)
├── Pricing        (3-card grid: basic / featured / premium)
├── Testimonial    (full-width blockquote)
├── FAQ            (accordion, 6 items)
├── CTA            (final call to action with gradient background)
├── Footer         (4-column grid + copyright)
└── BookingModal   (form → success state, EmailJS)
```

Add or remove sections to match the design. Keep the order unless the design
dictates otherwise.

See `references/component-patterns.md` for the full implementation of each component.

### 4d. App-level state

```jsx
const App = () => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [theme, setTheme] = React.useState('light');

  // Persist theme across page loads
  React.useEffect(() => {
    const saved = localStorage.getItem('[product]-theme');
    if (saved) setTheme(saved);
  }, []);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('[product]-theme', theme);
  }, [theme]);

  return (
    <>
      <Nav onOpenModal={() => setModalOpen(true)}
           theme={theme}
           onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} />
      <Hero onOpenModal={() => setModalOpen(true)} />
      <Trust />
      <Features />
      <Showcase />
      <HowItWorks />
      <Pricing onOpenModal={() => setModalOpen(true)} />
      <Testimonial />
      <FAQ />
      <CTA onOpenModal={() => setModalOpen(true)} />
      <Footer />
      <BookingModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};
```

---

## 5. EmailJS Booking Modal

The booking modal collects contact info, then sends via EmailJS using the
shared WorkerBull account. All pages use the same service and template.

### Credentials (from `.env`)

```
EMAILJS_PUBLIC_KEY=DhBapWbS8FZDIVHeP
EMAILJS_SERVICE_ID=service_workerbull
EMAILJS_TEMPLATE_BOOKING=template_booking
```

### Template variables the booking template accepts

| Variable | Value |
|---|---|
| `from_name` | First + last name from form |
| `from_email` | Email from form |
| `topic` | **Hardcode to the product name** (e.g. `'Bossi'`, `'Content Genius'`) |
| `details` | All remaining fields as a formatted multi-line string |

### `handleSubmit` pattern

```jsx
const handleSubmit = (e) => {
  e.preventDefault();
  setSendError('');
  const data = new FormData(formRef.current);

  const firstName = data.get('first_name');
  const rawDate   = data.get('date');
  const time      = data.get('time');
  const dateStr   = rawDate
    ? new Date(rawDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
    : '';

  // Build "Additional information" block from all remaining fields
  const additionalInfo = [
    `Date: ${dateStr}`,
    `Time: ${time}`,
    `Phone: ${data.get('phone')}`,
    `Company: ${data.get('company')}`,
    `Sector: ${data.get('sector')}`,
    `Needs: ${data.get('needs')}`,
  ].join('\n');

  setSending(true);
  emailjs.send('service_workerbull', 'template_booking', {
    from_name:  `${firstName} ${data.get('last_name')}`,
    from_email: data.get('email'),
    topic:      '[PRODUCT NAME]',   // ← hardcode this per page
    details:    additionalInfo,
  })
    .then(() => {
      setSending(false);
      setSuccessMsg(`Thanks ${firstName} — your slot for ${dateStr} at ${time} is reserved.`);
      setSuccess(true);
    })
    .catch(() => {
      setSending(false);
      setSendError('Something went wrong. Please try again or email hello@workerbull.com');
    });
};
```

### Modal state management

```jsx
const BookingModal = ({ open, onClose }) => {
  const [success,   setSuccess]   = React.useState(false);
  const [successMsg,setSuccessMsg]= React.useState('');
  const [sending,   setSending]   = React.useState(false);
  const [sendError, setSendError] = React.useState('');
  const formRef = React.useRef(null);

  // Reset state when modal closes
  React.useEffect(() => {
    if (!open) {
      const t = setTimeout(() => { setSuccess(false); setSendError(''); }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Set min date to tomorrow
  React.useEffect(() => {
    if (open) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const el = formRef.current?.querySelector('#f-date');
      if (el) el.min = tomorrow.toISOString().split('T')[0];
    }
  }, [open]);

  if (!open) return null;
  // ... render form or success state
};
```

Submit button should be disabled + show spinner while `sending` is true:

```jsx
<button type="submit" disabled={sending}
  style={{ opacity: sending ? 0.7 : 1, cursor: sending ? 'not-allowed' : 'pointer' }}>
  {sending ? 'Sending…' : 'Confirm booking'}
</button>
```

Show inline error (not `alert()`) if EmailJS fails:

```jsx
{sendError && (
  <p style={{ marginTop: 12, fontSize: 13, color: '#c0392b' }}>{sendError}</p>
)}
```

---

## 6. Mobile Responsiveness

All pages must be fully usable at 360px wide. The three breakpoints are:

| Breakpoint | What changes |
|---|---|
| `≤ 1024px` | Reduce padding, footer drops to 2-column |
| `≤ 960px` | Hamburger menu, hero stacks, 2-col features, steps go 2-col, pricing goes 1-col, floating cards hidden |
| `≤ 640px` | Features go 1-col, form grid goes 1-col, footer goes 1-col, everything single-column |
| `≤ 400px` | Tightest padding (16px container padding) |

### Hamburger menu (Nav component)

```jsx
const Nav = ({ onOpenModal, theme, onToggleTheme }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const w = useWindowWidth();
  const isMobile = w <= 960;

  // Close mobile menu when screen widens back to desktop
  React.useEffect(() => {
    if (!isMobile && mobileOpen) setMobileOpen(false);
  }, [isMobile]);

  // Prevent body scroll when menu is open
  React.useEffect(() => {
    document.body.classList.toggle('menu-open', mobileOpen);
    return () => document.body.classList.remove('menu-open');
  }, [mobileOpen]);

  return (
    <>
      <nav>
        <div className="nav-inner">
          {/* Logo / brand */}
          {!isMobile && <ul className="nav-links">…</ul>}
          <div className="nav-actions">
            <button className="theme-toggle" onClick={onToggleTheme}>…</button>
            {!isMobile
              ? <button onClick={onOpenModal} className="btn btn-primary">Book a demo</button>
              : <button className="hamburger" onClick={() => setMobileOpen(o => !o)}>
                  {/* X icon when open, hamburger when closed */}
                </button>
            }
          </div>
        </div>
      </nav>
      {/* Full-screen mobile menu overlay */}
      {isMobile && mobileOpen && (
        <div className="mobile-nav-overlay">
          {links.map(l => (
            <a key={l.label} href={l.href} className="mobile-nav-link"
              onClick={() => setMobileOpen(false)}>{l.label}</a>
          ))}
          <button onClick={() => { setMobileOpen(false); onOpenModal(); }}
            className="btn btn-primary mobile-nav-cta">Book a demo</button>
        </div>
      )}
    </>
  );
};
```

Required CSS for mobile menu:

```css
.hamburger {
  display: none;
  background: none; border: none; cursor: pointer;
  color: var(--text); padding: 4px;
  align-items: center; justify-content: center;
}
.hamburger svg { width: 24px; height: 24px; }
.mobile-nav-overlay {
  position: fixed; top: 72px; left: 0; right: 0; bottom: 0; z-index: 99;
  background: var(--bg); border-top: 1px solid var(--hairline);
  padding: 8px 24px 32px; overflow-y: auto;
  display: flex; flex-direction: column;
}
.mobile-nav-link {
  font-size: 18px; font-weight: 500; color: var(--text);
  padding: 18px 0; border-bottom: 1px solid var(--hairline); display: block;
}
.mobile-nav-cta { display: block; margin-top: 28px; text-align: center; }
body.menu-open { overflow: hidden; }
@media (max-width: 960px) {
  .hamburger { display: flex; }
  .nav-links  { display: none; }
}
```

The `useWindowWidth` hook:

```jsx
const useWindowWidth = () => {
  const [w, setW] = React.useState(window.innerWidth);
  React.useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return w;
};
```

---

## 7. `vercel.json`

Every page gets an identical `vercel.json` at its root:

```json
{
  "buildCommand": null,
  "outputDirectory": ".",
  "cleanUrls": false,
  "trailingSlash": false,
  "rewrites": [
    { "source": "/", "destination": "/index.html" }
  ]
}
```

---

## 8. `README.md`

Follow the exact pattern from `otwaa/bossi/README.md`. Key sections:

1. **One-line product description** + link to WorkerBull
2. **Running Locally** — primary method is always `npx serve .` (Node.js, no install beyond npx), opens at `http://localhost:3000`. Include the "Why not file://" note.
3. **Available pages** table (usually just `http://localhost:3000`)
4. **Project Structure** — file tree
5. **Tech Stack** — React 18 CDN, Babel Standalone, Vanilla CSS, Outfit font
6. **Environment Variables** — note that no env vars are needed to run; document EmailJS wiring for future devs
7. **Deployment** — push to GitHub → import at vercel.com/new → connect domain. The `vercel.json` handles routing.
8. **Customisation table** — which component/array to edit for pricing, features, FAQ, etc.

---

## 9. Quality Checklist

Before declaring done, verify each item:

### Content
- [ ] All text from the design is present (headings, body copy, CTAs)
- [ ] All feature cards ported (names, descriptions, icons)
- [ ] All pricing tiers ported (name, price, period, feature list, CTA label)
- [ ] All FAQ items ported (question + answer)
- [ ] Testimonial quote and attribution present
- [ ] Footer links point to correct WorkerBull URLs

### Functionality
- [ ] Theme toggle works and persists across page reloads
- [ ] Nav anchor links scroll to correct sections
- [ ] FAQ accordion opens/closes correctly (only one open at a time)
- [ ] All CTA buttons open the booking modal
- [ ] Booking form validates required fields before submitting
- [ ] EmailJS `topic` is hardcoded to the product name
- [ ] All form fields passed as `details` in EmailJS payload
- [ ] Success state shown after EmailJS resolves
- [ ] Error message shown (inline, not alert) if EmailJS rejects
- [ ] Submit button disabled + spinner shown during send

### Mobile responsiveness
- [ ] Hamburger menu appears at ≤960px
- [ ] Mobile menu overlay opens/closes correctly
- [ ] Body scroll locked when mobile menu is open
- [ ] Hero stacks to single column at ≤960px
- [ ] Feature grid: 2-col at 640–960px, 1-col at ≤640px
- [ ] Pricing cards: 1-col at ≤960px
- [ ] Footer: 2-col at ≤1024px, 1-col at ≤640px
- [ ] Booking form grid: 1-col at ≤640px
- [ ] Page usable at 360px viewport width with no horizontal scroll
- [ ] Floating hero cards hidden at ≤960px

### Files
- [ ] `index.html` — complete, no TODOs
- [ ] `vercel.json` — present, matches template
- [ ] `README.md` — present, covers local dev + Vercel deploy + customisation
- [ ] `.env` — present with EmailJS keys (not committed to git)
- [ ] `.gitignore` — includes `.env`

---

## 10. Common Mistakes to Avoid

- **JSX attribute names** — always `className` not `class`, `htmlFor` not `for`,
  `strokeWidth` not `stroke-width`, `strokeLinecap` not `stroke-linecap`
- **Self-closing tags in JSX** — `<br />`, `<input />`, `<hr />` (not `<br>`)
- **SVG inside JSX** — all attribute names must be camelCase
- **`color-mix()`** — modern CSS, supported in Chrome 111+/Firefox 113+/Safari 16.2+;
  use a flat rgba fallback for borders if you need wider browser support
- **`aspect-ratio`** — hide or override on mobile so the hero visual doesn't become
  too tall on narrow screens
- **`details`/`summary` for FAQ** — use React-controlled `div` + `button` instead
  to avoid native browser toggle conflicting with React state
- **Never use `alert()`** — use inline error state for all error feedback
- **No `console.log` left in** — clean up before handoff
- **The `.env` file must never be committed** — always check `.gitignore`

---

## Reference Files

- `references/css-system.md` — Complete CSS variable system, all component styles,
  and full responsive media queries
- `references/component-patterns.md` — Full React component implementations for
  Nav, Hero, Features, Pricing, FAQ accordion, BookingModal, Footer, etc.
