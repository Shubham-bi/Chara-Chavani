import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { Typography } from '../theme/typography';
import { BaseLayoutProps } from './types';
import { ComputedTextStyle } from './ResponsiveText';

export interface ResponsiveInputProps {
  hasError?: boolean;
  isFocused?: boolean;
  disabled?: boolean;
  multiline?: boolean;
}

export class ResponsiveInputStyleResolver {
  public static getWrapperStyle(): BaseLayoutProps {
    return {
      width: '100%',
      marginBottom: Spacing.md,
    };
  }

  public static getLabelStyle(): ComputedTextStyle {
    return {
      ...Typography.label(),
      color: Colors.textSecondary,
      textAlign: 'left',
      flexShrink: 1,
    };
  }

  public static getFieldContainerStyle(props?: ResponsiveInputProps): BaseLayoutProps {
    const minHeight: number = props?.multiline ? 90 : Spacing.minTouchTarget; // Minimum 48dp height
    let borderColor: string = Colors.border;

    if (props?.hasError) {
      borderColor = Colors.error;
    } else if (props?.isFocused) {
      borderColor = Colors.borderFocus;
    }

    return {
      minHeight,
      width: '100%',
      backgroundColor: props?.disabled ? Colors.surfaceSubtle : Colors.surface,
      borderWidth: props?.isFocused ? 1.5 : 1,
      borderColor,
      borderRadius: Spacing.radiusMd,
      paddingHorizontal: Spacing.md,
      paddingVertical: props?.multiline ? Spacing.sm : 0,
      flexDirection: 'row',
      alignItems: props?.multiline ? 'flex-start' : 'center',
    };
  }

  public static getTextInputStyle(props?: ResponsiveInputProps): ComputedTextStyle {
    return {
      ...Typography.bodyLarge(),
      color: props?.disabled ? Colors.textMuted : Colors.textPrimary,
      textAlign: 'left',
      flexShrink: 1,
    };
  }

  public static getErrorTextStyle(): ComputedTextStyle {
    return {
      ...Typography.bodySmall(),
      color: Colors.error,
      textAlign: 'left',
      flexShrink: 1,
    };
  }
}
