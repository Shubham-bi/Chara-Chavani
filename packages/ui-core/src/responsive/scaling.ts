import { dimensionManager } from './dimensions';

const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

/**
 * Scale dimension horizontally according to device screen width.
 */
export function scale(size: number): number {
  const { width } = dimensionManager.getDimensions();
  const scaled = (width / BASE_WIDTH) * size;
  return Math.round(scaled);
}

/**
 * Scale dimension vertically according to device screen height.
 */
export function verticalScale(size: number): number {
  const { height } = dimensionManager.getDimensions();
  const scaled = (height / BASE_HEIGHT) * size;
  return Math.round(scaled);
}

/**
 * Moderate scale factor between raw size and scaled size.
 * Defaults to 0.5 factor to prevent extreme bloat on larger devices.
 */
export function moderateScale(size: number, factor: number = 0.5): number {
  const scaled = scale(size);
  return Math.round(size + (scaled - size) * factor);
}

/**
 * Responsive font scale with strict min/max boundary clamps.
 * Guarantees accessibility without letting OS large-font settings shatter container geometry.
 */
export function fontScale(size: number, minClamp: number = 0.85, maxClamp: number = 1.35): number {
  const dims = dimensionManager.getDimensions();
  const rawRatio = dims.width / BASE_WIDTH;
  
  // Combine width ratio with OS font accessibility scale
  const combinedScale = rawRatio * (dims.fontScale || 1.0);
  const clampedScale = Math.min(Math.max(combinedScale, minClamp), maxClamp);
  
  return Math.round(size * clampedScale);
}

/**
 * Calculate absolute pixel value from percentage of screen width.
 */
export function responsiveWidth(percentage: number): number {
  const { width } = dimensionManager.getDimensions();
  return Math.round((percentage / 100) * width);
}

/**
 * Calculate absolute pixel value from percentage of screen height.
 */
export function responsiveHeight(percentage: number): number {
  const { height } = dimensionManager.getDimensions();
  return Math.round((percentage / 100) * height);
}

/**
 * Get dynamic horizontal gutter padding:
 * Small screen (<360dp) gets 12dp, standard gets 16dp, tablet gets 24dp.
 */
export function getResponsiveGutter(): number {
  const category = dimensionManager.getDeviceCategory();
  switch (category) {
    case 'smallPhone':
      return 12;
    case 'phone':
      return 16;
    case 'largePhone':
      return 20;
    case 'tablet':
      return 28;
  }
}
