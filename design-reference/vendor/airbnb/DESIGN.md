---
name: Cafe Yeonhee
colors:
  surface: '#fcf9f3'
  surface-dim: '#dcdad4'
  surface-bright: '#fcf9f3'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ed'
  surface-container: '#f0eee8'
  surface-container-high: '#ebe8e2'
  surface-container-highest: '#e5e2dc'
  on-surface: '#1c1c18'
  on-surface-variant: '#4f4542'
  inverse-surface: '#31312d'
  inverse-on-surface: '#f3f0ea'
  outline: '#817471'
  outline-variant: '#d2c3bf'
  surface-tint: '#6d5a55'
  primary: '#130805'
  on-primary: '#ffffff'
  primary-container: '#2c1e1a'
  on-primary-container: '#99847e'
  inverse-primary: '#dac1bb'
  secondary: '#97472e'
  on-secondary: '#ffffff'
  secondary-container: '#fe997a'
  on-secondary-container: '#772f18'
  tertiary: '#140700'
  on-tertiary: '#ffffff'
  tertiary-container: '#341b00'
  on-tertiary-container: '#ac7f52'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#f7ddd6'
  primary-fixed-dim: '#dac1bb'
  on-primary-fixed: '#261814'
  on-primary-fixed-variant: '#54433e'
  secondary-fixed: '#ffdbd0'
  secondary-fixed-dim: '#ffb59f'
  on-secondary-fixed: '#3a0a00'
  on-secondary-fixed-variant: '#793019'
  tertiary-fixed: '#ffdcbd'
  tertiary-fixed-dim: '#f0bd8b'
  on-tertiary-fixed: '#2c1600'
  on-tertiary-fixed-variant: '#623f18'
  background: '#fcf9f3'
  on-background: '#1c1c18'
  surface-variant: '#e5e2dc'
typography:
  display-lg:
    fontFamily: Noto Serif
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 60px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Noto Serif
    fontSize: 34px
    fontWeight: '400'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Noto Serif
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 42px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Noto Serif
    fontSize: 26px
    fontWeight: '400'
    lineHeight: 34px
    letterSpacing: 0em
  headline-md:
    fontFamily: Noto Serif
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Noto Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: 0em
  body-lg:
    fontFamily: Noto Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: 0em
  body-md:
    fontFamily: Noto Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Noto Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Noto Sans
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Noto Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.06em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 3rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.75rem
  space-xl: 3rem
---

## Brand & Style

This design system embodies the understated, deliberate calm of contemporary Korean cafe culture found in quiet alleyways of Seochon and Yeonhui-dong. It balances tactile warmth with pristine editorial restraint—channeling the tactile beauty of raw hanji paper, lightly oiled birchwood, and unglazed ceramic ware.

The emotional tone is unhurried, welcoming, and sensory. Interfaces must evoke the sensation of stepping off a busy Seoul street into an afternoon sanctuary filled with soft natural light and the aroma of roasted beans.

Visual direction adheres to Warm Editorial Minimalism:
- Generous, breathable margins that give imagery and typography room to resonate.
- Tactile, muted surfaces avoiding clinical pure whites or synthetic grays.
- Subtle geometric rhythm combined with gentle, organic curvature on interactive surfaces.
- Micro-interactions are smooth, cushioned, and deliberate, mimicking the quiet slide of a ceramic cup across a wooden counter.

## Colors

The color palette draws directly from the espresso bar and natural architectural materials of modern Seoul cafes:

- **Primary (`#2C1E1A` - Roasted Espresso):** A profound, dark brown with warm undertones. Replaces stark black for all key typography, interactive iconography, and dominant focal states.
- **Secondary (`#C86D51` - Muted Terracotta):** Reminiscent of baked pottery and fired clay. Used sparingly for accent badges, primary call-to-action highlights, seasonal notifications, and active states.
- **Tertiary (`#D4A373` - Warm Amber / Toasted Oat):** A soft, sunlit caramel used for subtle secondary highlights, rating stars, hover borders, and tag backgrounds.
- **Neutral (`#F7F4EE` - Oat Milk Canvas):** A soft, warm off-white surface resembling raw linen and warm foam. Never use pure `#FFFFFF` for primary screen backgrounds.

### Surface System
- **Base Canvas:** `#F7F4EE`
- **Surface Level 1 (Cards, Elevated Containers):** `#FFFFFF` with a faint warm tint (`rgba(255, 253, 250, 0.95)`).
- **Surface Subdued (Pills, Inset fields):** `#EFE9DF`
- **Text & Contrast:** Primary text sits strictly at `#2C1E1A`. Secondary copy uses `#786C65` (Warm Muted Stone). Structural borders utilize a low-contrast wash of `#E2D9CC`.

## Typography

The typographic pairing reflects contemporary Korean editorial style: a literary serif paired with an exceptionally clean, neutral sans-serif.

- **Headlines (`Noto Serif`):** Conveys quiet craft, deliberate time, and traditional balance. Used for brand narrative, featured drink collections, and article headlines. Keep letterforms regular or medium weight; avoid bold weights that break the airy elegance.
- **Body & Functional Copy (`Noto Sans`):** Ensures absolute clarity and neutral readability across menu descriptions, prices, roasting notes, and interface controls.
- **Microcopy & Metadata:** Displayed with slightly increased tracking (`0.04em` to `0.06em`) in small capitals or medium weights, establishing an organized, artisanal label appearance.

## Layout & Spacing

Layouts follow an airy, rhythmic structure prioritizing negative space as an active aesthetic element.

- **Grid Systems:**
  - **Desktop:** 12-column fluid grid, maximum content width capped at `1200px` for optimal breathing room. Gutters set to `1.5rem` (`24px`), margins to `3rem` (`48px`).
  - **Tablet:** 8-column layout, gutters `1.25rem` (`20px`), margins `2rem` (`32px`).
  - **Mobile:** 4-column layout, gutters `1rem` (`16px`), margins `1.25rem` (`20px`).

- **Spacing Rhythm:**
  - Standard component interior gap scales using `space-xs` (`4px`) and `space-sm` (`8px`) for tight item groups (e.g. coffee bean specs, price pairings).
  - Editorial spacing relies heavily on `space-lg` (`28px`) and `space-xl` (`48px`) to detach imagery from textual descriptions, reinforcing a calm, uncluttered reading tempo.

## Elevation & Depth

Depth is treated through warm atmospheric light rather than synthetic UI drop shadows:

- **Ambient Shading:** Shadows are tinted with deep roasted umber rather than neutral black, maintaining a soft, golden-hour diffusion.
  - **Resting Elevation (Cards, Containers):** `0 4px 20px -2px rgba(44, 30, 26, 0.05)`
  - **Floating / Hover Elevation (Modals, Overlays, Dropdowns):** `0 12px 32px -4px rgba(44, 30, 26, 0.09)`
- **Tonal Layering:** Visual distinction relies first on subtle surface shifts. The canvas (`#F7F4EE`) hosts panels rendered in tinted white (`#FCFAF7`), outlined by featherlight borders (`1px solid #EAE3D7`).
- **Glass & Frosting:** Header bars and bottom floating navigation use a warm translucent backdrop filter (`backdrop-filter: blur(16px); background-color: rgba(247, 244, 238, 0.82)`), softly blurring rich coffee photography underneath.

## Shapes

The shape language reflects hand-thrown ceramics and custom woodwork—gently softened corners that feel warm to the touch without devolving into playful bubble shapes.

- Corner radii apply standard `0.25rem` (`4px`) on minimal interactive components like checkboxes, small badges, and input borders.
- Mid-sized components (menu cards, modal sheets, product previews) adopt `rounded-lg` (`0.5rem` / `8px`).
- Floating panels, toast notifications, and oversized image masks utilize `rounded-xl` (`0.75rem` / `12px`).
- Fully rounded pills are reserved exclusively for filter chips and small category badges.

## Components

### Buttons
- **Primary:** Background in `#2C1E1A`, text in `#F7F4EE`, `rounded-lg` corners, horizontal padding `1.5rem`, vertical padding `0.75rem`. Subtle hover transition lightening to `#3F2D28`.
- **Secondary / Ghost:** Transparent background with a `1px` border in `#C86D51` or `#2C1E1A`. Text matches the border.
- **Tertiary (Text):** Understated text button with an underlined border offset by `4px`, transitioning color smoothly on hover.

### Chips & Tags
- Pill-shaped or subtle rounded tags (`rounded-lg`).
- Default: Background `#EFE9DF`, text `#2C1E1A`.
- Active/Selected: Background `#2C1E1A`, text `#F7F4EE`.
- Tasting Note Tag: Micro-bordered tag in `#D4A373` with `#2C1E1A` text for notes like "Bergamot", "Brown Sugar", "Jasmine".

### Cards (Menu & Coffee Offerings)
- Background `#FFFFFF` over the `#F7F4EE` canvas.
- Boundary formed by a subtle `1px solid #EAE3D7` border paired with ambient resting shadow.
- Photography occupies 60% of card height with an aspect ratio of 4:5 or 1:1, treated with natural, desaturated warmth.
- Spacing inside the card is generous (`1.25rem` padding).

### Form Fields & Inputs
- Minimalist inset style: Background `#FCFAF7`, resting border `1px solid #E2D9CC`.
- Active focus state: Border color changes to `#C86D51` with no aggressive outer focus glow, merely a soft warm ring (`0 0 0 2px rgba(200, 109, 81, 0.15)`).
- Placeholder text in `#A49A90`.

### Lists & Menus
- Menu item rows are separated by hairline borders in `#EDE6DC`.
- Item name in `Noto Sans` weight 500 (`#2C1E1A`), description in weight 400 (`#786C65`), price aligned right in tabular figures.

### Checkboxes & Radios
- Checked state fills with `#2C1E1A` containing a sharp `#F7F4EE` checkmark or inner dot.
- Unchecked state uses a `1.5px` border in `#C8BFB5` over transparent or canvas background.