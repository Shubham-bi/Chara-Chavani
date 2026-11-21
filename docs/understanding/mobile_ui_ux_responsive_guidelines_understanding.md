# Mobile App Responsive Design & UI/UX Guardrails - Understanding Document

**Document Version:** 1.0.0  
**Status:** Approved  
**Author:** Antigravity Mobile & UX Architect  
**Lifecycle Stage:** Stage 2 (Create Understanding Document)  

---

## 1. Business Context & Problem Statement
The Chara Chhavani system operates across diverse field environments in rural Maharashtra:
- **Farmers:** Range of devices from entry-level 320px–360px budget Android smartphones to modern devices. User interface must support large fonts, high visual contrast under bright direct sunlight, and Marathi (मराठी) localization.
- **Veterinary Doctors:** Field inspection visits under dusty and outdoor conditions. Requires rapid data entry, photo verification, GPS capture, and touch targets that are easy to tap with one hand.
- **Chhavani Operators:** Continuous use at camp gates for animal admission, fodder weighing, feeding records, and expenses.
- **Government Officers:** Tablets or phablet phones for field audits, geofence boundary inspection, and headcount verification.

### Critical Failure Modes to Prevent:
1. **Content Overlap:** Text overlapping input fields, buttons colliding with sticky footers, or labels clipping adjacent components when font scaling is increased or longer regional text (Marathi) is rendered.
2. **Content Overflow & Clipping:** Fixed-width or fixed-height containers overflowing small screens ($< 360\text{ dp}$), pushing critical buttons off-screen without scroll capability.
3. **Keyboard Obstruction:** Virtual keyboard hiding active form inputs or primary submit buttons.
4. **Notch / Status Bar Clipping:** Dynamic Island, punch-holes, and hardware bottom gestures overlapping UI navigation headers or bottom action bars.
5. **Inaccessible Touch Targets:** Buttons smaller than $48 \times 48\text{ dp}$ causing mis-taps in outdoor field operations.

---

## 2. Target Device Matrix & Screen Classes

| Class | Width Range (dp) | Representative Devices | Design Adaptation Rule |
| :--- | :--- | :--- | :--- |
| **Small Phone** | $320 \le W < 360$ | Budget Android (e.g. Redmi 9A, Galaxy M02) | Stack horizontal elements vertically; decrease base padding to 12dp; enable full vertical scrolling. |
| **Standard Phone** | $360 \le W < 412$ | Pixel 6/7/8, Galaxy S21/S22/S23, iPhone 13/14/15 | Standard baseline grid (16dp gutters, 8dp rhythm). |
| **Large / Phablet** | $412 \le W < 600$ | Galaxy Note / Ultra, iPhone Pro Max | Expanded comfortable line spacing; maintain max container widths where appropriate. |
| **Tablet / Foldable** | $W \ge 600$ | iPads, Samsung Tab, Foldables unfolded | Multi-column layouts (master-detail / dual-card rows); limit single-column text width to 680dp to avoid excessive line lengths. |

---

## 3. UI/UX Guardrails & Architectural Standards

### 3.1 Responsive Scaling Engine
- **Base Guideline Dimension:** Standard baseline of $375 \times 812\text{ dp}$.
- **Horizontal Scaling (`scale(size)`):** $\text{size} \times \left(\frac{\text{screenWidth}}{375}\right)$.
- **Vertical Scaling (`verticalScale(size)`):** $\text{size} \times \left(\frac{\text{screenHeight}}{812}\right)$.
- **Moderate Scaling (`moderateScale(size, factor = 0.5)`):** $\text{size} + (\text{scale}(size) - \text{size}) \times \text{factor}$. Used for typography and paddings to prevent absurdly huge text on tablets or microscopic text on small screens.
- **Font Scaling Clamp:** Clamps font scaling between $0.85\times$ and $1.35\times$ to accommodate OS accessibility settings without breaking layout geometry.

### 3.2 Layout & Flexbox Overflow Prevention
1. **Always use Flexbox with Wrapping:**
   - Every row with variable-length text or badges must specify `flexWrap: 'wrap'` or `flexShrink: 1`.
   - Never set hardcoded fixed widths on text or form labels.
2. **Screen Container Standard:**
   - All screen roots must be wrapped in `ScreenContainer`:
     - Combines `SafeAreaView` with `KeyboardAvoidingView` (behavior `padding` on iOS, `height` on Android).
     - Houses a `ScrollView` with `contentContainerStyle={{ flexGrow: 1 }}` and `keyboardShouldPersistTaps="handled"`.
     - Sticky footer actions (e.g. "Submit Admission") are housed in an anchored bottom bar with safe-area bottom inset padding.
3. **Typography & Line Heights:**
   - Line height must always be explicitly defined and at least $1.3\times$ the font size to accommodate regional language ascenders/descenders (e.g. Marathi matras like ु, ू, ौ).
   - All `<Text>` components must declare `numberOfLines` only when truncation is explicitly desired (`ellipsizeMode="tail"`); otherwise default to auto-wrap.

### 3.3 Visual Hierarchy, Contrast & Outdoor Readability
- **Color Contrast:** Contrast ratio $\ge 4.5:1$ against backgrounds for all readable text.
- **Touch Target Size:** Interactive elements must measure at least $48 \times 48\text{ dp}$ with minimum $8\text{ dp}$ inter-element spacing.
- **Button Feedback:** Visible active opacity ($0.7$) and non-blocking activity indicator during pending API requests.
- **Form Error Placement:** Error messages render directly beneath the input field with dedicated reserve height or smooth flex expansion, avoiding UI jump.

---

## 4. Package Architecture: `@chara-chhavani/ui-core`
We will build a shared package `packages/ui-core` containing:
1. `responsive/`: `scale`, `verticalScale`, `moderateScale`, `fontScale`, `deviceInfo`, `breakpoints`.
2. `theme/`: Colors (WCAG compliant), Spacing, Typography, Shadows, Borders.
3. `components/`:
   - `ScreenContainer` (Safe-area + Keyboard-avoiding + Scrollable)
   - `ResponsiveText` (h1, h2, h3, body, label, caption, error)
   - `ResponsiveButton` (Primary, Secondary, Outline, Danger; min 48dp height; auto-loading spinner)
   - `ResponsiveInput` (Floating/clear label, numeric/text modes, inline error message)
   - `ResponsiveCard` (Card container with elevation, padding, responsive radius)
   - `ResponsiveBadge` (Status pill with appropriate contrast: Verified, Pending, Critical, etc.)
   - `ResponsiveGrid` (Row, Col with dynamic percentage widths)
4. Integration across all 4 mobile apps (`mobile-farmer`, `mobile-vet`, `mobile-officer`, `mobile-chhavani`).

---

## 5. Verification & Acceptance Criteria
- Zero horizontal scrolling or clipped text across $320\text{ dp}$, $375\text{ dp}$, $412\text{ dp}$, and $768\text{ dp}$ screen widths.
- Form controls remain visible and un-obscured when virtual keyboard activates.
- TypeScript compiler (`tsc --noEmit`) passes with zero errors across all mobile packages.
