/**
 * Lingua Design System - Typography Tokens
 * Derived from design specification: prompt_material/01-design-system.png
 */

export const fontFamilies = {
  poppins: {
    regular: 'Poppins_400Regular',
    medium: 'Poppins_500Medium',
    semiBold: 'Poppins_600SemiBold',
    bold: 'Poppins_700Bold',
  },
} as const;

export const typography = {
  fontFamily: 'Poppins',
  
  variants: {
    h1: {
      fontSize: 32,
      fontFamily: fontFamilies.poppins.bold,
      fontWeight: '700' as const,
      lineHeight: 38.4, // 32 * 1.2
    },
    h2: {
      fontSize: 24,
      fontFamily: fontFamilies.poppins.semiBold,
      fontWeight: '600' as const,
      lineHeight: 31.2, // 24 * 1.3
    },
    h3: {
      fontSize: 20,
      fontFamily: fontFamilies.poppins.semiBold,
      fontWeight: '600' as const,
      lineHeight: 26.0, // 20 * 1.3
    },
    h4: {
      fontSize: 16,
      fontFamily: fontFamilies.poppins.medium,
      fontWeight: '500' as const,
      lineHeight: 22.4, // 16 * 1.4
    },
    bodyLarge: {
      fontSize: 16,
      fontFamily: fontFamilies.poppins.regular,
      fontWeight: '400' as const,
      lineHeight: 25.6, // 16 * 1.6
    },
    bodyMedium: {
      fontSize: 14,
      fontFamily: fontFamilies.poppins.regular,
      fontWeight: '400' as const,
      lineHeight: 22.4, // 14 * 1.6
    },
    bodySmall: {
      fontSize: 13,
      fontFamily: fontFamilies.poppins.regular,
      fontWeight: '400' as const,
      lineHeight: 20.8, // 13 * 1.6
    },
    caption: {
      fontSize: 11,
      fontFamily: fontFamilies.poppins.regular,
      fontWeight: '400' as const,
      lineHeight: 15.4, // 11 * 1.4
    },
  },
} as const;

export type Typography = typeof typography;
export type TypographyVariant = keyof typeof typography.variants;
