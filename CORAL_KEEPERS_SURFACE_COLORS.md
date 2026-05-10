# Coral Keepers — page vs card colors (match the HTML prototypes)

Use these values so another app matches **Teacher** / **Student** home and card styling exactly.

Source: shared `:root` tokens and `.card` / `body` rules in `Teacher/index.html` and `Student/index.html` (same numbers).

---

## Core surfaces

| Role | Value | Notes |
|------|--------|--------|
| **Page background** | `#faf9f8` | Warm off-white canvas; applied to `body` as `background: var(--bg)` |
| **Card / primary surface** | `#ffffff` | Solid white for elevated panels (`.card`, headers on cards, etc.) |

---

## Card chrome (use with white cards)

These sit with the card surface so edges read correctly against `#faf9f8`:

| Token | Value |
|-------|--------|
| Card border | `rgba(0, 0, 0, 0.1)` |
| Inner divider / hairlines | `rgba(0, 0, 0, 0.05)` |
| Card shadow | `0 1px 2px rgba(0, 0, 0, 0.05)` |
| Card corner radius | `8px` |

---

## Optional: top navigation bar (fixed header)

Not the same as the page background — it’s a frosted strip:

| Role | Value |
|------|--------|
| Nav background | `rgba(255, 255, 255, 0.95)` with ~`backdrop-filter: blur(6px)` |
| Nav bottom border | `1px solid rgba(0, 0, 0, 0.1)` |

---

## Drop-in CSS (same as prototypes)

```css
:root {
  --bg: #faf9f8;
  --text-dark: #2f3333;
  --text-muted: #5b605f;
  --blue: #0075de;
  --green: #16a34a;
  --card-border: rgba(0, 0, 0, 0.1);
  --divider: rgba(0, 0, 0, 0.05);
  --shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  --radius-card: 8px;
}

body {
  background: var(--bg);
  color: var(--text-dark);
}

.card {
  background: #ffffff;
  border: 1px solid var(--card-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow);
}
```

---

## Quick sanity check

- Page canvas should read **slightly warm gray**, not pure `#ffffff`.
- Cards should read **clean white** with a **very light** border and shadow — no heavy elevation.

For broader typography and accent rules, see `DESIGN_GUIDELINES.md` §4 and §6.
