import {
  ScreenContainerLayout,
  ResponsiveTextStyleResolver,
  ResponsiveCardStyleResolver,
  ResponsiveButtonStyleResolver,
  ResponsiveInputStyleResolver,
  ResponsiveBadgeStyleResolver,
  Colors,
  Spacing,
  dimensionManager,
} from '@chara-chhavani/ui-core';
import { AnimalDto } from '@chara-chhavani/api-client';

/**
 * VetVerificationView
 * High-contrast outdoor field inspection view for Veterinary Doctors.
 */
export class VetVerificationView {
  public static renderQueueLayout() {
    return {
      screen: ScreenContainerLayout.getRootStyle({ enableSafeArea: true }),
      scrollContent: ScreenContainerLayout.getScrollContentStyle(),

      headerTitle: ResponsiveTextStyleResolver.resolve({ variant: 'h2', color: Colors.primary }),
      headerSubtitle: ResponsiveTextStyleResolver.resolve({ variant: 'bodyMedium', color: Colors.textSecondary }),

      // Card for each pending animal
      animalCard: ResponsiveCardStyleResolver.getCardStyle({ elevated: true }),
      animalIdText: ResponsiveTextStyleResolver.resolve({ variant: 'h3', color: Colors.textPrimary }),
      farmerInfoText: ResponsiveTextStyleResolver.resolve({ variant: 'bodyMedium', color: Colors.textSecondary }),
      locationTagText: ResponsiveTextStyleResolver.resolve({ variant: 'caption', color: Colors.textMuted }),

      // Quick Inspect Button
      inspectButton: ResponsiveButtonStyleResolver.getContainerStyle({
        variant: 'primary',
        size: 'md',
      }),
      inspectButtonText: ResponsiveButtonStyleResolver.getTextStyle({ variant: 'primary' }),
    };
  }

  public static renderInspectionModalLayout(animal: AnimalDto, isSubmitting: boolean = false) {
    const isSmall = dimensionManager.isSmallDevice();

    return {
      modalContainer: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.lg,
      },

      animalTitle: ResponsiveTextStyleResolver.resolve({ variant: 'h2', color: Colors.textPrimary }),
      categoryBadge: ResponsiveBadgeStyleResolver.getBadgeContainer('pending'),
      categoryBadgeText: ResponsiveBadgeStyleResolver.getBadgeText('pending'),

      // GPS Coordinates Verification Box
      gpsBox: {
        width: '100%',
        padding: Spacing.md,
        backgroundColor: Colors.surfaceSubtle,
        borderRadius: Spacing.radiusMd,
        marginVertical: Spacing.md,
      },
      gpsLabel: ResponsiveTextStyleResolver.resolve({ variant: 'label', color: Colors.textSecondary }),
      gpsValue: ResponsiveTextStyleResolver.resolve({ variant: 'bodyMedium', color: Colors.textPrimary }),

      // Remarks Input
      remarksWrapper: ResponsiveInputStyleResolver.getWrapperStyle(),
      remarksLabel: ResponsiveInputStyleResolver.getLabelStyle(),
      remarksField: (hasError: boolean) =>
        ResponsiveInputStyleResolver.getFieldContainerStyle({ hasError, multiline: true, disabled: isSubmitting }),

      // Action Buttons (Approve vs Reject)
      buttonRow: {
        flexDirection: isSmall ? ('column' as const) : ('row' as const),
        gap: Spacing.sm,
        marginTop: Spacing.lg,
      },
      approveButton: ResponsiveButtonStyleResolver.getContainerStyle({
        variant: 'primary',
        size: 'lg',
        fullWidth: isSmall,
        disabled: isSubmitting,
      }),
      approveButtonText: ResponsiveButtonStyleResolver.getTextStyle({ variant: 'primary' }),

      rejectButton: ResponsiveButtonStyleResolver.getContainerStyle({
        variant: 'danger',
        size: 'lg',
        fullWidth: isSmall,
        disabled: isSubmitting,
      }),
      rejectButtonText: ResponsiveButtonStyleResolver.getTextStyle({ variant: 'danger' }),
    };
  }
}
