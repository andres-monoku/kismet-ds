# Kismet Design System — HTML

The Figma design system (*Kismet Design Explorations*) as plain HTML + CSS + a small script, for real prototypes.
No build step, no dependencies.

## Use it

```html
<!doctype html>
<html lang="en" data-theme="electric">  <!-- electric · submarine · salad · skittles · lego -->
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="css/kismet.css">
  <script src="js/kismet.js" defer></script>
</head>
<body><div class="k-page"> … </div></body>
</html>
```

- **Documentation and every component with its markup:** open `index.html`.
- **Full page example:** `examples/landing-topper.html` (desktop + mobile).
- **Preview with a local server:** `node tools/serve.mjs` → http://localhost:4173 (opening the files directly also works).

## What is inside

| Path | What |
|---|---|
| `css/tokens.css` | Design tokens generated from the Figma variables: primitives, semantic colors (5 themes), type, spacing, radius, motion, shadows, plus one class per text style (`.text-heading-lg`). |
| `css/icons.css`, `css/shapes.css` | Icons and brand shapes as CSS masks (take the text color; work from `file://`). |
| `css/base.css` | Reset, layout helpers, cap-height text trimming. |
| `css/components.css` | Button, Icon button, Badge, Checkbox, Radio, Check row, Input field, Textarea, Select, Chip, Segmented control, Tabs, Accordion, Price, Rating, List item, Alert, Quantity stepper. |
| `css/patterns.css` | Brand (organic button, marquee, logo marquee, wave edge, sticker), Header, Fold, Product card + product row, Footer, account (Saved item, Order line), cart (Cart line, Cart summary, purchase bar) and landing sections (Split hero, Split content, Signup band, Steps, Value props). |
| `css/kismet.css` | Entry point — imports all of the above. |
| `js/kismet.js` | Organic button shape, looping marquees, theme switch, slider navigation, stepper, single-choice groups. |
| `assets/` | Brand fonts (Sans Plomb, Apercu), photos and press logos. |
| `tools/` | Token / icon / shape generators and the preview server. |

## Rules (same as in Figma)

1. **Mobile first.** Base values are the Mobile mode; Desktop applies from `1024px`.
2. **Tokens only** — semantic tokens (`--color-bg-*`, `--color-text-*`, `--color-action-*`), never primitives or hex values.
3. **Themes** — set `data-theme` on `<html>`. Use paired tokens (nav, top bar, marquee, hero panel) so text stays legible in every theme. Never pair two free accents.
4. **Component height never changes between states** (input focus, tabs, product card hover).
5. **Photo headers (`.k-fold`) always carry an overlay** — gradient on desktop, flat on mobile.
6. **Mobile product sliders** show previous / next buttons right below the cards (`.k-slider-nav`).
7. **Product card photos**: swap the `<img>` only; the white gradient is part of the card.
8. **Primary CTA** keeps white text on the brand color (accepted brand exception to the contrast rule).

## Notes

- Text boxes are trimmed to the cap height with `text-box: trim-both cap alphabetic`, like the Figma text styles
  ("Vertical trim"). Supported in Chrome / Edge 133+ and Safari 18.2+. Other browsers render slightly taller text boxes.
- States can be pinned for static mockups with `.is-hover`, `.is-pressed`, `.is-focus`, `.is-selected`, `.is-error`, `.is-disabled`.
- Regenerate tokens after changing the Figma variables: update `tools/data/*.txt`, then run
  `node tools/build-tokens.mjs`, `node tools/build-icons.mjs`, `node tools/build-shapes.mjs`.
