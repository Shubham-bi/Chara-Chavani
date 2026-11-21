import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { Typography } from '../theme/typography';
import { BaseLayoutProps } from './types';
import { ComputedTextStyle } from './ResponsiveText';

export type BadgeStatus = 'verified' | 'pending' | 'rejected' | 'admitted' | 'critical' | 'active';

export class ResponsiveBadgeStyleResolver {
  public static getBadgeContainer(status: BadgeStatus): BaseLayoutProps {
    let backgroundColor: string;
    let borderColor: string;

    switch (status) {
      case 'verified':
      case 'admitted':
      case 'active':
        backgroundColor = Colors.successLight;
        borderColor = Colors.success;
        break;
      case 'pending':
        backgroundColor = Colors.warningLight;
        borderColor = Colors.warning;
        break;
      case 'rejected':
      case 'critical':
        backgroundColor = Colors.errorLight;
        borderColor = Colors.error;
        break;
    }

    return {
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderRadius: Spacing.radiusFull,
      borderWidth: 1,
      borderColor,
      backgroundColor,
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
    };
  }

  public static getBadgeText(status: BadgeStatus): ComputedTextStyle {
    let color: string;

    switch (status) {
      case 'verified':
      case 'admitted':
      case 'active':
        color = Colors.success;
        break;
      case 'pending':
        color = Colors.warning;
        break;
      case 'rejected':
      case 'critical':
        color = Colors.error;
        break;
    }

    return {
      ...Typography.caption(),
      fontWeight: '600',
      color,
      textAlign: 'center',
      flexShrink: 1,
    };
  }
}
