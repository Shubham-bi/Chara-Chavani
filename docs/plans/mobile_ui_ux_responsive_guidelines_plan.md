# Mobile UI/UX Guardrails & Responsive Design Plan & Task List

**Module:** Shared UI/UX Design System & Responsive Mobile Guardrails  
**Reference Understanding Doc:** [mobile_ui_ux_responsive_guidelines_understanding.md](../understanding/mobile_ui_ux_responsive_guidelines_understanding.md)  
**Status:** Completed & Verified (Stage 13 Sign-off)  

---

## High-Level Architectural Approach
1. **Scaffold Shared Package `packages/ui-core`**:
   - `package.json`, `tsconfig.json` targeting clean TypeScript / React Native component library.
2. **Responsive Engine (`packages/ui-core/src/responsive`)**:
   - Implement `scale`, `verticalScale`, `moderateScale`, and `fontScale`.
   - Implement device category detection (`isSmallDevice`, `isTablet`, `screenDimensions`).
3. **Design Tokens & Theme (`packages/ui-core/src/theme`)**:
   - WCAG 2.1 AA compliant palette (Maharashtra Agriculture green `#1B5E20`, Solar amber `#E65100`, Slate neutrals, Alert reds).
   - Standardized typography scale with line-height ratios $\ge 1.35$ for Marathi regional script support.
   - 4dp/8dp base spacing system and elevation shadows.
4. **Layout & Form Components (`packages/ui-core/src/components`)**:
   - `ScreenContainer`: Safe area + KeyboardAvoidingView + ScrollView container preventing overflow and keyboard collision.
   - `ResponsiveText`: Scalable text with explicit line-height and wrap rules.
   - `ResponsiveButton`: 48dp minimum touch target, multi-variant, loading spinner, double-tap prevention.
   - `ResponsiveInput`: Input container with visible label, inline helper/error slot, and numeric keyboard mode support.
   - `ResponsiveCard`: Elevated card that safely flex-wraps children.
   - `ResponsiveBadge`: Visual status tag with appropriate semantic colors.
   - `ResponsiveRow` / `ResponsiveCol`: Grid primitives with breakpoint-aware wrapping.
5. **Update Mobile Applications**:
   - Add path mapping and dependency on `@chara-chhavani/ui-core`.
   - Refactor mobile screens in `apps/mobile-farmer`, `apps/mobile-vet`, `apps/mobile-officer`, and `apps/mobile-chhavani` to utilize these responsive components.
6. **Testing & Verification**:
   - Build `packages/ui-core` via `tsc`.
   - Verify `tsc --noEmit` across all mobile apps (`mobile-farmer`, `mobile-vet`, `mobile-officer`, `mobile-chhavani`).
   - Run unit test for responsive scaling calculations.

---

## Granular Atomic Task List

- [x] **Task 1: Scaffold `packages/ui-core` Package**
  - Scope: `package.json`, `tsconfig.json`.
  - Target: `packages/ui-core/`
- [x] **Task 2: Implement Responsive Scaling Engine & Breakpoint Utilities**
  - Scope: `scale`, `verticalScale`, `moderateScale`, `fontScale`, `deviceInfo`.
  - Target: `packages/ui-core/src/responsive/`
- [x] **Task 3: Implement Theme Tokens & UI/UX Guardrails**
  - Scope: Colors, typography, spacing, shadows, border radii.
  - Target: `packages/ui-core/src/theme/`
- [x] **Task 4: Build Overflow-Proof Layout & Form Components**
  - Scope: `ScreenContainer`, `ResponsiveText`, `ResponsiveButton`, `ResponsiveInput`, `ResponsiveCard`, `ResponsiveBadge`, `ResponsiveGrid`.
  - Target: `packages/ui-core/src/components/`
- [x] **Task 5: Integrate `ui-core` across All Mobile Apps**
  - Scope: Update tsconfig path aliases and wire up responsive layouts in `mobile-farmer`, `mobile-vet`, `mobile-officer`, `mobile-chhavani`.
  - Target: `apps/mobile-*/`
- [x] **Task 6: Build & Verification**
  - Scope: TypeScript typecheck across packages and mobile apps; unit tests for responsive math.
  - Target: Solution-wide
