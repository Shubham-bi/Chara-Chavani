import { dimensionManager } from '../responsive/dimensions';
import { getResponsiveGutter } from '../responsive/scaling';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { BaseLayoutProps } from './types';

export interface ScreenContainerProps extends BaseLayoutProps {
  scrollable?: boolean;
  enableSafeArea?: boolean;
  stickyBottomAction?: boolean;
  backgroundColor?: string;
}

/**
 * ScreenContainer Specification
 * Prevents screen clipping, content truncation, and keyboard overlap
 * across all device form factors (small phones, tall phones, tablets).
 */
export class ScreenContainerLayout {
  public static getRootStyle(props?: ScreenContainerProps): BaseLayoutProps {
    const insets = dimensionManager.getSafeAreaInsets();
    const enableSafe = props?.enableSafeArea !== false;

    return {
      flex: 1,
      backgroundColor: props?.backgroundColor || Colors.background,
      paddingTop: enableSafe ? insets.top : 0,
      paddingBottom: enableSafe && !props?.stickyBottomAction ? insets.bottom : 0,
      paddingLeft: enableSafe ? insets.left : 0,
      paddingRight: enableSafe ? insets.right : 0,
    };
  }

  public static getScrollContentStyle(props?: ScreenContainerProps): BaseLayoutProps {
    const gutter = getResponsiveGutter();
    return {
      flexGrow: 1,
      paddingHorizontal: props?.paddingHorizontal ?? gutter,
      paddingVertical: props?.paddingVertical ?? Spacing.md,
      justifyContent: props?.justifyContent ?? 'flex-start',
    };
  }

  public static getStickyBottomActionStyle(): BaseLayoutProps {
    const insets = dimensionManager.getSafeAreaInsets();
    const gutter = getResponsiveGutter();

    return {
      paddingHorizontal: gutter,
      paddingTop: Spacing.sm,
      paddingBottom: Math.max(insets.bottom, Spacing.md),
      backgroundColor: Colors.surface,
      borderTopWidth: 1,
      borderColor: Colors.border,
      minHeight: Spacing.minTouchTarget + Spacing.md,
      justifyContent: 'center',
    };
  }
}
