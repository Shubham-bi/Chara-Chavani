import { dimensionManager } from '../responsive/dimensions';
import { Spacing } from '../theme/spacing';
import { BaseLayoutProps } from './types';

export interface ResponsiveGridRowProps {
  gutter?: number;
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
}

export interface ResponsiveGridColProps {
  span?: number; // 1 to 12
  smallSpan?: number; // Span on small devices (<360dp)
  tabletSpan?: number; // Span on tablet (>=600dp)
}

export class ResponsiveGridResolver {
  public static getRowStyle(props?: ResponsiveGridRowProps): BaseLayoutProps {
    const gutter = props?.gutter ?? Spacing.sm;
    return {
      flexDirection: 'row',
      flexWrap: 'wrap', // CRITICAL: Always wraps columns to prevent horizontal overflow
      marginHorizontal: -gutter / 2,
      alignItems: props?.alignItems ?? 'stretch',
      justifyContent: props?.justifyContent ?? 'flex-start',
    };
  }

  public static getColStyle(props?: ResponsiveGridColProps, rowGutter: number = Spacing.sm): BaseLayoutProps {
    const isSmall = dimensionManager.isSmallDevice();
    const isTablet = dimensionManager.isTablet();

    let span = props?.span ?? 12;

    if (isSmall) {
      // On small screens (<360dp), auto-stack to 12 unless explicitly overridden by smallSpan
      span = props?.smallSpan ?? (span <= 6 ? 12 : span);
    } else if (isTablet) {
      span = props?.tabletSpan ?? span;
    }

    const percentage = Math.min(100, Math.max(0, (span / 12) * 100));

    return {
      width: `${percentage}%`,
      paddingHorizontal: rowGutter / 2,
      marginBottom: rowGutter,
      flexDirection: 'column',
    };
  }
}
