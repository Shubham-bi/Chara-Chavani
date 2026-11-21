import { Colors } from '../theme/colors';
import { Typography, TypographyStyle } from '../theme/typography';

export type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'bodyLarge'
  | 'bodyMedium'
  | 'bodySmall'
  | 'label'
  | 'caption'
  | 'error';

export interface ResponsiveTextProps {
  variant?: TextVariant;
  color?: string;
  align?: 'left' | 'center' | 'right';
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
}

export interface ComputedTextStyle extends TypographyStyle {
  color: string;
  textAlign: 'left' | 'center' | 'right';
  flexShrink: number;
}

export class ResponsiveTextStyleResolver {
  public static resolve(props?: ResponsiveTextProps): ComputedTextStyle {
    const variant = props?.variant ?? 'bodyMedium';
    let baseTypography: TypographyStyle;

    switch (variant) {
      case 'h1':
        baseTypography = Typography.h1();
        break;
      case 'h2':
        baseTypography = Typography.h2();
        break;
      case 'h3':
        baseTypography = Typography.h3();
        break;
      case 'bodyLarge':
        baseTypography = Typography.bodyLarge();
        break;
      case 'bodySmall':
        baseTypography = Typography.bodySmall();
        break;
      case 'label':
        baseTypography = Typography.label();
        break;
      case 'caption':
        baseTypography = Typography.caption();
        break;
      case 'error':
        baseTypography = Typography.bodySmall();
        break;
      case 'bodyMedium':
      default:
        baseTypography = Typography.bodyMedium();
        break;
    }

    const defaultColor =
      variant === 'error'
        ? Colors.error
        : variant === 'label'
        ? Colors.textSecondary
        : variant === 'caption'
        ? Colors.textMuted
        : Colors.textPrimary;

    return {
      ...baseTypography,
      color: props?.color ?? defaultColor,
      textAlign: props?.align ?? 'left',
      flexShrink: 1, // Guarantees text will shrink and wrap rather than pushing neighboring elements off-screen
    };
  }
}
