---
name: Vibrant Creamery
colors:
  surface: '#fff8f9'
  surface-dim: '#e1d8da'
  surface-bright: '#fff8f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fbf1f4'
  surface-container: '#f5ebee'
  surface-container-high: '#efe6e8'
  surface-container-highest: '#e9e0e3'
  on-surface: '#1f1a1c'
  on-surface-variant: '#57404a'
  inverse-surface: '#342f31'
  inverse-on-surface: '#f8eef1'
  outline: '#8b707a'
  outline-variant: '#debec9'
  surface-tint: '#b60076'
  primary: '#8c005a'
  on-primary: '#ffffff'
  primary-container: '#b70077'
  on-primary-container: '#ffccdf'
  inverse-primary: '#ffafd1'
  secondary: '#695b59'
  on-secondary: '#ffffff'
  secondary-container: '#f2dedb'
  on-secondary-container: '#6f615f'
  tertiary: '#494a00'
  on-tertiary: '#ffffff'
  tertiary-container: '#616300'
  on-tertiary-container: '#dee200'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd8e6'
  primary-fixed-dim: '#ffafd1'
  on-primary-fixed: '#3d0025'
  on-primary-fixed-variant: '#8b0059'
  secondary-fixed: '#f2dedb'
  secondary-fixed-dim: '#d5c2c0'
  on-secondary-fixed: '#231918'
  on-secondary-fixed-variant: '#514442'
  tertiary-fixed: '#e7eb0f'
  tertiary-fixed-dim: '#cace00'
  on-tertiary-fixed: '#1c1d00'
  on-tertiary-fixed-variant: '#484a00'
  background: '#fff8f9'
  on-background: '#1f1a1c'
  surface-variant: '#e9e0e3'
typography:
  display-lg:
    fontFamily: Poppins
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
  display-lg-mobile:
    fontFamily: Poppins
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
  headline-lg:
    fontFamily: Poppins
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Poppins
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
  headline-sm:
    fontFamily: Poppins
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  title-md:
    fontFamily: Poppins
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
  body-lg:
    fontFamily: Open Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Open Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Open Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Poppins
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
  label-md:
    fontFamily: Poppins
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  label-sm:
    fontFamily: Poppins
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  gutter-mobile: 1rem
  margin-mobile: 1rem
  gutter-desktop: 1.5rem
  margin-desktop: 2rem
---

## Brand & Style

This design system expresses a joyful, indulgent, and appetizing digital experience for a modern milkshake and ice cream parlour. The personality is energetic, clean, tactile, and delightfully sweet without feeling cluttered or juvenile. 

Rooted in a minimalist mobile-first aesthetic with playful dopamine-inducing accents, the visual language balances pure white space with saturated magenta, soft strawberry creams, zesty lime yellows, and cool turquoise pops. Micro-interactions evoke the soft swirl of soft-serve and the tactile snap of toppings, ensuring navigation feels effortless, premium, and craveable.

No emojis are used in the core interface; instead, refined iconography via Google Material Symbols provides crisp, consistent clarity across interactive touchpoints.

## Colors

The palette is anchored by high-energy contrast and confectionary tones, maintaining strict WCAG 2.1 AA legibility on a clean, predominantly white canvas (`#FFFFFF`).

### Core Palette
- **Primary Magenta (`#B70077`)**: The dominant brand mark and primary action driver. Used for primary CTAs, active states, key headers, and core brand badges.
- **Secondary Pink Mist (`#FFEBE8`)**: A soft strawberry-cream tint used for subtle card surfaces, chip backgrounds, tonal hero banners, and interactive hover/press states.
- **Accent Promo Yellow (`#E2E600`)**: A high-visibility, electric chartreuse yellow reserved strictly for deals, limited-edition badges, combo alerts, and promotional ribbons.
- **Pastel Mint (`#D7F7E1`)**: Fresh pistachio green utilized for nutritional tags, vegan/sugar-free indicators, and positive order confirmation feedback.
- **Electric Turquoise (`#00C0CF`)**: Energetic pop color used for category badges (e.g., "Smoothies & Shakes"), refresh states, and delivery status milestones.
- **Neutral Dark (`#1A1618`)**: Deep berry-tinted charcoal for headings and high-priority body copy, avoiding harsh pure black.
- **Neutral Muted (`#6B5E65`)**: Mid-tone mauve slate for ingredient details, volume sizes, and secondary metadata.
- **Background Pure (`#FFFFFF`)**: Predominant background ensuring products and milkshakes take visual center stage.

## Typography

The typography combines geometric cheerfulness with high-density legibility:

- **Display & Headings (Poppins)**: Rounded, rhythmic geometry reinforces the playful, voluptuous brand identity seen in the logo. Used for milkshake names, promotions, prices, and modal titles.
- **Body & Captions (Open Sans)**: Neutral, humanist openness ensures dense topping lists, allergen warnings, and descriptions remain legible at glance-level on mobile screens.
- **Labels & Microcopy (Poppins)**: Tight, confident letterforms used for badges, buttons, counter tallies, and filter tags.

## Layout & Spacing

This design system uses an 8px base rhythm with a 4px sub-grid for icons and badges. 

### Breakpoints & Grids
- **Mobile (< 640px)**: 4-column fluid layout with `16px` margins and `12px` gutters. Product listings utilize single-column stacked rows or 2-column compact cards. Sticky bottom cart bar stays anchored with a `64px` tap boundary.
- **Tablet (640px - 1024px)**: 8-column layout with `24px` margins and `16px` gutters. Product cards snap to a 3-column grid.
- **Desktop (> 1024px)**: 12-column layout maxing out at `1200px` centered content width with `32px` gutters. Sticky side-rail category navigation on the left, interactive order summary on the right.

Vertical rhythm prioritizes breathing room around glossy product photography, with large tap targets (minimum 44x44px) tailored for thumb navigation.

## Elevation & Depth

Visual depth is kept light and tactile, simulating soft lighting on whipped cream rather than heavy structural shadows.

- **Level 0 (Flat Canvas)**: Pure `#FFFFFF` background.
- **Level 1 (Subtle Containers & Items)**: Elevated with a soft ambient glow: `0 4px 16px -2px rgba(183, 0, 119, 0.05), 0 2px 6px -1px rgba(26, 22, 24, 0.04)`. Outlined with a hair-width `#FFEBE8` border.
- **Level 2 (Active Cards & Floating Add Buttons)**: `0 8px 24px -4px rgba(183, 0, 119, 0.12), 0 4px 10px -2px rgba(26, 22, 24, 0.06)`.
- **Level 3 (Bottom Sheets & Modals)**: `0 16px 40px -6px rgba(26, 22, 24, 0.16)`. Accompanied by a 30% alpha magenta-tinted backdrop blur (`rgba(26, 22, 24, 0.3)` + `backdrop-filter: blur(8px)`).

## Shapes

The interface embraces generous, voluptuous curvatures (`rounded-2xl` / `1rem` on cards and sheets) to mirror the organic swirls of ice cream and playful lettering of the brand.

- **Standard Cards & Modals**: `1rem` (`rounded-2xl`) corner radius for approachable tactile framing.
- **Tags, Filter Chips, and Quick Add Counters**: Fully pill-shaped (`rounded-full` / `9999px`) to invite touch interactions.
- **Buttons**: Pill-shaped (`rounded-full`) for main action buttons; `1rem` (`rounded-2xl`) for secondary selection blocks.

## Components

### Buttons
- **Primary CTA**: Solid Magenta (`#B70077`) fill, pure white text (`Poppins SemiBold`), pill-shaped (`rounded-full`), height `52px` on mobile. Active state triggers an elastic scale down (`transform: scale(0.97)`).
- **Secondary CTA**: Tinted Pink (`#FFEBE8`) background with Magenta (`#B70077`) text and border.
- **Promo Action**: Accent Lime Yellow (`#E2E600`) fill with dark berry typography (`#1A1618`) for limited-time offers and upgrades.

### Chips & Filter Tabs
- **Category Chips**: Pill-shaped horizontal scrolling selector. Unselected: `#FFFFFF` surface with `1px solid #FFEBE8` border and dark text. Selected: `#B70077` fill with white text and a leading Google Material Symbol (e.g., `local_drink`, `icecream`, `cookie`).

### Product Cards
- Contained inside a `rounded-2xl` surface with a subtle 1px border (`#FFEBE8`).
- Milkshake artwork breaks the container top border slightly to create dynamic depth.
- Floating `+` button in Magenta (`#B70077`) with a Google Material Symbol `add` icon positioned at the bottom right for instantaneous cart addition.

### Checkboxes & Radio Selectors (Customizer Sheet)
- **Radio Buttons (Sizes: 300ml, 500ml, 700ml)**: Pill containers. Checked state illuminates with a `#FFEBE8` background, `#B70077` border, and magenta radio dot.
- **Checkboxes (Toppings & Caldas)**: Custom rounded squircle (`8px` radius) checkboxes displaying a crisp checkmark via Material Symbols `check`.

### Input Fields & Search
- Search bar features a pill-shaped layout with `#FFEBE8` background, `#1A1618` input text, and a leading Material Symbol `search` in Magenta `#B70077`. Zero border in idle state; transitions to `1.5px solid #B70077` on focus.

### Iconography Standard
- Strictly use **Google Material Symbols (Rounded)** with a default fill of `0` and optical size of `24px` (e.g., `shopping_bag`, `favorite`, `star`, `nutrition`, `close`). Emojis are disallowed across all functional UI components.