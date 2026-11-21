import {
  ScreenContainerLayout,
  ResponsiveTextStyleResolver,
  ResponsiveCardStyleResolver,
  ResponsiveButtonStyleResolver,
  ResponsiveInputStyleResolver,
  ResponsiveGridResolver,
  Colors,
  Spacing,
  dimensionManager,
} from '@chara-chhavani/ui-core';
import { CampExpenseSummaryDto } from '@chara-chhavani/api-client';

export class DailyExpenseView {
  public static renderLayout(summary?: CampExpenseSummaryDto | null) {
    const isSmall = dimensionManager.isSmallDevice();

    return {
      screen: ScreenContainerLayout.getRootStyle({ enableSafeArea: true }),
      scrollContent: ScreenContainerLayout.getScrollContentStyle(),

      headerCard: ResponsiveCardStyleResolver.getCardStyle({ elevated: true }),
      titleMarathi: ResponsiveTextStyleResolver.resolve({ variant: 'h2', color: Colors.primary }),
      titleEnglish: ResponsiveTextStyleResolver.resolve({ variant: 'caption', color: Colors.textMuted }),

      // Total expense summary card
      summaryCard: {
        backgroundColor: Colors.surfaceSecondary,
        padding: Spacing.md,
        borderRadius: 8,
        marginVertical: Spacing.sm,
      },
      summaryLabelText: ResponsiveTextStyleResolver.resolve({ variant: 'caption', color: Colors.textMuted }),
      totalExpenseText: ResponsiveTextStyleResolver.resolve({ variant: 'h1', color: Colors.warning }),

      formCard: ResponsiveCardStyleResolver.getCardStyle({ elevated: false, bordered: true }),
      labelStyle: ResponsiveTextStyleResolver.resolve({ variant: 'label', color: Colors.textPrimary }),

      inputContainer: ResponsiveInputStyleResolver.getContainerStyle({ hasError: false }),
      inputErrorContainer: ResponsiveInputStyleResolver.getContainerStyle({ hasError: true }),
      errorText: ResponsiveInputStyleResolver.getHelperTextStyle({ hasError: true }),

      submitButton: ResponsiveButtonStyleResolver.getContainerStyle({
        variant: 'primary',
        size: isSmall ? 'md' : 'lg',
        fullWidth: true,
      }),
      submitButtonText: ResponsiveButtonStyleResolver.getTextStyle({ variant: 'primary' }),
    };
  }
}
