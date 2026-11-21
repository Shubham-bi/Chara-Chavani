import {
  ScreenContainerLayout,
  ResponsiveTextStyleResolver,
  ResponsiveCardStyleResolver,
  ResponsiveBadgeStyleResolver,
  ResponsiveButtonStyleResolver,
  Colors,
  Spacing,
  dimensionManager,
} from '@chara-chhavani/ui-core';
import { AnimalDto } from '@chara-chhavani/api-client';

export class MyAnimalsView {
  public static renderLayout() {
    const isSmall = dimensionManager.isSmallDevice();

    return {
      screen: ScreenContainerLayout.getRootStyle({ enableSafeArea: true }),
      scrollContent: ScreenContainerLayout.getScrollContentStyle(),

      headerCard: ResponsiveCardStyleResolver.getCardStyle({ elevated: true }),
      titleMarathi: ResponsiveTextStyleResolver.resolve({ variant: 'h2', color: Colors.primary }),
      titleEnglish: ResponsiveTextStyleResolver.resolve({ variant: 'caption', color: Colors.textMuted }),

      // Filter tabs container
      tabsRow: {
        flexDirection: 'row',
        paddingVertical: Spacing.sm,
        gap: Spacing.xs,
        flexWrap: 'wrap',
      },

      filterTab: (isActive: boolean) => ResponsiveButtonStyleResolver.getContainerStyle({
        variant: isActive ? 'primary' : 'outline',
        size: 'sm',
      }),
      filterTabText: (isActive: boolean) => ResponsiveButtonStyleResolver.getTextStyle({
        variant: isActive ? 'primary' : 'outline',
      }),

      // Animal Card
      animalCard: ResponsiveCardStyleResolver.getCardStyle({ elevated: false, bordered: true }),
      animalTagText: ResponsiveTextStyleResolver.resolve({ variant: 'h3', color: Colors.textPrimary }),
      animalBreedText: ResponsiveTextStyleResolver.resolve({ variant: 'bodyMedium', color: Colors.textSecondary }),
      animalDetailsText: ResponsiveTextStyleResolver.resolve({ variant: 'caption', color: Colors.textMuted }),

      emptyStateText: ResponsiveTextStyleResolver.resolve({ variant: 'bodyMedium', color: Colors.textMuted }),

      addNewButton: ResponsiveButtonStyleResolver.getContainerStyle({
        variant: 'primary',
        size: isSmall ? 'md' : 'lg',
        fullWidth: true,
      }),
      addNewButtonText: ResponsiveButtonStyleResolver.getTextStyle({ variant: 'primary' }),
    };
  }

  public static getStatusBadge(status: string) {
    const normalized = status.toLowerCase() as any;
    return {
      container: ResponsiveBadgeStyleResolver.getBadgeContainer(normalized),
      text: ResponsiveBadgeStyleResolver.getBadgeText(normalized),
    };
  }
}
