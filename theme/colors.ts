/**
 * Lingua Design System - Color Tokens
 * Derived from design specification: prompt_material/01-design-system.png
 */

export const colors = {
  // Primary Palette
  primary: {
    purple: '#6C4EF5',
    deepPurple: '#5B3BF6',
    blue: '#4D8BFF',
    green: '#21C16B',
    DEFAULT: '#6C4EF5',
  },

  // Semantic Colors
  semantic: {
    success: '#21C16B',
    warning: '#FFC800',
    streak: '#FF8A00',
    error: '#FF4D4F',
    info: '#4D8BFF',
  },

  // Neutral Colors
  neutral: {
    textPrimary: '#0D132B',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    surface: '#F6F7FB',
    background: '#FFFFFF',
  },

  // Alias helpers for UI convenience
  brand: {
    linguaPurple: '#6C4EF5',
    linguaDeepPurple: '#5B3BF6',
    linguaBlue: '#4D8BFF',
    linguaGreen: '#21C16B',
  },
} as const;

export type Colors = typeof colors;
