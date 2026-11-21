import {
  ScreenContainerLayout,
  ResponsiveTextStyleResolver,
  ResponsiveCardStyleResolver,
  ResponsiveButtonStyleResolver,
  ResponsiveGridResolver,
  Colors,
  Spacing,
} from '@chara-chhavani/ui-core';
import { OfficerDashboardSummaryDto } from '@chara-chhavani/api-client';

/**
 * OfficerDashboardView
 * Responsive layout for Government Field Inspectors and Officers.
 */
export class OfficerDashboardView {
  public static renderLayout(data?: OfficerDashboardSummaryDto) {
    return {
      screen: ScreenContainerLayout.getRootStyle({ enableSafeArea: true }),
      scrollContent: ScreenContainerLayout.getScrollContentStyle(),

      headerTitle: ResponsiveTextStyleResolver.resolve({ variant: 'h2', color: Colors.primary }),
      headerSubtitle: ResponsiveTextStyleResolver.resolve({ variant: 'bodyMedium', color: Colors.textSecondary }),

      // Quick Action: Register New Camp
      registerCampButton: ResponsiveButtonStyleResolver.getContainerStyle({
        variant: 'primary',
        size: 'lg',
        fullWidth: true,
      }),
      registerCampButtonText: ResponsiveButtonStyleResolver.getTextStyle({ variant: 'primary' }),

      // KPI Metric Grid (Auto-wrapping with gutters)
      statsGridRow: ResponsiveGridResolver.getRowStyle({ gutter: Spacing.sm }),
      statsGridCol: ResponsiveGridResolver.getColStyle({ span: 6, smallSpan: 12, tabletSpan: 3 }),

      // Metric Cards
      card: ResponsiveCardStyleResolver.getCardStyle({ elevated: true }),
      metricTitle: ResponsiveTextStyleResolver.resolve({ variant: 'caption', color: Colors.textMuted }),
      metricValue: ResponsiveTextStyleResolver.resolve({ variant: 'h1', color: Colors.textPrimary }),

      // Discrepancy Alert Card (Highlighted in alert red if > 0)
      discrepancyCard: (hasDiscrepancies: boolean) =>
        ResponsiveCardStyleResolver.getCardStyle({
          elevated: true,
          backgroundColor: hasDiscrepancies ? Colors.errorLight : Colors.surface,
        }),
      discrepancyText: (hasDiscrepancies: boolean) =>
        ResponsiveTextStyleResolver.resolve({
          variant: 'h2',
          color: hasDiscrepancies ? Colors.error : Colors.textPrimary,
        }),
    };
  }
}
