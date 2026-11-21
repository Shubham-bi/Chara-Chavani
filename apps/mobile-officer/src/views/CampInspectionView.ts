import {
  ScreenContainerLayout,
  ResponsiveTextStyleResolver,
  ResponsiveCardStyleResolver,
  ResponsiveInputStyleResolver,
  ResponsiveButtonStyleResolver,
  ResponsiveBadgeStyleResolver,
  Colors,
  Spacing,
  dimensionManager,
} from '@chara-chhavani/ui-core';

/**
 * CampInspectionView
 * Field inspection & headcount audit form with anti-overflow protections.
 */
export class CampInspectionView {
  public static renderLayout(isSubmitting: boolean = false) {
    const isSmall = dimensionManager.isSmallDevice();

    return {
      screen: ScreenContainerLayout.getRootStyle({ enableSafeArea: true, stickyBottomAction: true }),
      scrollContent: ScreenContainerLayout.getScrollContentStyle({ paddingBottom: Spacing.xl }),

      headerTitle: ResponsiveTextStyleResolver.resolve({ variant: 'h2', color: Colors.primary }),
      headerSubtitle: ResponsiveTextStyleResolver.resolve({ variant: 'bodySmall', color: Colors.textSecondary }),

      // Camp Summary Card
      campSummaryCard: ResponsiveCardStyleResolver.getCardStyle({ elevated: true }),
      campNameText: ResponsiveTextStyleResolver.resolve({ variant: 'h3', color: Colors.textPrimary }),
      campLocationText: ResponsiveTextStyleResolver.resolve({ variant: 'bodySmall', color: Colors.textMuted }),

      // GPS Badge
      gpsBadge: ResponsiveBadgeStyleResolver.getBadgeContainer('active'),
      gpsBadgeText: ResponsiveBadgeStyleResolver.getBadgeText('active'),

      // Headcount Input
      inputWrapper: ResponsiveInputStyleResolver.getWrapperStyle(),
      inputLabel: ResponsiveInputStyleResolver.getLabelStyle(),
      inputFieldContainer: (hasError: boolean, isFocused: boolean) =>
        ResponsiveInputStyleResolver.getFieldContainerStyle({ hasError, isFocused, disabled: isSubmitting }),
      textInput: ResponsiveInputStyleResolver.getTextInputStyle({ disabled: isSubmitting }),

      // Discrepancy Indicator Box
      discrepancyBox: (isDiscrepant: boolean) => ({
        width: '100%',
        padding: Spacing.md,
        borderRadius: Spacing.radiusMd,
        backgroundColor: isDiscrepant ? Colors.errorLight : Colors.successLight,
        marginVertical: Spacing.md,
      }),
      discrepancyTitle: (isDiscrepant: boolean) =>
        ResponsiveTextStyleResolver.resolve({
          variant: 'label',
          color: isDiscrepant ? Colors.error : Colors.success,
        }),

      // Sticky Bottom Submit Action
      stickyBottomContainer: ScreenContainerLayout.getStickyBottomActionStyle(),
      submitButton: ResponsiveButtonStyleResolver.getContainerStyle({
        variant: 'primary',
        size: 'lg',
        fullWidth: true,
        disabled: isSubmitting,
      }),
      submitButtonText: ResponsiveButtonStyleResolver.getTextStyle({
        variant: 'primary',
        disabled: isSubmitting,
      }),
    };
  }
}
