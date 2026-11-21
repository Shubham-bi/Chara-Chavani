import {
  ScreenContainerLayout,
  ResponsiveTextStyleResolver,
  ResponsiveCardStyleResolver,
  ResponsiveButtonStyleResolver,
  ResponsiveBadgeStyleResolver,
  ResponsiveGridResolver,
  Colors,
  Spacing,
  dimensionManager,
} from '@chara-chhavani/ui-core';
import { FarmerDashboardDto, AnimalDto } from '@chara-chhavani/api-client';

/**
 * FarmerDashboardView
 * Fully responsive mobile view spec with zero-overflow and anti-overlap guarantees.
 */
export class FarmerDashboardView {
  public static renderLayout(data: FarmerDashboardDto) {
    const isSmall = dimensionManager.isSmallDevice();
    const isTablet = dimensionManager.isTablet();

    return {
      screen: ScreenContainerLayout.getRootStyle({ enableSafeArea: true }),
      scrollContent: ScreenContainerLayout.getScrollContentStyle(),

      // Header Profile Card
      profileCard: ResponsiveCardStyleResolver.getCardStyle({ elevated: true }),
      farmerNameText: ResponsiveTextStyleResolver.resolve({ variant: 'h2', color: Colors.primary }),
      farmerDetailsText: ResponsiveTextStyleResolver.resolve({ variant: 'bodyMedium', color: Colors.textSecondary }),

      // Quick Action Button (Min 48dp touch target)
      registerAnimalButton: ResponsiveButtonStyleResolver.getContainerStyle({
        variant: 'primary',
        size: isSmall ? 'md' : 'lg',
        fullWidth: true,
      }),
      registerAnimalButtonText: ResponsiveButtonStyleResolver.getTextStyle({ variant: 'primary' }),

      // KPI Metric Grid (Auto-stacks to 1 column on <360dp, 2 columns on phones, 4 on tablet)
      statsGridRow: ResponsiveGridResolver.getRowStyle({ gutter: Spacing.sm }),
      statsGridCol: ResponsiveGridResolver.getColStyle({ span: 6, smallSpan: 12, tabletSpan: 3 }),

      // Metric Cards
      statCard: ResponsiveCardStyleResolver.getCardStyle({ elevated: false, bordered: true }),
      statTitleText: ResponsiveTextStyleResolver.resolve({ variant: 'caption', color: Colors.textMuted }),
      statValueText: ResponsiveTextStyleResolver.resolve({ variant: 'h1', color: Colors.textPrimary }),

      // Bilingual Section Header
      sectionTitleMarathi: ResponsiveTextStyleResolver.resolve({ variant: 'h3', color: Colors.textPrimary }),
      sectionTitleEnglish: ResponsiveTextStyleResolver.resolve({ variant: 'caption', color: Colors.textMuted }),
    };
  }

  public static getStatusBadge(animal: AnimalDto) {
    const status = animal.verificationStatus.toLowerCase() as any;
    return {
      container: ResponsiveBadgeStyleResolver.getBadgeContainer(status),
      text: ResponsiveBadgeStyleResolver.getBadgeText(status),
    };
  }
}
