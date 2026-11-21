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

export class FarmerProfileView {
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

      saveButton: ResponsiveButtonStyleResolver.getContainerStyle({
        variant: 'primary',
        size: isSmall ? 'md' : 'lg',
        fullWidth: true,
      }),
      saveButtonText: ResponsiveButtonStyleResolver.getTextStyle({ variant: 'primary' }),

      cancelButton: ResponsiveButtonStyleResolver.getContainerStyle({
        variant: 'outline',
        size: 'md',
        fullWidth: true,
      }),
      cancelButtonText: ResponsiveButtonStyleResolver.getTextStyle({ variant: 'outline' }),

      divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: Spacing.md,
      },
    };
  }
}
