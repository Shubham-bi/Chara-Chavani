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
import { AdmissionResult } from '@chara-chhavani/api-client';

export class AnimalReleaseView {
  public static renderLayout() {
    const isSmall = dimensionManager.isSmallDevice();

    return {
      screen: ScreenContainerLayout.getRootStyle({ enableSafeArea: true }),
      scrollContent: ScreenContainerLayout.getScrollContentStyle(),

      headerCard: ResponsiveCardStyleResolver.getCardStyle({ elevated: true }),
      titleMarathi: ResponsiveTextStyleResolver.resolve({ variant: 'h2', color: Colors.primary }),
      titleEnglish: ResponsiveTextStyleResolver.resolve({ variant: 'caption', color: Colors.textMuted }),

      // Admitted Animal Card
      animalCard: ResponsiveCardStyleResolver.getCardStyle({ elevated: false, bordered: true }),
      tagNumberText: ResponsiveTextStyleResolver.resolve({ variant: 'h3', color: Colors.textPrimary }),
      farmerNameText: ResponsiveTextStyleResolver.resolve({ variant: 'bodyMedium', color: Colors.textSecondary }),
      admittedDateText: ResponsiveTextStyleResolver.resolve({ variant: 'caption', color: Colors.textMuted }),

      // Remarks input
      remarksContainer: ResponsiveInputStyleResolver.getContainerStyle({ hasError: false }),

      // Release button (Warning / Destructive color)
      releaseButton: ResponsiveButtonStyleResolver.getContainerStyle({
        variant: 'secondary',
        size: isSmall ? 'md' : 'lg',
        fullWidth: true,
      }),
      releaseButtonText: ResponsiveButtonStyleResolver.getTextStyle({ variant: 'secondary' }),

      cancelButton: ResponsiveButtonStyleResolver.getContainerStyle({
        variant: 'outline',
        size: 'md',
        fullWidth: true,
      }),
      cancelButtonText: ResponsiveButtonStyleResolver.getTextStyle({ variant: 'outline' }),

      emptyStateText: ResponsiveTextStyleResolver.resolve({ variant: 'bodyMedium', color: Colors.textMuted }),
    };
  }
}
