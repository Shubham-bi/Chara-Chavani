import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { Typography } from '../theme/typography';
import { BaseLayoutProps } from './types';
import { ComputedTextStyle } from './ResponsiveText';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ResponsiveButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export class ResponsiveButtonStyleResolver {
  public static getContainerStyle(props?: ResponsiveButtonProps): BaseLayoutProps {
    const variant = props?.variant ?? 'primary';
    const size = props?.size ?? 'md';
    const disabled = props?.disabled || props?.loading;

    let minHeight: number = Spacing.minTouchTarget; // Minimum 48dp touch target
    let paddingHorizontal: number = Spacing.lg;

    if (size === 'sm') {
      minHeight = 40;
      paddingHorizontal = Spacing.md;
    } else if (size === 'lg') {
      minHeight = 54;
      paddingHorizontal = Spacing.xl;
    }

    let backgroundColor: string;
    let borderColor: string | undefined;
    let borderWidth = 0;

    switch (variant) {
      case 'secondary':
        backgroundColor = Colors.secondary;
        break;
      case 'outline':
        backgroundColor = 'transparent';
        borderColor = Colors.primary;
        borderWidth = 1.5;
        break;
      case 'danger':
        backgroundColor = Colors.error;
        break;
      case 'primary':
      default:
        backgroundColor = Colors.primary;
        break;
    }

    if (disabled) {
      backgroundColor = variant === 'outline' ? 'transparent' : Colors.borderDark;
      if (variant === 'outline') {
        borderColor = Colors.borderDark;
      }
    }

    return {
      minHeight,
      paddingHorizontal,
      paddingVertical: Spacing.sm,
      backgroundColor,
      borderRadius: Spacing.radiusMd,
      borderWidth,
      borderColor,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: props?.fullWidth ? '100%' : undefined,
    };
  }

  public static getTextStyle(props?: ResponsiveButtonProps): ComputedTextStyle {
    const variant = props?.variant ?? 'primary';
    const disabled = props?.disabled || props?.loading;
    const buttonTypography = Typography.button();

    let textColor: string;
    if (disabled) {
      textColor = Colors.textMuted;
    } else if (variant === 'outline') {
      textColor = Colors.primary;
    } else {
      textColor = Colors.textInverse;
    }

    return {
      ...buttonTypography,
      color: textColor,
      textAlign: 'center',
      flexShrink: 1, // Auto-wraps button label if title is long (e.g. Marathi instructions)
    };
  }
}
