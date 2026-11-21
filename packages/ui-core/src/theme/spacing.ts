import { moderateScale } from '../responsive/scaling';

/**
 * 4dp / 8dp Baseline Spacing Scale
 */
export const Spacing = {
  xxs: moderateScale(2),
  xs: moderateScale(4),
  sm: moderateScale(8),
  md: moderateScale(12),
  lg: moderateScale(16),
  xl: moderateScale(20),
  xxl: moderateScale(24),
  xxxl: moderateScale(32),
  huge: moderateScale(48),

  // Minimum Touch Target per Android & iOS Accessibility Guidelines
  minTouchTarget: 48,
  
  // Standard Border Radii
  radiusSm: 4,
  radiusMd: 8,
  radiusLg: 12,
  radiusXl: 16,
  radiusFull: 9999,
} as const;
