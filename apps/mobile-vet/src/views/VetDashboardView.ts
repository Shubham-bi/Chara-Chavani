import {
  ScreenContainerLayout,
  ResponsiveTextStyleResolver,
  ResponsiveCardStyleResolver,
  ResponsiveButtonStyleResolver,
  ResponsiveGridResolver,
  Colors,
  Spacing,
  dimensionManager,
} from '@chara-chhavani/ui-core';
import { VetDashboardDto } from '@chara-chhavani/api-client';

export class VetDashboardView {
  public static renderLayout(data?: VetDashboardDto | null) {
    const isSmall = dimensionManager.isSmallDevice();

    return {
      screen: ScreenContainerLayout.getRootStyle({ enableSafeArea: true }),
      scrollContent: ScreenContainerLayout.getScrollContentStyle(),

      headerCard: ResponsiveCardStyleResolver.getCardStyle({ elevated: true }),
      doctorNameText: ResponsiveTextStyleResolver.resolve({ variant: 'h2', color: Colors.primary }),
      doctorDesignationText: ResponsiveTextStyleResolver.resolve({ variant: 'bodyMedium', color: Colors.textSecondary }),

      // Quick CTA Button to open Pending Queue
      openQueueButton: ResponsiveButtonStyleResolver.getContainerStyle({
        variant: 'primary',
        size: isSmall ? 'md' : 'lg',
        fullWidth: true,
      }),
      openQueueButtonText: ResponsiveButtonStyleResolver.getTextStyle({ variant: 'primary' }),

      viewHistoryButton: ResponsiveButtonStyleResolver.getContainerStyle({
        variant: 'outline',
        size: 'md',
        fullWidth: true,
      }),
      viewHistoryButtonText: ResponsiveButtonStyleResolver.getTextStyle({ variant: 'outline' }),

      // Grid of KPI counts
      statsGridRow: ResponsiveGridResolver.getRowStyle({ gutter: Spacing.sm }),
      statsGridCol: ResponsiveGridResolver.getColStyle({ span: 6, smallSpan: 12, tabletSpan: 4 }),

      statCard: ResponsiveCardStyleResolver.getCardStyle({ elevated: false, bordered: true }),
      statTitleText: ResponsiveTextStyleResolver.resolve({ variant: 'caption', color: Colors.textMuted }),
      statValueText: ResponsiveTextStyleResolver.resolve({ variant: 'h1', color: Colors.textPrimary }),

      sectionTitleMarathi: ResponsiveTextStyleResolver.resolve({ variant: 'h3', color: Colors.textPrimary }),
      sectionTitleEnglish: ResponsiveTextStyleResolver.resolve({ variant: 'caption', color: Colors.textMuted }),
    };
  }
}
