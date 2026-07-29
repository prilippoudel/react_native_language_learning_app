import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { typography, TypographyVariant, colors } from '@/theme';

export interface TypographyProps extends RNTextProps {
  variant?: TypographyVariant;
  color?: string;
  className?: string;
  children: React.ReactNode;
}

const variantClassMap: Record<TypographyVariant, string> = {
  h1: 'font-poppins-bold text-h1 text-neutral-text-primary',
  h2: 'font-poppins-semibold text-h2 text-neutral-text-primary',
  h3: 'font-poppins-semibold text-h3 text-neutral-text-primary',
  h4: 'font-poppins-medium text-h4 text-neutral-text-primary',
  bodyLarge: 'font-poppins text-body-lg text-neutral-text-primary',
  bodyMedium: 'font-poppins text-body-md text-neutral-text-primary',
  bodySmall: 'font-poppins text-body-sm text-neutral-text-secondary',
  caption: 'font-poppins text-caption text-neutral-text-secondary',
};

export const Typography: React.FC<TypographyProps> = ({
  variant = 'bodyMedium',
  color,
  style,
  className = '',
  children,
  ...props
}) => {
  const defaultClass = variantClassMap[variant] || variantClassMap.bodyMedium;
  const combinedClassName = `${defaultClass} ${className}`.trim();
  
  const customStyle = color ? [{ color }, style] : style;

  return (
    <RNText className={combinedClassName} style={customStyle} {...props}>
      {children}
    </RNText>
  );
};

export const H1: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h1" {...props} />
);

export const H2: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h2" {...props} />
);

export const H3: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h3" {...props} />
);

export const H4: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h4" {...props} />
);

export const BodyLarge: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="bodyLarge" {...props} />
);

export const BodyMedium: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="bodyMedium" {...props} />
);

export const BodySmall: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="bodySmall" {...props} />
);

export const Caption: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="caption" {...props} />
);
