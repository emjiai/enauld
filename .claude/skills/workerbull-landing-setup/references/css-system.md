# CSS System — WorkerBull Landing Pages

Full CSS to paste into the `<style>` block of every new landing page.
Product-specific overrides go after the system block.

---

## Table of Contents

1. CSS Variables (`:root` + dark theme)
2. Reset & base
3. Container
4. Navigation
5. Buttons
6. Hero section
7. Hero console visual
8. Section scaffold
9. Trust bar
10. Feature grid
11. Showcase / alternating sections
12. How it works steps
13. Pricing grid
14. Testimonial
15. FAQ accordion
16. Final CTA
17. Footer
18. Booking modal + form
19. Animations
20. Responsive media queries

---

## 1. CSS Variables

```css
:root {
  --gold:       #C9A24A;
  --gold-deep:  #A8842F;
  --gold-soft:  #E6CB85;
  --navy:       #1B2A3A;
  --graphite:   #2E2E33;
  --bg:         #FFFFFF;
  --surface:    #FAFAF7;
  --surface-2:  #F3F1EA;
  --border:     #E8E4D8;
  --text:       #14161B;
  --text-muted: #5C6068;
  --shadow:     0 1px 2px rgba(20,22,27,0.04), 0 8px 24px rgba(20,22,27,0.06);
  --shadow-lg:  0 2px 4px rgba(20,22,27,0.05), 0 24px 48px rgba(20,22,27,0.10);
  --hairline:   rgba(20,22,27,0.08);
}
[data-theme="dark"] {
  --gold:       #D4B265;
  --gold-deep:  #B5953F;
  --gold-soft:  #E6CB85;
  --navy:       #6B8AAE;
  --graphite:   #C9CCD3;
  --bg:         #000000;
  --surface:    #0B0B0D;
  --surface-2:  #131318;
  --border:     #23232A;
  --text:       #F2EFE6;
  --text-muted: #9A9CA4;
  --shadow:     0 1px 2px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.4);
  --shadow-lg:  0 2px 4px rgba(0,0,0,0.5), 0 24px 48px rgba(0,0,0,0.6);
  --hairline:   rgba(255,255,255,0.08);
}
```

---

## 2. Reset & Base

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: 'Outfit', system-ui, sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.55;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  transition: background 0.3s ease, color 0.3s ease;
  overflow-x: hidden;
}
body.menu-open { overflow: hidden; }
::selection { background: var(--gold); color: #000; }
a { color: inherit; text-decoration: none; }
img { max-width: 100%; }
```

---

## 3. Container

```css
.container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 32px;
}
```

---

## 4. Navigation

```css
nav {
  position: sticky; top: 0; z-index: 100;
  background: rgba(255,255,255,0.88);
  backdrop-filter: saturate(140%) blur(14px);
  -webkit-backdrop-filter: saturate(140%) blur(14px);
  border-bottom: 1px solid var(--hairline);
  transition: background 0.3s ease;
}
[data-theme="dark"] nav { background: rgba(0,0,0,0.88); }
.nav-inner {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 32px; max-width: 1240px; margin: 0 auto; height: 72px;
}
.brand {
  display: flex; align-items: center; gap: 10px;
  font-weight: 700; font-size: 22px; letter-spacing: -0.02em;
  color: var(--text);
}
.brand-mark {
  width: 32px; height: 32px; border-radius: 8px;
  background: linear-gradient(135deg, var(--gold) 0%, var(--gold-deep) 100%);
  display: grid; place-items: center;
  color: #1B1B1B; font-weight: 800; font-size: 16px;
  flex-shrink: 0;
}
.nav-links { display: flex; gap: 36px; list-style: none; }
.nav-links a { color: var(--text-muted); font-size: 15px; font-weight: 500; transition: color 0.2s; }
.nav-links a:hover { color: var(--text); }
.nav-actions { display: flex; gap: 12px; align-items: center; }
.theme-toggle {
  width: 38px; height: 38px; border-radius: 50%;
  border: 1px solid var(--border); background: var(--surface);
  color: var(--text); cursor: pointer;
  display: grid; place-items: center; transition: all 0.2s; flex-shrink: 0;
}
.theme-toggle:hover { border-color: var(--gold); color: var(--gold); }
.theme-toggle svg { width: 18px; height: 18px; }

/* Mobile hamburger */
.hamburger {
  display: none; background: none; border: none; cursor: pointer;
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
```

---

## 5. Buttons

```css
.btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 22px; font-family: inherit; font-size: 15px; font-weight: 600;
  border-radius: 999px; border: 1px solid transparent; cursor: pointer;
  text-decoration: none; transition: all 0.2s ease; letter-spacing: -0.01em;
  white-space: nowrap;
}
.btn-primary {
  background: linear-gradient(180deg, var(--gold) 0%, var(--gold-deep) 100%);
  color: #1B1B1B;
  box-shadow: 0 1px 0 rgba(255,255,255,0.3) inset, 0 4px 16px rgba(168,132,47,0.3);
}
.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 1px 0 rgba(255,255,255,0.3) inset, 0 8px 24px rgba(168,132,47,0.45);
}
.btn-ghost { background: transparent; color: var(--text); border-color: var(--border); }
.btn-ghost:hover { border-color: var(--gold); color: var(--gold); }
```

---

## 6. Hero Section

```css
.hero { padding: 96px 0 72px; position: relative; overflow: hidden; }
.hero-grid {
  display: grid; grid-template-columns: 1.1fr 1fr;
  gap: 64px; align-items: center;
}
.eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 6px 14px; border-radius: 999px;
  background: var(--surface-2); border: 1px solid var(--border);
  font-size: 13px; font-weight: 500; color: var(--text-muted);
  margin-bottom: 24px; letter-spacing: 0.02em;
}
.eyebrow .dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--gold); flex-shrink: 0;
}
h1 {
  font-size: clamp(40px, 6vw, 76px); font-weight: 700;
  line-height: 1.02; letter-spacing: -0.035em; margin-bottom: 24px;
}
h1 .accent {
  background: linear-gradient(135deg, var(--gold) 0%, var(--gold-deep) 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
  font-style: italic; font-weight: 600;
}
.hero-sub {
  font-size: 19px; color: var(--text-muted);
  max-width: 520px; margin-bottom: 36px; line-height: 1.55;
}
.hero-actions { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 40px; }
.hero-meta { display: flex; gap: 32px; flex-wrap: wrap; color: var(--text-muted); font-size: 14px; }
.hero-meta strong { color: var(--text); font-weight: 600; }
```

---

## 7. Hero Console Visual

```css
.hero-visual { position: relative; aspect-ratio: 4 / 5; max-height: 580px; }
.console {
  position: absolute; inset: 0;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 24px; padding: 22px; box-shadow: var(--shadow-lg);
  display: flex; flex-direction: column; overflow: hidden;
}
.console::before {
  content: ""; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
}
.console-head {
  display: flex; align-items: center; justify-content: space-between;
  padding-bottom: 16px; border-bottom: 1px solid var(--hairline);
  margin-bottom: 18px; flex-shrink: 0;
}
.console-head .lbl { font-size: 13px; color: var(--text-muted); font-weight: 500; }
.console-head .live {
  font-size: 11px; font-weight: 600; color: var(--gold);
  display: flex; align-items: center; gap: 6px;
  text-transform: uppercase; letter-spacing: 0.1em;
}
.pulse {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--gold); animation: pulse 1.6s infinite; flex-shrink: 0;
}
.chat-row { display: flex; gap: 12px; margin-bottom: 14px; flex-shrink: 0; }
.avatar {
  width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
  display: grid; place-items: center; font-size: 12px; font-weight: 700;
}
.avatar.user { background: var(--graphite); color: var(--bg); }
.avatar.ai { background: linear-gradient(135deg, var(--gold), var(--gold-deep)); color: #1B1B1B; }
.bubble {
  background: var(--surface-2); border: 1px solid var(--hairline);
  border-radius: 12px; padding: 10px 14px;
  font-size: 14px; line-height: 1.5; flex: 1; min-width: 0;
}
.bubble.user { background: var(--text); color: var(--bg); border-color: transparent; }
.bubble code { font-family: ui-monospace, monospace; font-size: 12px; color: var(--gold-deep); }
[data-theme="dark"] .bubble code { color: var(--gold); }
.table-mock {
  margin-top: 8px; font-family: ui-monospace, monospace;
  font-size: 11px; line-height: 1.7; color: var(--text-muted);
  border-top: 1px dashed var(--hairline); padding-top: 8px;
}
.table-mock .row { display: flex; justify-content: space-between; }
.table-mock .row b { color: var(--text); font-weight: 600; }
.floating-card {
  position: absolute; background: var(--bg); border: 1px solid var(--border);
  border-radius: 14px; padding: 14px 16px; box-shadow: var(--shadow-lg); font-size: 13px;
}
.floating-card.calls { top: 8%; right: -32px; width: 180px; }
.floating-card.tasks { bottom: 12%; left: -32px; width: 200px; }
.fc-label { font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; font-weight: 600; }
.fc-num { font-size: 26px; font-weight: 700; letter-spacing: -0.02em; color: var(--text); }
.fc-delta { font-size: 12px; color: var(--gold-deep); font-weight: 600; margin-top: 2px; }
[data-theme="dark"] .fc-delta { color: var(--gold); }
.fc-bar { height: 4px; border-radius: 2px; background: var(--surface-2); margin-top: 12px; overflow: hidden; }
.fc-bar > span { display: block; height: 100%; width: 72%; background: linear-gradient(90deg, var(--gold-deep), var(--gold)); border-radius: 2px; }
```

---

## 8. Section Scaffold

```css
section { padding: 96px 0; }
.sec-head { text-align: center; margin-bottom: 64px; }
.sec-eyebrow {
  font-size: 13px; font-weight: 600; color: var(--gold-deep);
  text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 16px;
}
[data-theme="dark"] .sec-eyebrow { color: var(--gold); }
.sec-head h2 {
  font-size: clamp(30px, 4.5vw, 54px); font-weight: 700;
  letter-spacing: -0.03em; line-height: 1.05; margin-bottom: 18px;
  max-width: 760px; margin-left: auto; margin-right: auto;
}
.sec-head p { font-size: 18px; color: var(--text-muted); max-width: 620px; margin: 0 auto; line-height: 1.5; }
```

---

## 9. Trust Bar

```css
.trust {
  padding: 48px 0;
  border-top: 1px solid var(--hairline); border-bottom: 1px solid var(--hairline);
  background: var(--surface);
}
.trust-inner { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
.trust-label { font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.16em; white-space: nowrap; }
.trust-logos { display: flex; gap: 40px; flex-wrap: wrap; align-items: center; color: var(--text-muted); opacity: 0.85; }
.trust-logos span { font-weight: 700; font-size: 17px; letter-spacing: -0.02em; font-style: italic; }
```

---

## 10. Feature Grid

```css
.features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.feature {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 18px; padding: 28px; transition: all 0.25s ease;
}
.feature:hover { border-color: var(--gold); transform: translateY(-2px); box-shadow: var(--shadow); }
.feature .ico {
  width: 44px; height: 44px; border-radius: 10px;
  background: rgba(201,162,74,0.12); border: 1px solid rgba(201,162,74,0.28);
  color: var(--gold-deep); display: grid; place-items: center; margin-bottom: 18px;
}
[data-theme="dark"] .feature .ico { color: var(--gold); }
.feature .ico svg { width: 22px; height: 22px; }
.feature h3 { font-size: 19px; font-weight: 600; letter-spacing: -0.02em; margin-bottom: 8px; }
.feature p { font-size: 14.5px; color: var(--text-muted); line-height: 1.55; }
```

---

## 11. Showcase / Alternating Sections

```css
.showcase { background: var(--surface); border-top: 1px solid var(--hairline); border-bottom: 1px solid var(--hairline); }
.showcase-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
.showcase h2 { font-size: clamp(28px, 3.6vw, 44px); font-weight: 700; letter-spacing: -0.03em; line-height: 1.08; margin-bottom: 20px; }
.showcase p { font-size: 17px; color: var(--text-muted); margin-bottom: 26px; }
.check-list { list-style: none; display: grid; gap: 12px; }
.check-list li { display: flex; gap: 12px; align-items: flex-start; font-size: 15.5px; }
.tick { width: 22px; height: 22px; border-radius: 50%; background: rgba(201,162,74,0.12); color: var(--gold-deep); display: grid; place-items: center; flex-shrink: 0; margin-top: 1px; }
[data-theme="dark"] .tick { color: var(--gold); }
.tick svg { width: 12px; height: 12px; }
.visual-box { background: var(--bg); border: 1px solid var(--border); border-radius: 20px; padding: 24px; box-shadow: var(--shadow); }
```

---

## 12. How It Works Steps

```css
.steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; counter-reset: step; }
.step { position: relative; padding-top: 48px; }
.step::before {
  counter-increment: step; content: "0" counter(step);
  position: absolute; top: 0; left: 0;
  font-family: ui-monospace, monospace; font-size: 13px;
  color: var(--gold-deep); font-weight: 700; letter-spacing: 0.1em;
}
[data-theme="dark"] .step::before { color: var(--gold); }
.step::after {
  content: ""; position: absolute; top: 7px; left: 38px; right: 0; height: 1px;
  background: linear-gradient(90deg, var(--gold), transparent);
}
.step:last-child::after { display: none; }
.step h4 { font-size: 19px; font-weight: 600; letter-spacing: -0.02em; margin-bottom: 8px; }
.step p { color: var(--text-muted); font-size: 14.5px; }
```

---

## 13. Pricing Grid

```css
.pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; margin-top: 24px; }
.price-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 22px; padding: 36px 32px;
  position: relative; display: flex; flex-direction: column; transition: all 0.25s ease;
}
.price-card:hover { transform: translateY(-2px); box-shadow: var(--shadow); }
.price-card.featured {
  background: var(--text); color: var(--bg);
  border: 1px solid var(--text); box-shadow: var(--shadow-lg); transform: scale(1.02);
}
.price-card.featured:hover { transform: scale(1.02) translateY(-2px); }
.price-card.featured .price-desc,
.price-card.featured .price-period { color: rgba(250,250,247,0.6); }
.price-card.featured .price-feat li { color: rgba(250,250,247,0.75); }
.price-card.featured .price-feat .tick { background: rgba(201,162,74,0.25); color: var(--gold-soft); }
.price-eyebrow { font-size: 13px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 8px; }
.price-card h3 { font-size: 24px; font-weight: 600; letter-spacing: -0.02em; margin-bottom: 8px; }
.price-desc { font-size: 14.5px; color: var(--text-muted); margin-bottom: 24px; min-height: 44px; }
.price-amount { display: flex; align-items: baseline; gap: 4px; margin-bottom: 8px; }
.price-amount .cur { font-size: 22px; font-weight: 600; }
.price-amount .num { font-size: 54px; font-weight: 700; letter-spacing: -0.04em; line-height: 1; }
.price-card.featured .price-amount .num { background: linear-gradient(135deg, var(--gold-soft), var(--gold)); -webkit-background-clip: text; background-clip: text; color: transparent; }
.price-period { font-size: 14px; color: var(--text-muted); margin-bottom: 24px; }
.price-card.featured .price-period { color: rgba(250,250,247,0.6); }
.price-tag { position: absolute; top: 24px; right: 28px; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; background: linear-gradient(135deg, var(--gold), var(--gold-deep)); color: #1B1B1B; padding: 5px 10px; border-radius: 999px; }
.price-feat { list-style: none; margin-bottom: 28px; flex: 1; display: grid; gap: 12px; }
.price-feat li { display: flex; align-items: flex-start; gap: 10px; font-size: 14.5px; }
.price-feat .tick { width: 18px; height: 18px; border-radius: 50%; display: grid; place-items: center; background: rgba(201,162,74,0.18); color: var(--gold-deep); flex-shrink: 0; margin-top: 2px; }
[data-theme="dark"] .price-feat .tick { color: var(--gold); }
.price-feat .tick svg { width: 10px; height: 10px; }
.price-cta { text-align: center; }
.price-cta .btn { width: 100%; justify-content: center; }
.price-card.featured .btn-ghost { color: var(--bg); border-color: rgba(250,250,247,0.3); }
.price-card.featured .btn-ghost:hover { color: var(--gold); border-color: var(--gold); }
.pricing-note { text-align: center; margin-top: 32px; font-size: 14px; color: var(--text-muted); }
.pricing-note strong { color: var(--text); font-weight: 600; }
```

---

## 14. Testimonial

```css
.testimonial { background: var(--text); color: var(--bg); padding: 96px 0; position: relative; overflow: hidden; }
.testimonial::before { content: "\201C"; position: absolute; top: -40px; left: 32px; font-size: 360px; color: var(--gold); opacity: 0.18; line-height: 1; font-weight: 800; pointer-events: none; }
.testimonial-inner { max-width: 880px; margin: 0 auto; text-align: center; position: relative; }
.testimonial blockquote { font-size: clamp(20px, 2.6vw, 32px); font-weight: 400; letter-spacing: -0.02em; line-height: 1.35; margin-bottom: 32px; }
.testimonial blockquote em { font-style: italic; color: var(--gold); font-weight: 500; }
.quote-by { display: flex; align-items: center; justify-content: center; gap: 14px; }
.quote-by .qa { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, var(--gold), var(--gold-deep)); display: grid; place-items: center; color: #1B1B1B; font-weight: 700; flex-shrink: 0; }
.quote-by .qm strong { display: block; font-size: 16px; }
.quote-by .qm span { font-size: 13px; opacity: 0.6; }
```

---

## 15. FAQ Accordion

```css
.faq-grid { max-width: 820px; margin: 0 auto; display: grid; gap: 14px; }
.faq-item { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; transition: border-color 0.2s; }
.faq-item.open { border-color: var(--gold); }
.faq-q {
  width: 100%; padding: 22px 26px; background: transparent; border: 0;
  font: inherit; text-align: left; color: var(--text);
  font-size: 17px; font-weight: 500; letter-spacing: -0.01em;
  cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 16px;
}
.faq-q .plus { width: 28px; height: 28px; border-radius: 50%; border: 1px solid var(--border); display: grid; place-items: center; flex-shrink: 0; transition: all 0.2s; position: relative; }
.faq-q .plus::before { content: ""; width: 10px; height: 1.5px; background: var(--text); position: absolute; transition: background 0.2s; }
.faq-q .plus::after { content: ""; width: 1.5px; height: 10px; background: var(--text); position: absolute; transition: transform 0.2s, background 0.2s; }
.faq-item.open .faq-q .plus { background: var(--gold); border-color: var(--gold); }
.faq-item.open .faq-q .plus::before { background: #1B1B1B; }
.faq-item.open .faq-q .plus::after { transform: rotate(90deg); background: #1B1B1B; }
.faq-a { padding: 0 26px 22px; color: var(--text-muted); font-size: 15.5px; line-height: 1.6; }
```

---

## 16. Final CTA

```css
.final-cta { padding: 0 0 96px; }
.cta-inner {
  background: linear-gradient(135deg, var(--graphite) 0%, var(--navy) 100%);
  border-radius: 32px; padding: 80px 48px; text-align: center; color: #fff;
  position: relative; overflow: hidden;
}
[data-theme="dark"] .cta-inner { background: linear-gradient(135deg, #14161B 0%, #0B0B0D 100%); border: 1px solid var(--gold-deep); }
.cta-inner::before { content: ""; position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 600px; height: 600px; background: radial-gradient(circle, rgba(201,162,74,0.25) 0%, transparent 70%); pointer-events: none; }
.cta-inner > * { position: relative; }
.cta-inner h2 { font-size: clamp(28px, 4.5vw, 56px); font-weight: 700; letter-spacing: -0.03em; line-height: 1.05; margin-bottom: 18px; }
.cta-inner h2 em { color: var(--gold); font-style: italic; font-weight: 600; }
.cta-inner p { font-size: 18px; color: rgba(255,255,255,0.7); margin-bottom: 36px; max-width: 560px; margin-left: auto; margin-right: auto; }
.cta-actions { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
```

---

## 17. Footer

```css
footer { border-top: 1px solid var(--hairline); padding: 48px 0 32px; }
.foot-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; margin-bottom: 40px; }
.foot-brand p { color: var(--text-muted); font-size: 14.5px; margin-top: 16px; max-width: 320px; line-height: 1.55; }
.foot-col h5 { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: var(--text-muted); margin-bottom: 16px; }
.foot-col ul { list-style: none; display: grid; gap: 10px; }
.foot-col a { color: var(--text); font-size: 15px; transition: color 0.2s; }
.foot-col a:hover { color: var(--gold-deep); }
[data-theme="dark"] .foot-col a:hover { color: var(--gold); }
.foot-bottom { border-top: 1px solid var(--hairline); padding-top: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; font-size: 13px; color: var(--text-muted); }
.foot-bottom strong { color: var(--text); font-weight: 600; }
```

---

## 18. Booking Modal + Form

```css
.modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 24px; animation: fadeIn 0.2s ease; }
.modal { background: var(--bg); border: 1px solid var(--border); border-radius: 24px; width: 100%; max-width: 720px; max-height: calc(100vh - 48px); overflow-y: auto; box-shadow: var(--shadow-lg); animation: slideUp 0.3s cubic-bezier(.2,.9,.3,1.1); position: relative; }
.modal-head { padding: 32px 36px 8px; position: relative; }
.modal-head h2 { font-size: 28px; font-weight: 700; letter-spacing: -0.025em; line-height: 1.15; margin-bottom: 8px; }
.modal-head p { color: var(--text-muted); font-size: 15px; }
.modal-close { position: absolute; top: 20px; right: 20px; width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--border); background: var(--surface); color: var(--text); cursor: pointer; display: grid; place-items: center; transition: all 0.2s; }
.modal-close:hover { border-color: var(--gold); color: var(--gold); transform: rotate(90deg); }
.modal-close svg { width: 14px; height: 14px; }
.modal-body { padding: 24px 36px 32px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field.full { grid-column: 1 / -1; }
.field label { font-size: 13px; font-weight: 600; color: var(--text); }
.field label .req { color: var(--gold-deep); margin-left: 2px; }
[data-theme="dark"] .field label .req { color: var(--gold); }
.field input, .field select, .field textarea { width: 100%; padding: 12px 14px; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; font-family: inherit; font-size: 15px; color: var(--text); transition: all 0.15s; -webkit-appearance: none; appearance: none; }
.field textarea { resize: vertical; min-height: 100px; line-height: 1.5; }
.field input:focus, .field select:focus, .field textarea:focus { outline: none; border-color: var(--gold); background: var(--bg); box-shadow: 0 0 0 4px rgba(201,162,74,0.15); }
.field select { background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' d='M1 1l5 5 5-5'/></svg>"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 36px; cursor: pointer; }
.field input::placeholder, .field textarea::placeholder { color: rgba(92,96,104,0.6); }
.field-hint { font-size: 12px; color: var(--text-muted); }
.modal-footer { margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--hairline); display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.modal-footer .privacy { font-size: 12.5px; color: var(--text-muted); max-width: 320px; line-height: 1.45; }
.modal-footer .privacy a { color: var(--text); text-decoration: underline; text-underline-offset: 2px; }
.modal-success { padding: 56px 36px 48px; text-align: center; }
.success-tick { width: 64px; height: 64px; margin: 0 auto 20px; border-radius: 50%; background: linear-gradient(135deg, var(--gold), var(--gold-deep)); color: #1B1B1B; display: grid; place-items: center; }
.success-tick svg { width: 32px; height: 32px; }
.modal-success h3 { font-size: 26px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 10px; }
.modal-success p { color: var(--text-muted); max-width: 420px; margin: 0 auto 28px; font-size: 15.5px; line-height: 1.5; }
```

---

## 19. Animations

```css
@keyframes pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 var(--gold); }
  50%       { opacity: 0.7; box-shadow: 0 0 0 6px transparent; }
}
@keyframes fadeIn  { from { opacity: 0; }                         to { opacity: 1; } }
@keyframes slideUp { from { transform: translateY(20px) scale(0.98); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
@keyframes spin    { to { transform: rotate(360deg); } }
```

---

## 20. Responsive Media Queries

These are the **required** breakpoints. Add product-specific overrides inside each one.

```css
@media (max-width: 1024px) {
  .nav-inner { padding: 18px 24px; }
  .container { padding: 0 24px; }
  .hero { padding: 80px 0 60px; }
  .foot-grid { grid-template-columns: 1fr 1fr; gap: 36px; }
}

@media (max-width: 960px) {
  /* Nav */
  .nav-links  { display: none; }
  .hamburger  { display: flex; }
  /* Layout */
  .hero-grid, .showcase-grid { grid-template-columns: 1fr; gap: 48px; }
  .features-grid { grid-template-columns: repeat(2, 1fr); }
  .pricing-grid  { grid-template-columns: 1fr; max-width: 500px; margin-left: auto; margin-right: auto; }
  .steps         { grid-template-columns: repeat(2, 1fr); }
  .step::after   { display: none; }
  /* Hero visual */
  .floating-card { display: none; }
  .hero-visual   { aspect-ratio: unset; min-height: 400px; max-height: 480px; }
  /* Pricing */
  .price-card.featured { transform: none; }
  .price-card.featured:hover { transform: translateY(-2px); }
  /* Spacing */
  section { padding: 64px 0; }
  .final-cta { padding: 0 0 64px; }
  .cta-inner { padding: 60px 32px; border-radius: 24px; }
  /* Trust */
  .trust-inner { flex-direction: column; align-items: flex-start; gap: 20px; }
  .trust-logos { gap: 28px; }
}

@media (max-width: 640px) {
  .container  { padding: 0 20px; }
  .nav-inner  { padding: 0 20px; }
  .hero       { padding: 64px 0 48px; }
  /* Grids */
  .features-grid { grid-template-columns: 1fr; }
  .steps         { grid-template-columns: 1fr; }
  .pricing-grid  { max-width: 100%; }
  /* Form */
  .form-grid { grid-template-columns: 1fr; }
  .modal-head, .modal-body { padding-left: 20px; padding-right: 20px; }
  .modal-success { padding: 40px 20px 36px; }
  .modal-footer  { flex-direction: column; }
  .modal-footer .privacy { max-width: 100%; }
  /* Footer */
  .foot-grid   { grid-template-columns: 1fr; gap: 28px; }
  .foot-bottom { flex-direction: column; align-items: flex-start; }
  /* Typography */
  h1 { font-size: clamp(34px, 10vw, 52px); }
  .hero-sub { font-size: 17px; }
  /* Spacing */
  section   { padding: 52px 0; }
  .sec-head { margin-bottom: 44px; }
  .testimonial { padding: 64px 0; }
  .testimonial::before { font-size: 240px; opacity: 0.1; }
  .cta-inner { padding: 48px 24px; border-radius: 18px; }
  .hero-visual { min-height: 360px; }
  .hero-meta { gap: 20px; }
}

@media (max-width: 400px) {
  .container { padding: 0 16px; }
  .nav-inner { padding: 0 16px; }
}
```
