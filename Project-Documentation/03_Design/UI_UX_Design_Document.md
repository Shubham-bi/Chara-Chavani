# UI/UX Design Document

**Project Name:** Chara Chhavani (Digital Cattle Camp Management System)  
**Package:** `@chara-chhavani/ui-core`  
**Document Version:** 1.0.0  
**Target Viewports:** Mobile (320dp – 480dp), Phablet / Tablet (600dp – 1024dp), Desktop Web Admin (1280dp+)  
**Design System Lead:** Lead UI/UX & Mobile Architect  

---

## 1. Design System Philosophy & Core Principles

The Chara Chhavani UI/UX design system is specifically engineered for high-stress, harsh environmental conditions in rural drought relief camps. The primary users range from rural cattle camp workers and farmers with limited digital literacy to veterinary doctors wearing protective gloves in direct sunlight, and senior administrative officers reviewing large-scale visual geospatial data.

### 1.1 Core Tenets
1. **High Contrast for Sunlight Legibility:** WCAG AAA compliance (minimum 7:1 contrast ratio) for primary text and action targets to ensure usability under open-sky 42°C+ sunlight.
2. **Devanagari First Typography:** Full native Marathi script support without glyph truncation, accent clipping, or matra distortion.
3. **Touch Ergonomics in Field Environments:** Minimum touch target size of $48 \times 48\text{ dp}$ across all buttons, selectors, and form elements.
4. **Adaptive Multi-Form Factor Scaling:** Dynamic responsive scaling supporting screens from ultra-budget Android devices ($320\text{ dp}$ width) to 10" field tablets and 4K desktop command centers.
5. **Deterministic Offline Visual Cues:** Explicit status indicators (Amber banner for Offline Queue, Green badge for Real-Time Sync, Red badge for Geofence Breach).

---

## 2. Color Palette & Theming Tokens

Defined in `@chara-chhavani/ui-core/src/theme/colors.ts`:

| Token Name | Hex Code | Purpose & Usage | Contrast Ratio vs Background |
|---|---|---|---|
| `primary` | `#1B5E20` | Government Forest Green: Primary actions, verified badges, active states | 8.2:1 |
| `primaryLight` | `#4C8C4A` | Secondary action highlights, active tab borders | 4.8:1 |
| `primaryDark` | `#003300` | Header app bars, deep brand accents | 12.1:1 |
| `secondary` | `#E65100` | Saffron Ochre: Urgent field notices, pending approvals, queue warnings | 6.5:1 |
| `accent` | `#0277BD` | Water / Fodder metrics, informational links, taluka boundaries | 7.4:1 |
| `surface` | `#FFFFFF` | Mobile card surfaces, modal dialogs, tabular cells | Baseline |
| `background` | `#F4F6F8` | Screen background canvas, list viewport underlay | Baseline |
| `textPrimary` | `#212121` | High emphasis Devanagari & English body typography | 14.5:1 |
| `textSecondary`| `#616161` | Secondary metadata, timestamps, ear-tag subtext | 5.2:1 |
| `error` | `#C62828` | Geofence violations, fraud warnings, offline admission blocked alert | 7.9:1 |
| `warning` | `#F9A825` | Offline queue synchronization pending, low fodder inventory | 4.6:1 |
| `success` | `#2E7D32` | Animal admitted confirmation, inspection sign-off verified | 7.1:1 |

---

## 3. Typography & Devanagari Script Metric Rules

### 3.1 The Devanagari Matra Clipping Problem & Solution
Standard mobile layout engines (React Native Yoga / Android TextView) often calculate font bounding boxes based on Latin character baselines. In Marathi Devanagari script, upper matras (e.g., ौ, ो, े, ै, ं) and lower u-kars (ु, ू) extend significantly above and below the Latin cap-height. Without compensation, text renders with cut-off diacritics.

### 3.2 The $\text{lineHeight}$ Rule
In `@chara-chhavani/ui-core/src/theme/typography.ts`, an ironclad mathematical rule is enforced across all typography tokens:
$$\text{lineHeight} \ge 1.35 \times \text{fontSize}$$

```typescript
export const Typography = {
  h1: { fontSize: 28, lineHeight: 38, fontWeight: '700' },
  h2: { fontSize: 22, lineHeight: 30, fontWeight: '700' },
  h3: { fontSize: 18, lineHeight: 26, fontWeight: '600' },
  bodyLarge: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
  bodyMedium: { fontSize: 14, lineHeight: 20, fontWeight: '400' },
  bodySmall: { fontSize: 12, lineHeight: 18, fontWeight: '400' },
  caption: { fontSize: 10, lineHeight: 15, fontWeight: '500' }
};
```

---

## 4. Responsive Scaling & Breakpoint Engine

Implemented in `@chara-chhavani/ui-core/src/responsive/scaling.ts`:

### 4.1 Base Design Grid Reference
* Mobile Base: $375\text{ dp} \times 812\text{ dp}$
* Tablet Base: $768\text{ dp} \times 1024\text{ dp}$
* Desktop Base: $1440\text{ dp} \times 900\text{ dp}$

### 4.2 Breakpoints Matrix

```
       Small Mobile     Standard Mobile       Tablet / Phablet         Desktop Web Admin
     ┌──────────────┐  ┌───────────────┐  ┌──────────────────────┐  ┌───────────────────────┐
     │  < 360 dp    │  │ 360 - 599 dp  │  │    600 - 1023 dp     │  │      >= 1024 dp       │
     └──────────────┘  └───────────────┘  └──────────────────────┘  └───────────────────────┘
```

* **Scaling Formula:**
  $$\text{scale}(size) = \frac{\text{deviceWidth}}{375} \times size$$
  $$\text{moderateScale}(size, factor = 0.5) = size + (\text{scale}(size) - size) \times factor$$

---

## 5. UI Component Hierarchy & Design Tokens

### 5.1 Atoms & Core Primitives
* `ResponsiveText`: Renders localized strings with guaranteed Devanagari line height and font weight.
* `ResponsiveButton`: Touch target $\ge 48\text{ dp}$, elevation shadow, loading spinner, and disabled geofence state.
* `ResponsiveBadge`: Pill-shaped status indicator (`Active`, `Quarantine`, `Offline`, `Verified`).
* `ResponsiveInput`: Large-format numeric keypad trigger for Tag Number and Weight inputs.

### 5.2 Molecules & Organisms
* `CattleSummaryCard`: Displays ear tag, breed image, health indicator, owner farmer name, and entry timestamp.
* `GeofenceStatusBanner`: Sticky top-of-screen status widget showing current GPS coordinates, distance to camp center, and boundary status (Inside / Outside).
* `OfflineQueueDrawer`: Slide-up sheet showing pending background sync items with individual retry controls.

---

## 6. Accessibility & Localization (i18n)

* **Dual-Language First:** Every UI string supports instantaneous toggle between Marathi (`mr-IN`) and English (`en-IN`).
* **Screen Reader Support:** All actionable icons and photo capture elements include explicit `accessibilityLabel` attributes in Marathi.
* **Error Prevention:** Destructive actions (e.g. `Decease Animal`, `Revoke Camp Approval`) require two-step confirmation modals with explicit reason entry.
