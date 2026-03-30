# Design System Strategy: The Intelligent Ledger

## 1. Overview & Creative North Star
This design system is built upon the Creative North Star of **"The Digital Curator."** In a world of chaotic financial data, our interface acts as a sophisticated, high-end editorial assistant. We move away from the rigid, boxy layouts of traditional corporate tools, favoring an aesthetic that feels layered, breathable, and intentionally asymmetrical. 

By leveraging deep amethyst tones and vibrant solar accents against a pristine, expansive canvas, we communicate both corporate authority and AI-driven agility. The experience is defined by "The Breathe Rule": generous use of white space that allows complex financial insights to settle into a digestible, premium narrative.

---

## 2. Colors: Depth and Vibration
Our palette is rooted in a high-contrast relationship between deep purples and energetic oranges.

*   **Primary Narrative:** The `primary` (#630ED4) and `primary_container` (#7C3AED) represent the "AI Intelligence"—stable, deep, and authoritative.
*   **Secondary Energy:** The `secondary` (#AB3500) and `secondary_container` (#FE6A34) are used for "Action and Momentum"—tracking expenses, alerts, and vital growth metrics.
*   **Surface Strategy (The "No-Line" Rule):** 1px solid borders are strictly prohibited for sectioning. We define boundaries through tonal shifts. A section should be separated from the `surface` (#FEF7FF) by transitioning into `surface_container_low` (#F9F1FF).
*   **The "Glass & Gradient" Rule:** To provide visual "soul," use subtle linear gradients (Primary to Primary Container) for high-impact CTAs. For floating AI insights, utilize Glassmorphism: `surface_container_highest` at 70% opacity with a 24px backdrop-blur.

---

## 3. Typography: Editorial Authority
We utilize a dual-typeface system to bridge the gap between human-centric readability and data-driven precision.

*   **The Voice (Manrope):** All `display` and `headline` tiers use Manrope. Its geometric yet warm curves provide a high-end editorial feel. 
    *   *Headline-LG (2rem):* Reserved for major balance summaries and page titles.
*   **The Data (Inter):** All `title`, `body`, and `label` tiers use Inter. It is the workhorse of the ledger, ensuring that even the smallest expense digits are perfectly legible.
    *   *Body-MD (0.875rem):* The standard for transaction descriptions.
    *   *Label-SM (0.6875rem):* Used for timestamps and metadata, ensuring a clean hierarchy that doesn't compete with the primary data.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are a secondary resort. Depth is primarily achieved through the **Layering Principle.**

*   **Nesting Surfaces:** To create a "lifted" card effect, place a `surface_container_lowest` (#FFFFFF) element on top of a `surface_container` (#F3EBFA) background.
*   **Ambient Shadows:** Where floating elements (like the Floating Action Button) require shadows, use a diffused blur: `0px 12px 32px rgba(123, 116, 135, 0.08)`. The shadow color must be a tint of `on_surface`, never pure black.
*   **The "Ghost Border" Fallback:** If a container requires further definition on a white background, use the `outline_variant` (#CCC3D8) at 15% opacity. It should be felt, not seen.

---

## 5. Components: The Primitive Set

### Buttons & Action
*   **Primary CTA:** Large `xl` (1.5rem) rounded corners. Use a gradient from `primary` to `primary_container`. Text is `on_primary` (White).
*   **Floating Action Button (FAB):** Circular (`full` rounding), utilizing `secondary_container` to draw immediate attention to the "Add Expense" action.

### Cards & Intelligence
*   **Data Cards:** Use `xl` (1.5rem) corner radius. Forbid the use of dividers. Separate "Category" from "Amount" using a 1.5rem (`6`) spacing gap.
*   **Progress Bars:** Use `full` rounded caps. The track should be `primary_fixed_dim`, while the progress fill uses `primary` or `secondary` based on the context (Budget vs. Spending).

### Inputs & Selection
*   **Input Fields:** Ghost-style backgrounds using `surface_container_highest`. Labels are `label-md` in `on_surface_variant`. Focus state is indicated by a 2px `primary` bottom-bar, rather than a full border.
*   **Selection Chips:** Use `secondary_fixed` for active states to provide a warm, approachable highlight that contrasts against the purple primary theme.

---

## 6. Do’s and Don’ts

### Do
*   **Do** use asymmetrical layouts. For example, align a header to the left while the primary "Total" figure sits on the right of a separate, slightly overlapping layer.
*   **Do** prioritize "Breathing Room." If you think a section needs more space, use the next level up on the Spacing Scale (e.g., move from `8` to `10`).
*   **Do** use `xl` (1.5rem) rounded corners for all major containers to maintain the "approachable" brand promise.

### Don’t
*   **Don’t** use black text. Always use `on_surface` (#1D1A24) to maintain the premium, soft-contrast feel.
*   **Don’t** use 1px dividers to separate list items. Use `surface_container_low` background shifts or 0.75rem (`3`) of vertical whitespace.
*   **Don’t** use sharp corners. Everything in this system, from tooltips to checkboxes, must have a minimum of `md` (0.75rem) rounding.