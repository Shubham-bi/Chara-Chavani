import {
  ScreenContainerLayout,
  ResponsiveTextStyleResolver,
  ResponsiveCardStyleResolver,
  ResponsiveBadgeStyleResolver,
  ResponsiveButtonStyleResolver,
  Colors,
  Spacing,
} from '@chara-chhavani/ui-core';
import { VetVerificationResult } from '@chara-chhavani/api-client';

export class VetHistoryView {
  public static renderLayout() {
    return {
      screen: ScreenContainerLayout.getRootStyle({ enableSafeArea: true }),
      scrollContent: ScreenContainerLayout.getScrollContentStyle(),

      headerCard: ResponsiveCardStyleResolver.getCardStyle({ elevated: true }),
      titleMarathi: ResponsiveTextStyleResolver.resolve({ variant: 'h2', color: Colors.primary }),
      titleEnglish: ResponsiveTextStyleResolver.resolve({ variant: 'caption', color: Colors.textMuted }),

      // History item card
      historyCard: ResponsiveCardStyleResolver.getCardStyle({ elevated: false, bordered: true }),
      tagNumberText: ResponsiveTextStyleResolver.resolve({ variant: 'h3', color: Colors.textPrimary }),
      decisionText: ResponsiveTextStyleResolver.resolve({ variant: 'bodyMedium', color: Colors.textSecondary }),
      remarksText: ResponsiveTextStyleResolver.resolve({ variant: 'caption', color: Colors.textMuted }),
      dateText: ResponsiveTextStyleResolver.resolve({ variant: 'caption', color: Colors.textMuted }),

      emptyStateText: ResponsiveTextStyleResolver.resolve({ variant: 'bodyMedium', color: Colors.textMuted }),

      backButton: ResponsiveButtonStyleResolver.getContainerStyle({
        variant: 'outline',
        size: 'md',
        fullWidth: true,
      }),
      backButtonText: ResponsiveButtonStyleResolver.getTextStyle({ variant: 'outline' }),
    };
  }

  public static getDecisionBadge(isApproved: boolean) {
    const status = isApproved ? 'approved' : 'rejected';
    return {
      container: ResponsiveBadgeStyleResolver.getBadgeContainer(status as any),
      text: ResponsiveBadgeStyleResolver.getBadgeText(status as any),
    };
  }
}
