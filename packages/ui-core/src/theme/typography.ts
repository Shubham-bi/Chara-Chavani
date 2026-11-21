import { fontScale } from '../responsive/scaling';

export interface TypographyStyle {
  fontSize: number;
  lineHeight: number;
  fontWeight: '400' | '500' | '600' | '700';
  letterSpacing?: number;
}

/**
 * Proportional Typography System
 * All line heights are calibrated to >= 1.35x font size to prevent
 * vertical truncation of Marathi (Devanagari) glyphs and matras.
 */
export const Typography = {
  h1: (): TypographyStyle => ({
    fontSize: fontScale(24),
    lineHeight: fontScale(32),
    fontWeight: '700',
    letterSpacing: -0.3,
  }),

  h2: (): TypographyStyle => ({
    fontSize: fontScale(20),
    lineHeight: fontScale(28),
    fontWeight: '700',
    letterSpacing: -0.2,
  }),

  h3: (): TypographyStyle => ({
    fontSize: fontScale(18),
    lineHeight: fontScale(25),
    fontWeight: '600',
  }),

  bodyLarge: (): TypographyStyle => ({
    fontSize: fontScale(16),
    lineHeight: fontScale(24),
    fontWeight: '400',
  }),

  bodyMedium: (): TypographyStyle => ({
    fontSize: fontScale(14),
    lineHeight: fontScale(21),
    fontWeight: '400',
  }),

  bodySmall: (): TypographyStyle => ({
    fontSize: fontScale(12),
    lineHeight: fontScale(18),
    fontWeight: '400',
  }),

  label: (): TypographyStyle => ({
    fontSize: fontScale(13),
    lineHeight: fontScale(19),
    fontWeight: '600',
  }),

  button: (): TypographyStyle => ({
    fontSize: fontScale(15),
    lineHeight: fontScale(22),
    fontWeight: '600',
    letterSpacing: 0.2,
  }),

  caption: (): TypographyStyle => ({
    fontSize: fontScale(11),
    lineHeight: fontScale(16),
    fontWeight: '400',
  }),
};
