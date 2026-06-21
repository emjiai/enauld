# Component Patterns Reference

Full JSX implementations for every React component in the WorkerBull landing page pattern. Adapt content (text, icons, data arrays) to the new product — the structure and patterns stay the same.

---

## Table of Contents

1. [useWindowWidth hook](#1-usewindowwidth-hook)
2. [Tick icon](#2-tick-icon)
3. [Nav](#3-nav)
4. [Hero](#4-hero)
5. [Trust](#5-trust)
6. [Features](#6-features)
7. [Showcase](#7-showcase)
8. [HowItWorks](#8-howitworks)
9. [Pricing](#9-pricing)
10. [Testimonial](#10-testimonial)
11. [FAQ](#11-faq)
12. [CTA](#12-cta)
13. [Footer](#13-footer)
14. [BookingModal](#14-bookingmodal)
15. [App (root)](#15-app-root)

---

## 1. `useWindowWidth` hook

Used by Nav to switch between desktop and mobile layouts. Attach once at the top of the `<script type="text/babel">` block.

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

## 2. `Tick` icon

Reusable checkmark SVG used in feature lists and pricing cards.

```jsx
const Tick = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
```

---

## 3. `Nav`

Sticky top nav with desktop links, theme toggle, and mobile hamburger overlay.

**Props:** `onOpenModal`, `theme`, `onToggleTheme`

**Key patterns:**
- `mobileOpen` state is local — no prop drilling needed
- `body.menu-open` class applied via effect to lock scroll when overlay is open
- `useWindowWidth()` controls `isMobile` — desktop CTA becomes hamburger at ≤960px
- Auto-closes mobile menu if window widens past breakpoint

```jsx
const Nav = ({ onOpenModal, theme, onToggleTheme }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const w = useWindowWidth();
  const isMobile = w <= 960;

  React.useEffect(() => {
    if (!isMobile && mobileOpen) setMobileOpen(false);
  }, [isMobile]);

  React.useEffect(() => {
    document.body.classList.toggle('menu-open', mobileOpen);
    return () => document.body.classList.remove('menu-open');
  }, [mobileOpen]);

  const links = [
    { label: 'Features', href: '#features' },
    { label: 'How it works', href: '#how' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <>
      <nav>
        <div className="nav-inner">
          <a href="#" className="brand">
            <div className="brand-mark">B</div>  {/* ← initial of product name */}
            <span>ProductName</span>
          </a>

          {!isMobile && (
            <ul className="nav-links">
              {links.map(l => (
                <li key={l.label}><a href={l.href}>{l.label}</a></li>
              ))}
            </ul>
          )}

          <div className="nav-actions">
            {/* Theme toggle */}
            <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

            {!isMobile ? (
              <button onClick={onOpenModal} className="btn btn-primary">Book a demo</button>
            ) : (
              <button className="hamburger" onClick={() => setMobileOpen(o => !o)} aria-label="Toggle menu">
                {mobileOpen ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M3 6h18M3 12h18M3 18h18" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
      </nav>

      {isMobile && mobileOpen && (
        <div className="mobile-nav-overlay">
          {links.map(l => (
            <a key={l.label} href={l.href} className="mobile-nav-link"
              onClick={() => setMobileOpen(false)}>{l.label}</a>
          ))}
          <button
            onClick={() => { setMobileOpen(false); onOpenModal(); }}
            className="btn btn-primary mobile-nav-cta"
          >
            Book a demo
          </button>
        </div>
      )}
    </>
  );
};
```

---

## 4. `Hero`

Two-column layout: left = copy + CTAs, right = product visual (console mock + floating stats cards).

**Props:** `onOpenModal`

**Key patterns:**
- `<header>` element (not `<section>`) — semantic landmark for the page intro
- `hero-grid` collapses to 1-column at ≤960px via CSS
- Floating cards (`.floating-card`) hidden at ≤960px via CSS `display: none`
- Console mock is purely decorative HTML — no JS state needed
- `.pulse` animation on the "Live" dot is CSS-only (`@keyframes pulse`)

```jsx
const Hero = ({ onOpenModal }) => (
  <header className="hero">
    <div className="container hero-grid">
      {/* ── LEFT: copy ── */}
      <div>
        <div className="eyebrow">
          <span className="dot" />
          Tagline · Target audience
        </div>
        <h1>Primary headline<br />with <span className="accent">italic accent.</span></h1>
        <p className="hero-sub">
          One to two sentence subheadline explaining the core value proposition clearly.
        </p>
        <div className="hero-actions">
          <button onClick={onOpenModal} className="btn btn-primary">
            Primary CTA
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
          <a href="#features" className="btn btn-ghost">Secondary CTA</a>
        </div>
        <div className="hero-meta">
          <div><strong>Stat 1</strong> label</div>
          <div><strong>Stat 2</strong> label</div>
          <div><strong>Stat 3</strong> label</div>
        </div>
      </div>

      {/* ── RIGHT: visual ── */}
      <div className="hero-visual">
        <div className="console">
          <div className="console-head">
            <span className="lbl">ProductName · Interface Name</span>
            <span className="live"><span className="pulse" />Live</span>
          </div>
          {/* Chat rows — adapt messages to product context */}
          <div className="chat-row">
            <div className="avatar user">JR</div>
            <div className="bubble user">User message here.</div>
          </div>
          <div className="chat-row">
            <div className="avatar ai">B</div>
            <div className="bubble">
              AI response with <code>highlighted term</code>.
              <div className="table-mock">
                <div className="row"><span>Item 1</span><b>value</b></div>
                <div className="row"><span>Item 2</span><b>value</b></div>
              </div>
            </div>
          </div>
          <div className="chat-row">
            <div className="avatar user">JR</div>
            <div className="bubble user">Follow-up action.</div>
          </div>
          <div className="chat-row">
            <div className="avatar ai">B</div>
            <div className="bubble">Confirmation with <code>result</code>…</div>
          </div>
        </div>

        {/* Floating stats cards — position via .calls and .tasks CSS classes */}
        <div className="floating-card calls">
          <div className="fc-label">Metric label</div>
          <div className="fc-num">37</div>
          <div className="fc-delta">+18% vs yesterday</div>
          <div className="fc-bar"><span /></div>
        </div>
        <div className="floating-card tasks">
          <div className="fc-label">Second metric</div>
          <div className="fc-num">12 / 15</div>
          <div className="fc-delta">Subtitle detail</div>
        </div>
      </div>
    </div>
  </header>
);
```

---

## 5. `Trust`

Thin social-proof bar below the hero. No props. Adapt logo text to client/partner names.

```jsx
const Trust = () => (
  <section className="trust" style={{ padding: '48px 0' }}>
    <div className="container trust-inner">
      <div className="trust-label">Trusted by operators at</div>
      <div className="trust-logos">
        <span>Halcyon</span>
        <span>MERIDIAN</span>
        <span>Northwind</span>
        <span>oakhill</span>
        <span style={{ fontWeight: 600 }}>Sterling &amp; Co.</span>
      </div>
    </div>
  </section>
);
```

**Note:** The CSS applies different font treatments to each `nth-child` so names look like real wordmarks. Add or remove `<span>` items freely — the flex layout wraps automatically.

---

## 6. `Features`

3-column card grid driven by a `featureItems` data array. No props needed.

**Key pattern:** Icon paths are raw JSX SVG children — keeps all feature data co-located in the array, no separate icon components needed.

```jsx
const featureItems = [
  {
    icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
    title: 'Feature Name',
    desc: 'Short description of what this feature does for the user.',
  },
  {
    icon: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /></>,
    title: 'Another Feature',
    desc: 'Another description.',
  },
  // … up to 9 items fills a 3×3 grid cleanly
];

const Features = () => (
  <section id="features">
    <div className="container">
      <div className="sec-head">
        <div className="sec-eyebrow">Capabilities</div>
        <h2>Section headline.</h2>
        <p>Section sub-copy explaining the value of what follows.</p>
      </div>
      <div className="features-grid">
        {featureItems.map(f => (
          <div key={f.title} className="feature">
            <div className="ico">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {f.icon}
              </svg>
            </div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
```

Grid collapses: 3-col → 2-col at ≤960px → 1-col at ≤640px (CSS handles this).

---

## 7. `Showcase`

Two-column split: left = text + checklist, right = product UI mock (kanban board). No props.

**Key pattern:** Use this section to visualise the product's "daily workflow" or signature feature. The kanban mock is static HTML — no JS interaction.

```jsx
const Showcase = () => (
  <section className="showcase" style={{ padding: '96px 0' }}>
    <div className="container showcase-grid">
      {/* ── LEFT: text ── */}
      <div>
        <div className="sec-eyebrow">Feature area name</div>
        <h2>Benefit-led headline that speaks to the core workflow.</h2>
        <p>
          Two to three sentences explaining this specific feature in more depth.
          Focus on outcome, not mechanism.
        </p>
        <ul className="check-list">
          {[
            'First concrete benefit or capability',
            'Second benefit grounded in real usage',
            'Third benefit that closes a common objection',
            'Fourth benefit or proof point',
          ].map(item => (
            <li key={item}>
              <span className="tick"><Tick /></span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* ── RIGHT: visual box ── */}
      <div className="visual-box">
        <div className="vb-head">
          <div className="vb-title">Board / view title</div>
          <div className="vb-tag">Auto-generated · 8:00</div>
        </div>
        <div className="kanban">
          <div className="kcol">
            <h5>To do</h5>
            <div className="kcard"><span className="pri urg">Urgent</span><div>Task name</div></div>
            <div className="kcard"><span className="pri high">High</span><div>Task name</div></div>
          </div>
          <div className="kcol">
            <h5>In progress</h5>
            <div className="kcard"><span className="pri high">High</span><div>Task name</div></div>
            <div className="kcard"><span className="pri med">Med</span><div>Task name</div></div>
          </div>
          <div className="kcol">
            <h5>Done</h5>
            <div className="kcard" style={{ opacity: 0.6 }}><span className="pri med">Done</span><div>Task name</div></div>
            <div className="kcard" style={{ opacity: 0.6 }}><span className="pri med">Done</span><div>Task name</div></div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
```

Available priority badge classes: `.pri.urg` (dark/urgent), `.pri.high` (gold), `.pri.med` (grey).

---

## 8. `HowItWorks`

Four-step numbered process. CSS `counter` handles the `01` `02` numbering automatically — no numbers in JSX. A gradient line connects steps (hidden on mobile).

```jsx
const HowItWorks = () => (
  <section id="how">
    <div className="container">
      <div className="sec-head">
        <div className="sec-eyebrow">Deployment</div>
        <h2>From kick-off to live in seven days.</h2>
        <p>Brief explanation of the deployment or onboarding process.</p>
      </div>
      <div className="steps">
        {[
          { title: 'Step One', desc: 'What happens in this step and why it matters.' },
          { title: 'Step Two', desc: 'The next stage with enough detail to feel real.' },
          { title: 'Step Three', desc: 'Mid-process milestone.' },
          { title: 'Step Four', desc: 'Go-live or delivery moment — frame as an outcome.' },
        ].map(s => (
          <div key={s.title} className="step">
            <h4>{s.title}</h4>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
```

Grid: 4-col → 2-col at ≤960px → 1-col at ≤640px. Connector line (`.step::after`) hides at ≤960px.

---

## 9. `Pricing`

Three-card grid. Middle card gets `.featured` class — inverted dark background, slight `scale(1.02)` transform.

**Props:** `onOpenModal`

```jsx
const Pricing = ({ onOpenModal }) => (
  <section id="pricing" className="showcase">
    <div className="container">
      <div className="sec-head">
        <div className="sec-eyebrow">Investment</div>
        <h2>Straightforward pricing. No surprises.</h2>
        <p>Sub-copy that frames value and sets expectations on what's included.</p>
      </div>
      <div className="pricing-grid">

        {/* Card 1 — entry / one-time */}
        <div className="price-card">
          <div className="price-eyebrow"><span>Tier name</span></div>
          <h3>Plan Name</h3>
          <p className="price-desc">One-sentence description of what this tier covers.</p>
          <div className="price-amount"><span className="cur">£</span><span className="num">500</span></div>
          <div className="price-period">One-time setup fee</div>
          <ul className="price-feat">
            {['Feature one','Feature two','Feature three','Feature four','Feature five'].map(f => (
              <li key={f}><span className="tick"><Tick size={10} /></span>{f}</li>
            ))}
          </ul>
          <div className="price-cta">
            <button onClick={onOpenModal} className="btn btn-ghost">CTA text</button>
          </div>
        </div>

        {/* Card 2 — featured / most popular */}
        <div className="price-card featured">
          <span className="price-tag">Most popular</span>
          <div className="price-eyebrow"><span>Tier name</span></div>
          <h3>Plan Name</h3>
          <p className="price-desc">One-sentence description.</p>
          <div className="price-amount"><span className="cur">£</span><span className="num">150</span></div>
          <div className="price-period">per month · cancel anytime</div>
          <ul className="price-feat">
            {['Feature one','Feature two','Feature three','Feature four','Feature five'].map(f => (
              <li key={f}><span className="tick"><Tick size={10} /></span>{f}</li>
            ))}
          </ul>
          <div className="price-cta">
            <button onClick={onOpenModal} className="btn btn-primary">CTA text</button>
          </div>
        </div>

        {/* Card 3 — premium / buyout */}
        <div className="price-card">
          <div className="price-eyebrow"><span>Tier name</span></div>
          <h3>Plan Name</h3>
          <p className="price-desc">One-sentence description.</p>
          <div className="price-amount"><span className="cur">£</span><span className="num">2,500</span></div>
          <div className="price-period">One-time · no recurring fee</div>
          <ul className="price-feat">
            {['Feature one','Feature two','Feature three','Feature four','Feature five'].map(f => (
              <li key={f}><span className="tick"><Tick size={10} /></span>{f}</li>
            ))}
          </ul>
          <div className="price-cta">
            <button onClick={onOpenModal} className="btn btn-ghost">CTA text</button>
          </div>
        </div>

      </div>
      <p className="pricing-note">
        Footnote text — currency, billing terms, guarantee.{' '}
        <strong>30-day satisfaction guarantee.</strong>
      </p>
    </div>
  </section>
);
```

Grid collapses to 1-column at ≤960px. `.featured` `transform: scale(1.02)` resets to `none` on mobile to avoid clipping.

---

## 10. `Testimonial`

Full-width dark band. Large decorative quote mark via CSS `::before`. No props.

```jsx
const Testimonial = () => (
  <section className="testimonial">
    <div className="container testimonial-inner">
      <blockquote>
        "Quote text with <em>italic emphasis on the most memorable phrase</em>. Rest of the quote continues here."
      </blockquote>
      <div className="quote-by">
        <div className="qa">DK</div>  {/* ← initials */}
        <div className="qm">
          <strong>Full Name</strong>
          <span>Title · Company Name</span>
        </div>
      </div>
    </div>
  </section>
);
```

The `<em>` inside `blockquote` renders in `var(--gold)` via CSS. Use it to highlight the single most quotable phrase.

---

## 11. `FAQ`

React-controlled accordion. `openIdx` state tracks which item is open. Clicking the same item again sets `openIdx` to `-1` (all closed). No `<details>`/`<summary>` — those conflict with React state.

```jsx
const faqItems = [
  { q: 'Question one?', a: 'Answer to question one.' },
  { q: 'Question two?', a: 'Answer to question two.' },
  { q: 'Question three?', a: 'Answer to question three.' },
  { q: 'Question four?', a: 'Answer to question four.' },
  { q: 'Question five?', a: 'Answer to question five.' },
  { q: 'Question six?', a: 'Answer to question six.' },
];

const FAQ = () => {
  const [openIdx, setOpenIdx] = React.useState(0);

  return (
    <section id="faq">
      <div className="container">
        <div className="sec-head">
          <div className="sec-eyebrow">Questions</div>
          <h2>What people ask before they sign.</h2>
        </div>
        <div className="faq-grid">
          {faqItems.map((item, i) => (
            <div key={i} className={`faq-item${openIdx === i ? ' open' : ''}`}>
              <button
                className="faq-q"
                onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
                aria-expanded={openIdx === i}
              >
                {item.q}
                <span className="plus" />
              </button>
              {openIdx === i && <div className="faq-a">{item.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
```

The `+` / `×` toggle is pure CSS on `.faq-item.open .faq-q .plus` — no SVG icon needed.

---

## 12. `CTA`

Final conversion section. Dark gradient card, radial gold glow via CSS `::before`. Props: `onOpenModal`.

```jsx
const CTA = ({ onOpenModal }) => (
  <section className="final-cta">
    <div className="container">
      <div className="cta-inner">
        <h2>Short punchy headline. <em>Italic second line.</em></h2>
        <p>One to two sentences. Reinforce the primary CTA — name the action and the outcome.</p>
        <div className="cta-actions">
          <button onClick={onOpenModal} className="btn btn-primary">
            Primary CTA
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
          <a href="#features" className="btn btn-ghost" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>
            Secondary CTA
          </a>
        </div>
      </div>
    </div>
  </section>
);
```

The ghost button inside `.cta-inner` needs inline `color` and `borderColor` overrides because the parent is dark — CSS variables won't produce enough contrast here.

---

## 13. `Footer`

Four-column grid: brand column + 3 link columns. Collapses to 2-col at ≤1024px, 1-col at ≤640px.

```jsx
const Footer = () => (
  <footer>
    <div className="container">
      <div className="foot-grid">
        <div className="foot-brand">
          <a href="#" className="brand">
            <div className="brand-mark">B</div>
            <span>ProductName</span>
          </a>
          <p>One to two sentence brand description. Include parent company attribution.</p>
        </div>
        <div className="foot-col">
          <h5>Product</h5>
          <ul>
            <li><a href="#features">Features</a></li>
            <li><a href="#how">Deployment</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
        </div>
        <div className="foot-col">
          <h5>Company</h5>
          <ul>
            <li><a href="https://www.workerbull.com">WorkerBull</a></li>
            <li><a href="https://www.workerbull.com/Projects.html">Case studies</a></li>
            <li><a href="https://www.workerbull.com/Contact.html">Contact</a></li>
          </ul>
        </div>
        <div className="foot-col">
          <h5>Legal</h5>
          <ul>
            <li><a href="#">Privacy</a></li>
            <li><a href="#">Terms</a></li>
            <li><a href="#">Security</a></li>
          </ul>
        </div>
      </div>
      <div className="foot-bottom">
        <span>© 2026 <strong>WorkerBull Limited</strong>. All rights reserved.</span>
        <span>Built in the United Kingdom · VAT pending</span>
      </div>
    </div>
  </footer>
);
```

---

## 14. `BookingModal`

Full booking form with EmailJS sending, loading spinner, error state, and success screen.

**Props:** `open`, `onClose`

**State:** `success`, `successMsg`, `sending`, `sendError`, `formRef`

**Key patterns:**
- Modal resets when closed (`success`, `sendError` cleared after 300ms delay to avoid flash during close animation)
- `formRef` used to read all fields via `FormData` — no controlled inputs
- Date field's `min` set to tomorrow on open
- `topic` is hardcoded to the product name — never comes from the form
- All other form fields concatenated into `details` as a newline-separated string
- Clicking the backdrop (not the modal itself) closes it via `e.target === e.currentTarget` check

```jsx
const BookingModal = ({ open, onClose }) => {
  const [success, setSuccess] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [sendError, setSendError] = React.useState('');
  const formRef = React.useRef(null);

  React.useEffect(() => {
    if (!open) {
      const t = setTimeout(() => { setSuccess(false); setSendError(''); }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  React.useEffect(() => {
    if (open) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateInput = formRef.current?.querySelector('#f-date');
      if (dateInput) dateInput.min = tomorrow.toISOString().split('T')[0];
    }
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSendError('');
    const data = new FormData(formRef.current);

    const firstName = data.get('first_name');
    const lastName  = data.get('last_name');
    const email     = data.get('email');
    const rawDate   = data.get('date');
    const time      = data.get('time');
    const dateStr   = rawDate
      ? new Date(rawDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
      : '';

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
      from_name:  `${firstName} ${lastName}`,
      from_email: email,
      topic:      'ProductName',   // ← hardcode to this product
      details:    additionalInfo,
    })
      .then(() => {
        setSending(false);
        setSuccessMsg(`Thanks ${firstName} — your slot for ${dateStr} at ${time} is reserved. A founder will email you within the next business hour to confirm.`);
        setSuccess(true);
      })
      .catch(() => {
        setSending(false);
        setSendError('Something went wrong. Please try again or email us directly at hello@workerbull.com');
      });
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        {!success ? (
          <>
            <div className="modal-head">
              <div className="sec-eyebrow">Book a deployment call</div>
              <h2>Tell us about your operation.</h2>
              <p>A 30-minute call with our founders. We'll map your stack and confirm a go-live date on the call.</p>
              <button className="modal-close" onClick={onClose} aria-label="Close">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <form className="modal-body" ref={formRef} onSubmit={handleSubmit} noValidate>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="f-date">Preferred date <span className="req">*</span></label>
                  <input type="date" id="f-date" name="date" required />
                </div>
                <div className="field">
                  <label htmlFor="f-time">Preferred time <span className="req">*</span></label>
                  <select id="f-time" name="time" required defaultValue="">
                    <option value="" disabled>Choose a slot</option>
                    {['09:00 GMT','10:00 GMT','11:00 GMT','12:00 GMT','13:00 GMT','14:00 GMT','15:00 GMT','16:00 GMT','17:00 GMT'].map(t => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="f-first">First name <span className="req">*</span></label>
                  <input type="text" id="f-first" name="first_name" placeholder="Jane" required />
                </div>
                <div className="field">
                  <label htmlFor="f-last">Last name <span className="req">*</span></label>
                  <input type="text" id="f-last" name="last_name" placeholder="Okafor" required />
                </div>
                <div className="field">
                  <label htmlFor="f-email">Work email <span className="req">*</span></label>
                  <input type="email" id="f-email" name="email" placeholder="jane@company.com" required />
                </div>
                <div className="field">
                  <label htmlFor="f-phone">Phone <span className="req">*</span></label>
                  <input type="tel" id="f-phone" name="phone" placeholder="+44 7000 000000" required />
                </div>
                <div className="field">
                  <label htmlFor="f-company">Company name <span className="req">*</span></label>
                  <input type="text" id="f-company" name="company" placeholder="Acme Ltd" required />
                </div>
                <div className="field">
                  <label htmlFor="f-sector">Sector <span className="req">*</span></label>
                  <select id="f-sector" name="sector" required defaultValue="">
                    <option value="" disabled>Select industry</option>
                    {['Oil & Gas','Professional Services','Technology & SaaS','Financial Services','Real Estate & Construction','Logistics & Supply Chain','Healthcare','Retail & E-commerce','Manufacturing','Marketing & Agencies','Education','Non-profit / Public Sector','Other'].map(s => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="field full">
                  <label htmlFor="f-needs">Briefly describe your needs <span className="req">*</span></label>
                  <textarea id="f-needs" name="needs"
                    placeholder="What would you like handled? e.g. inbox triage, reporting, lead generation…"
                    required />
                  <span className="field-hint">A sentence or two is plenty — we'll dig in on the call.</span>
                </div>
              </div>
              <div className="modal-footer">
                <p className="privacy">
                  By submitting, you agree to our <a href="#">Privacy Policy</a>. We'll only use your details to schedule this call.
                </p>
                <button type="submit" className="btn btn-primary" disabled={sending}
                  style={{ opacity: sending ? 0.7 : 1, cursor: sending ? 'not-allowed' : 'pointer' }}>
                  {sending ? (
                    <>
                      Sending…
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                        style={{ animation: 'spin 1s linear infinite' }}>
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                    </>
                  ) : (
                    <>
                      Confirm booking
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
              {sendError && (
                <p style={{ marginTop: 12, fontSize: 13, color: '#c0392b', lineHeight: 1.5 }}>
                  {sendError}
                </p>
              )}
            </form>
          </>
        ) : (
          <div className="modal-success">
            <div className="success-tick">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3>Booking received.</h3>
            <p>{successMsg}</p>
            <button className="btn btn-ghost" onClick={onClose}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
};
```

---

## 15. `App` (root)

Owns the two pieces of global state: `modalOpen` (boolean) and `theme` (string). Theme is persisted to `localStorage` using a key namespaced to the product (e.g. `bossi-theme`).

**Theme flow:**
1. On mount, read `localStorage` → set initial theme
2. On every `theme` change, write `data-theme` attribute to `<html>` + persist to `localStorage`
3. CSS variables declared under `[data-theme="dark"]` take over automatically

```jsx
const App = () => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [theme, setTheme] = React.useState('light');

  React.useEffect(() => {
    const saved = localStorage.getItem('productname-theme'); // ← namespace to product
    if (saved) setTheme(saved);
  }, []);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('productname-theme', theme);
  }, [theme]);

  const openModal  = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return (
    <>
      <Nav onOpenModal={openModal} theme={theme} onToggleTheme={toggleTheme} />
      <Hero onOpenModal={openModal} />
      <Trust />
      <Features />
      <Showcase />
      <HowItWorks />
      <Pricing onOpenModal={openModal} />
      <Testimonial />
      <FAQ />
      <CTA onOpenModal={openModal} />
      <Footer />
      <BookingModal open={modalOpen} onClose={closeModal} />
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
```

The `<div id="root"></div>` must appear **after** the closing `</script>` tag in the HTML body — Babel processes the script synchronously and `createRoot` is called immediately, so the mount target must already exist in the DOM.

---

## Adapting to a new product

1. Replace all `ProductName` / `productname` strings with the new product name
2. Update `brand-mark` initial (single letter)
3. Rewrite `featureItems` array — keep the icon/title/desc structure
4. Rewrite `faqItems` array — keep the q/a structure  
5. Update pricing figures and tier names in `Pricing`
6. Update `Trust` logos and `Testimonial` quote/attribution
7. Update `Hero` chat bubbles and `Showcase` kanban to reflect the product's actual workflow
8. Change `topic` hardcode in `BookingModal.handleSubmit` to the new product name
9. Change `localStorage` key in `App` to `productname-theme`
10. Update `Nav` links array `href` values if section IDs change
