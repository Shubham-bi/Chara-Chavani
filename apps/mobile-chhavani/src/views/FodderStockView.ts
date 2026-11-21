import {
  ScreenContainerLayout,
  ResponsiveTextStyleResolver,
  ResponsiveCardStyleResolver,
  ResponsiveButtonStyleResolver,
  ResponsiveGridResolver,
  Colors,
  Spacing,
} from '@chara-chhavani/ui-core';
import { FodderStockItemDto } from '@chara-chhavani/api-client';

/**
 * FodderStockView
 * Dual-source inventory management view (Store vs InFarm) with anti-overlap responsive layout.
 */
export class FodderStockView {
  public static renderLayout(stocks: FodderStockItemDto[]) {
    return {
      screen: ScreenContainerLayout.getRootStyle({ enableSafeArea: true }),
      scrollContent: ScreenContainerLayout.getScrollContentStyle(),

      headerTitle: ResponsiveTextStyleResolver.resolve({ variant: 'h2', color: Colors.primary }),
      headerSubtitle: ResponsiveTextStyleResolver.resolve({ variant: 'bodySmall', color: Colors.textSecondary }),

      // Dual-Source Grid
      stockGridRow: ResponsiveGridResolver.getRowStyle({ gutter: Spacing.sm }),
      stockGridCol: ResponsiveGridResolver.getColStyle({ span: 6, smallSpan: 12 }),

      storeCard: ResponsiveCardStyleResolver.getCardStyle({ elevated: true }),
      inFarmCard: ResponsiveCardStyleResolver.getCardStyle({ elevated: true }),

      stockCategoryTitle: ResponsiveTextStyleResolver.resolve({ variant: 'h3', color: Colors.textPrimary }),
      stockQuantityText: ResponsiveTextStyleResolver.resolve({ variant: 'h1', color: Colors.primary }),
      sourceBadgeText: ResponsiveTextStyleResolver.resolve({ variant: 'caption', color: Colors.textMuted }),

      // Action Buttons Row (Record Purchase & Record Feeding)
      actionButtonRow: {
        flexDirection: 'row' as const,
        flexWrap: 'wrap' as const,
        gap: Spacing.sm,
        marginTop: Spacing.md,
      },
      purchaseButton: ResponsiveButtonStyleResolver.getContainerStyle({
        variant: 'primary',
        size: 'md',
        fullWidth: true,
      }),
      purchaseButtonText: ResponsiveButtonStyleResolver.getTextStyle({ variant: 'primary' }),

      feedingButton: ResponsiveButtonStyleResolver.getContainerStyle({
        variant: 'secondary',
        size: 'md',
        fullWidth: true,
      }),
      feedingButtonText: ResponsiveButtonStyleResolver.getTextStyle({ variant: 'secondary' }),
    };
  }
}
