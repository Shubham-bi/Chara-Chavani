import {
  ScreenContainerLayout,
  ResponsiveTextStyleResolver,
  ResponsiveCardStyleResolver,
  ResponsiveInputStyleResolver,
  ResponsiveButtonStyleResolver,
  ResponsiveBadgeStyleResolver,
  Colors,
  Spacing,
} from '@chara-chhavani/ui-core';

/**
 * AnimalAdmissionView
 * Geofence-enforced animal admission interface for Chhavani Camp Operators.
 */
export class AnimalAdmissionView {
  public static renderLayout(isInsideGeofence: boolean, isSubmitting: boolean = false) {
    return {
      screen: ScreenContainerLayout.getRootStyle({ enableSafeArea: true, stickyBottomAction: true }),
      scrollContent: ScreenContainerLayout.getScrollContentStyle({ paddingBottom: Spacing.xl }),

      headerTitle: ResponsiveTextStyleResolver.resolve({ variant: 'h2', color: Colors.primary }),
      headerSubtitle: ResponsiveTextStyleResolver.resolve({ variant: 'bodySmall', color: Colors.textSecondary }),

      // Geofence Status Banner
      geofenceBanner: {
        width: '100%',
        padding: Spacing.md,
        borderRadius: Spacing.radiusMd,
        backgroundColor: isInsideGeofence ? Colors.successLight : Colors.errorLight,
        marginBottom: Spacing.md,
        borderWidth: 1,
        borderColor: isInsideGeofence ? Colors.success : Colors.error,
      },
      geofenceText: ResponsiveTextStyleResolver.resolve({
        variant: 'label',
        color: isInsideGeofence ? Colors.success : Colors.error,
      }),

      // Search Card
      searchCard: ResponsiveCardStyleResolver.getCardStyle({ elevated: true }),
      searchLabel: ResponsiveInputStyleResolver.getLabelStyle(),
      searchInput: ResponsiveInputStyleResolver.getFieldContainerStyle({ disabled: isSubmitting }),

      // Capacity Bar
      capacityCard: ResponsiveCardStyleResolver.getCardStyle({ elevated: false, bordered: true }),
      capacityText: ResponsiveTextStyleResolver.resolve({ variant: 'bodyMedium', color: Colors.textPrimary }),

      // Submit Button (Locked if outside geofence)
      stickyBottomContainer: ScreenContainerLayout.getStickyBottomActionStyle(),
      admitButton: ResponsiveButtonStyleResolver.getContainerStyle({
        variant: 'primary',
        size: 'lg',
        fullWidth: true,
        disabled: !isInsideGeofence || isSubmitting,
      }),
      admitButtonText: ResponsiveButtonStyleResolver.getTextStyle({
        variant: 'primary',
        disabled: !isInsideGeofence || isSubmitting,
      }),
    };
  }
}
