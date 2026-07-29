/**
 * Lingua Design System - Central Theme Export
 * Exporting all design tokens and types
 */

import { colors } from './colors';
import { fontFamilies, typography, TypographyVariant } from './typography';

export { colors } from './colors';
export type { Colors } from './colors';

export { fontFamilies, typography } from './typography';
export type { Typography, TypographyVariant } from './typography';

export const theme = {
  colors,
  fontFamilies,
  typography,
} as const;

export default theme;
