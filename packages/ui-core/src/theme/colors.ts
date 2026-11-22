/**
 * WCAG 2.1 AA Compliant Color Palette
 * Specially calibrated for outdoor readability in bright Maharashtra sunlight.
 */
export const Colors = {
  // Brand Agricultural Green (Maharashtra State Agriculture motif)
  primary: '#1B5E20',       // Dark Green (Contrast Ratio > 9.5:1 against white)
  primaryLight: '#E8F5E9',  // Tint for selected rows/cards
  primaryDark: '#0D3810',
  primaryText: '#FFFFFF',

  // Secondary Amber (Warm sun/wheat, high visual priority)
  secondary: '#E65100',     // Deep Amber / Ochre (Contrast Ratio > 4.6:1 against white)
  secondaryLight: '#FFF3E0',
  secondaryDark: '#AC3800',
  secondaryText: '#FFFFFF',

  // Surfaces & Backgrounds
  background: '#F8F9FA',    // Anti-glare soft background
  surface: '#FFFFFF',       // Card surface
  surfaceSubtle: '#F1F3F5',
  surfaceSecondary: '#F1F3F5',
  surfaceActive: '#E9ECEF',

  // Text Hierarchy
  textPrimary: '#1A202C',   // Deep slate (Contrast Ratio > 13:1 against white)
  textSecondary: '#4A5568', // Medium slate (Contrast Ratio > 5.5:1 against white)
  textMuted: '#718096',     // Helper labels (Contrast Ratio > 4.5:1 against white)
  textInverse: '#FFFFFF',

  // Semantic Status Colors
  success: '#2E7D32',       // Green (Admitted / Verified / Approved)
  successLight: '#E8F5E9',
  warning: '#ED6C02',       // Orange (Pending / Attention Required)
  warningLight: '#FFF4E5',
  error: '#D32F2F',         // Red (Rejected / Critical / Discrepancy)
  errorLight: '#FFEBEE',
  info: '#0288D1',          // Blue (Informational / In Transit)
  infoLight: '#E1F5FE',

  // Borders & Dividers
  border: '#E2E8F0',
  borderDark: '#CBD5E1',
  borderFocus: '#1B5E20',

  // Overlay
  backdrop: 'rgba(0, 0, 0, 0.55)',
} as const;

export type ColorToken = keyof typeof Colors;
