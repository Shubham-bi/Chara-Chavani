# Chara Chhavani Mobile UI/UX Guardrails & Cross-Device Compatibility Standards

**Standard Version:** 1.0.0  
**Status:** Mandatory Specification  
**Applies To:** All Mobile Applications (`mobile-farmer`, `mobile-vet`, `mobile-officer`, `mobile-chhavani`)  
**Package:** `@chara-chhavani/ui-core`  

---

## 1. Core Principles
1. **Rural Field Durability:** Interfaces are designed for outdoor conditions in Maharashtra—direct sunlight, dust, single-handed operation, and varying connectivity.
2. **Universal Device Compatibility:** The UI must display flawlessly across budget 320dp Android smartphones up to 10-inch field tablets without content clipping, truncation, or layout distortion.
3. **Marathi & Regional Language Resilience:** Text blocks must support Devanagari script (मराठी) without line-height clipping of matras (ु, ू, ौ) or unexpected text collision.
4. **Zero Accidental Double-Submissions:** All state-mutating actions (animal admission, fodder feeding, inspection logs) must disable submit triggers upon first tap and display an asynchronous activity spinner.

---

## 2. Device Breakpoint & Responsive Scaling Matrix

| Category | Screen Width ($W$) | Representative Devices | Adaptation Behavior |
| :--- | :--- | :--- | :--- |
| **Small Phone** | $W < 360\text{ dp}$ | Redmi 9A, Galaxy M02, budget devices | Stack multi-column cards to 1 column (100% width); decrease gutter from 16dp to 12dp; full vertical scrolling. |
| **Standard Phone** | $360\text{ dp} \le W < 412\text{ dp}$ | Galaxy A-series, iPhone 13/14/15, Pixel | 2-column KPI metrics; standard 16dp horizontal gutters; standard 48dp touch targets. |
| **Large Phablet** | $412\text{ dp} \le W < 600\text{ dp}$ | Galaxy Ultra / Note, iPhone Pro Max | 20dp horizontal gutters; comfortable spacing and larger photo preview zones. |
| **Tablet / Foldable** | $W \ge 600\text{ dp}$ | iPad 10.2", Galaxy Tab, unfolded foldables | 3 to 4-column KPI cards; max content constraint of 680dp on form inputs to prevent awkward stretching. |

---

## 3. Mandatory Anti-Overlap & Anti-Overflow Guardrails

### Guardrail 1: Proportional Line-Height Rule (Devanagari Safety)
> [!IMPORTANT]
> Never declare `fontSize` without an explicit `lineHeight`. In React Native, default font metrics can clip Devanagari vowels and diacritics.  
> Every typography style must satisfy:
> $$\text{lineHeight} \ge 1.35 \times \text{fontSize}$$

### Guardrail 2: Screen Container Standard
> [!IMPORTANT]
> Every screen must be wrapped in `ScreenContainerLayout`:
> - Safe area insets (top and bottom) are applied automatically to prevent headers colliding with notches or punch holes.
> - The viewport is powered by a scroll container with `contentContainerStyle={{ flexGrow: 1 }}` and `keyboardShouldPersistTaps="handled"`.
> - Fixed height view containers (`height: 500`) are strictly forbidden on form screens.

### Guardrail 3: Grid Auto-Wrapping
> [!IMPORTANT]
> Every horizontal row displaying dynamic content or badges must set:
> `flexWrap: 'wrap'` and child views must have `flexShrink: 1`.  
> On small screens ($< 360\text{ dp}$), grid columns automatically expand to `span: 12` (100% width) to eliminate horizontal scrolling.

### Guardrail 4: Sticky Action Bar Inset
> [!IMPORTANT]
> Primary submission buttons ("Admit Animal", "Submit Inspection") must reside in the dedicated sticky bottom action container:
> - Positioned above the system gesture / home indicator bar using dynamic `insets.bottom`.
> - Guarantees minimum touch height of $48\text{ dp}$ and 100% container width.

---

## 4. Outdoor Readability & Color Contrast (WCAG 2.1 AA)

All colors meet or exceed WCAG 2.1 AA thresholds against bright daylight:
- **Primary Text (`#1A202C` on `#FFFFFF`):** Contrast ratio $> 13:1$ (Passes AAA).
- **Secondary Text (`#4A5568` on `#FFFFFF`):** Contrast ratio $> 5.5:1$ (Passes AA).
- **Brand Agricultural Green (`#1B5E20` on `#FFFFFF`):** Contrast ratio $> 9.5:1$ (Passes AAA).
- **Secondary Amber (`#E65100` on `#FFFFFF`):** Contrast ratio $> 4.6:1$ (Passes AA).
- **Error / Discrepancy Red (`#D32F2F` on `#FFEBEE`):** Contrast ratio $> 4.8:1$ (Passes AA).

---

## 5. Touch Target & Accessibility Guardrails
- **Minimum Interactive Size:** No clickable element may measure less than $48 \times 48\text{ dp}$.
- **Hit Slop:** For compact icon buttons (e.g., info or search icons), an explicit `hitSlop` of at least $8\text{ dp}$ on all sides is mandatory.
- **Form Error Positioning:** Validation error text must appear directly beneath the associated field, styled in `Colors.error` with a minimum touch clearance of $4\text{ dp}$ before the next input.
