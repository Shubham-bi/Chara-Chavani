import {
  ScreenContainerLayout,
  ResponsiveTextStyleResolver,
  ResponsiveCardStyleResolver,
  ResponsiveButtonStyleResolver,
  ResponsiveInputStyleResolver,
  Colors,
  Spacing,
  dimensionManager,
} from '@chara-chhavani/ui-core';

export class CampInspectionFormView {
  public static renderLayout() {
    const isSmall = dimensionManager.isSmallDevice();

    return {
      screen: ScreenContainerLayout.getRootStyle({ enableSafeArea: true }),
      scrollContent: ScreenContainerLayout.getScrollContentStyle(),

      headerCard: ResponsiveCardStyleResolver.getCardStyle({ elevated: true }),
      titleMarathi: ResponsiveTextStyleResolver.resolve({ variant: 'h2', color: Colors.primary }),
      titleEnglish: ResponsiveTextStyleResolver.resolve({ variant: 'caption', color: Colors.textMuted }),

      formCard: ResponsiveCardStyleResolver.getCardStyle({ elevated: false, bordered: true }),
      labelStyle: ResponsiveTextStyleResolver.resolve({ variant: 'label', color: Colors.textPrimary }),

      inputContainer: ResponsiveInputStyleResolver.getContainerStyle({ hasError: false }),
      inputErrorContainer: ResponsiveInputStyleResolver.getContainerStyle({ hasError: true }),
      errorText: ResponsiveInputStyleResolver.getHelperTextStyle({ hasError: true }),

      // Discrepancy warning banner
      discrepancyBanner: {
        backgroundColor: Colors.errorLight || '#FEE2E2',
        borderColor: Colors.error,
        borderWidth: 1,
        borderRadius: 8,
        padding: Spacing.sm,
        marginVertical: Spacing.sm,
      },
      discrepancyBannerText: ResponsiveTextStyleResolver.resolve({ variant: 'bodyMedium', color: Colors.error }),

      // GPS Stamping Info Card
      gpsCard: {
        backgroundColor: Colors.surfaceSecondary,
        padding: Spacing.sm,
        borderRadius: 8,
        marginVertical: Spacing.sm,
      },
      gpsText: ResponsiveTextStyleResolver.resolve({ variant: 'caption', color: Colors.textSecondary }),

      submitButton: ResponsiveButtonStyleResolver.getContainerStyle({
        variant: 'primary',
        size: isSmall ? 'md' : 'lg',
        fullWidth: true,
      }),
      submitButtonText: ResponsiveButtonStyleResolver.getTextStyle({ variant: 'primary' }),
    };
  }
}
