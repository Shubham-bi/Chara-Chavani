import {
  ScreenContainerLayout,
  ResponsiveTextStyleResolver,
  ResponsiveInputStyleResolver,
  ResponsiveButtonStyleResolver,
  Colors,
  Spacing,
  dimensionManager,
} from '@chara-chhavani/ui-core';

/**
 * AnimalRegistrationView
 * Form layout preventing keyboard overlap, screen truncation, and label collision.
 */
export class AnimalRegistrationView {
  public static renderFormLayout(isSubmitting: boolean = false) {
    const isSmall = dimensionManager.isSmallDevice();

    return {
      // Safe Area Root + Scrollable Form Body
      screen: ScreenContainerLayout.getRootStyle({ enableSafeArea: true, stickyBottomAction: true }),
      scrollContent: ScreenContainerLayout.getScrollContentStyle({ paddingBottom: Spacing.xl }),

      // Form Header
      headerTitleMarathi: ResponsiveTextStyleResolver.resolve({ variant: 'h2', color: Colors.primary }),
      headerSubtitleEnglish: ResponsiveTextStyleResolver.resolve({ variant: 'bodySmall', color: Colors.textSecondary }),

      // Input Form Fields (Label + 48dp input + Inline error slot)
      inputWrapper: ResponsiveInputStyleResolver.getWrapperStyle(),
      inputLabel: ResponsiveInputStyleResolver.getLabelStyle(),
      inputFieldContainer: (hasError: boolean, isFocused: boolean) =>
        ResponsiveInputStyleResolver.getFieldContainerStyle({ hasError, isFocused, disabled: isSubmitting }),
      textInput: ResponsiveInputStyleResolver.getTextInputStyle({ disabled: isSubmitting }),
      errorText: ResponsiveInputStyleResolver.getErrorTextStyle(),

      // Photo Upload Preview Container
      photoPlaceholder: {
        width: '100%',
        minHeight: isSmall ? 140 : 180,
        backgroundColor: Colors.surfaceSubtle,
        borderRadius: Spacing.radiusMd,
        borderWidth: 1.5,
        borderColor: Colors.borderDark,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        marginBottom: Spacing.md,
      },

      // Sticky Bottom Submit Bar (Anchored above iPhone home indicator / Android navigation bar)
      stickyBottomContainer: ScreenContainerLayout.getStickyBottomActionStyle(),
      submitButton: ResponsiveButtonStyleResolver.getContainerStyle({
        variant: 'primary',
        size: 'lg',
        fullWidth: true,
        disabled: isSubmitting,
        loading: isSubmitting,
      }),
      submitButtonText: ResponsiveButtonStyleResolver.getTextStyle({
        variant: 'primary',
        disabled: isSubmitting,
      }),
    };
  }
}
