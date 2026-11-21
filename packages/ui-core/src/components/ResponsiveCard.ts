import { dimensionManager } from '../responsive/dimensions';
import { getResponsiveGutter } from '../responsive/scaling';
import { Colors } from '../theme/colors';
import { Shadows, ShadowStyle } from '../theme/shadows';
import { Spacing } from '../theme/spacing';
import { BaseLayoutProps } from './types';

export interface ResponsiveCardProps extends BaseLayoutProps {
  elevated?: boolean;
  onPress?: () => void;
  bordered?: boolean;
}

export class ResponsiveCardStyleResolver {
  public static getCardStyle(props?: ResponsiveCardProps): BaseLayoutProps & ShadowStyle {
    const gutter = getResponsiveGutter();
    const shadow = props?.elevated ? Shadows.card() : Shadows.subtle();
    const isTablet = dimensionManager.isTablet();

    return {
      width: '100%',
      backgroundColor: props?.backgroundColor || Colors.surface,
      borderRadius: isTablet ? Spacing.radiusLg : Spacing.radiusMd,
      padding: props?.padding ?? gutter,
      marginBottom: props?.marginVertical ?? Spacing.md,
      borderWidth: props?.bordered !== false ? 1 : 0,
      borderColor: Colors.border,
      ...shadow,
    };
  }
}
