export type DeviceCategory = 'smallPhone' | 'phone' | 'largePhone' | 'tablet';

export interface ScreenDimensions {
  width: number;
  height: number;
  scale: number;
  fontScale: number;
}

export interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

class DimensionManager {
  private currentDimensions: ScreenDimensions = {
    width: 375, // Baseline standard width (iPhone 13/14 or Galaxy A-series width)
    height: 812, // Baseline standard height
    scale: 2,
    fontScale: 1,
  };

  private currentInsets: SafeAreaInsets = {
    top: 44,
    bottom: 34,
    left: 0,
    right: 0,
  };

  public setDimensions(dims: Partial<ScreenDimensions>): void {
    this.currentDimensions = {
      ...this.currentDimensions,
      ...dims,
    };
  }

  public setSafeAreaInsets(insets: Partial<SafeAreaInsets>): void {
    this.currentInsets = {
      ...this.currentInsets,
      ...insets,
    };
  }

  public getDimensions(): ScreenDimensions {
    return { ...this.currentDimensions };
  }

  public getSafeAreaInsets(): SafeAreaInsets {
    return { ...this.currentInsets };
  }

  public getDeviceCategory(): DeviceCategory {
    const width = this.currentDimensions.width;
    if (width < 360) {
      return 'smallPhone'; // Budget devices (e.g. Redmi 9A, Galaxy M02)
    }
    if (width < 412) {
      return 'phone'; // Standard phones
    }
    if (width < 600) {
      return 'largePhone'; // Large phablets / Ultra / Pro Max
    }
    return 'tablet'; // iPads, Android tablets, foldables
  }

  public isSmallDevice(): boolean {
    return this.currentDimensions.width < 360;
  }

  public isTablet(): boolean {
    return this.currentDimensions.width >= 600;
  }

  public isLandscape(): boolean {
    return this.currentDimensions.width > this.currentDimensions.height;
  }
}

export const dimensionManager = new DimensionManager();
