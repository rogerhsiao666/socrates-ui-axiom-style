/**
 * Design System Utilities and Helper Functions
 * 
 * This file provides utility functions and React components to easily use the design system
 */

import { colors, typography, spacing, borders, shadows, animations, components } from './design-system';

// Utility function to create theme-aware class names
export const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

// Button variant helper
export const getButtonClasses = (
  variant: 'primary' | 'secondary' | 'success' | 'error' = 'primary',
  size: 'sm' | 'md' | 'lg' = 'md',
  disabled?: boolean
) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 hover:scale-105 active:scale-[0.98]';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  
  const variantClasses = {
    primary: `bg-[${components.button.primary.background}] hover:bg-[${components.button.primary.hover}] text-black font-bold`,
    secondary: 'bg-transparent hover:bg-gray-800 text-white border border-gray-700',
    success: `bg-[${components.button.success.background}] hover:bg-[${components.button.success.hover}] text-white font-bold`,
    error: `bg-[${components.button.error.background}] hover:bg-[${components.button.error.hover}] text-white font-bold`,
  };
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : '';
  
  return cn(baseClasses, sizeClasses[size], variantClasses[variant], disabledClasses);
};

// Card variant helper
export const getCardClasses = (
  variant: 'default' | 'bordered' | 'elevated' = 'default',
  interactive: boolean = false
) => {
  const baseClasses = 'rounded-lg p-4';
  
  const variantClasses = {
    default: 'bg-tertiary',
    bordered: `bg-tertiary border border-[${colors.special.cardBorder}]`,
    elevated: 'bg-tertiary shadow-lg',
  };
  
  const interactiveClasses = interactive 
    ? 'hover:scale-[1.02] hover:shadow-xl transition-all duration-300 cursor-pointer' 
    : '';
  
  return cn(baseClasses, variantClasses[variant], interactiveClasses);
};

// Text gradient helper
export const getTextGradient = (type: 'brand' | 'success' | 'error' = 'brand') => {
  const gradients = {
    brand: `bg-gradient-to-r from-[${colors.brand.primary}] to-[${colors.brand.primaryDark}]`,
    success: `bg-gradient-to-r from-[${colors.semantic.success}] to-green-600`,
    error: `bg-gradient-to-r from-[${colors.accent.red}] to-[${colors.accent.redLight}]`,
  };
  
  return `${gradients[type]} bg-clip-text text-transparent`;
};

// Badge helper
export const getBadgeClasses = (
  variant: 'default' | 'success' | 'error' | 'warning' | 'info' = 'default',
  size: 'sm' | 'md' = 'sm'
) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };
  
  const variantClasses = {
    default: 'bg-gray-800 text-gray-300',
    success: `bg-[${colors.semantic.success}]/20 text-[${colors.semantic.success}]`,
    error: `bg-[${colors.semantic.error}]/20 text-[${colors.semantic.error}]`,
    warning: `bg-[${colors.semantic.warning}]/20 text-[${colors.semantic.warning}]`,
    info: `bg-[${colors.semantic.info}]/20 text-[${colors.semantic.info}]`,
  };
  
  return cn(baseClasses, sizeClasses[size], variantClasses[variant]);
};

// Input helper
export const getInputClasses = (
  variant: 'default' | 'outlined' = 'default',
  error?: boolean
) => {
  const baseClasses = 'w-full rounded-lg px-4 py-3 text-sm transition-colors focus:outline-none';
  
  const variantClasses = {
    default: 'bg-secondary border border-tertiary',
    outlined: 'bg-transparent border-2',
  };
  
  const stateClasses = error
    ? `border-[${colors.semantic.error}] focus:border-[${colors.semantic.error}]`
    : `focus:border-[${colors.brand.primary}]`;
  
  return cn(baseClasses, variantClasses[variant], stateClasses);
};

// Spacing helper - converts design system spacing to Tailwind classes
export const getSpacing = (value: keyof typeof spacing) => {
  const spacingMap: Record<string, string> = {
    '0': 'p-0',
    '1': 'p-1',
    '2': 'p-2',
    '3': 'p-3',
    '4': 'p-4',
    '5': 'p-5',
    '6': 'p-6',
    '8': 'p-8',
    '10': 'p-10',
    '12': 'p-12',
    '16': 'p-16',
    '20': 'p-20',
  };
  
  return spacingMap[value] || 'p-4';
};

// Shadow helper
export const getShadow = (size: keyof typeof shadows = 'md') => {
  const shadowMap: Record<string, string> = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
    glow: `shadow-[0_0_20px_${colors.brand.primaryBg}]`,
    glowLg: `shadow-[0_0_40px_${colors.brand.primaryBg}]`,
  };
  
  return shadowMap[size] || 'shadow-md';
};

// Animation preset helper
export const getAnimation = (type: 'fadeIn' | 'scaleIn' | 'slideUp' | 'bounce' = 'fadeIn') => {
  const animations = {
    fadeIn: 'animate-fade-in',
    scaleIn: 'animate-scale-in',
    slideUp: 'animate-slide-up',
    bounce: 'animate-bounce-in',
  };
  
  return animations[type];
};

// Theme-aware color helper
export const getThemeColor = (
  colorPath: string,
  theme: 'dark' | 'light' = 'dark'
): string => {
  const paths = colorPath.split('.');
  let value: any = colors;
  
  for (const path of paths) {
    value = value?.[path];
  }
  
  if (typeof value === 'object' && value[theme]) {
    return value[theme];
  }
  
  return value || colors.neutral.gray500;
};

// Component presets for quick implementation
export const componentPresets = {
  // Primary CTA Button
  primaryButton: getButtonClasses('primary', 'md'),
  
  // Secondary Button
  secondaryButton: getButtonClasses('secondary', 'md'),
  
  // Success Action Button
  successButton: getButtonClasses('success', 'md'),
  
  // Error/Cancel Button
  errorButton: getButtonClasses('error', 'md'),
  
  // Interactive Card
  interactiveCard: getCardClasses('bordered', true),
  
  // Static Card
  staticCard: getCardClasses('bordered', false),
  
  // Form Input
  formInput: getInputClasses('default'),
  
  // Success Badge
  successBadge: getBadgeClasses('success', 'sm'),
  
  // Error Badge
  errorBadge: getBadgeClasses('error', 'sm'),
  
  // Brand Gradient Text
  gradientText: getTextGradient('brand'),
};

// Export all utilities
export default {
  cn,
  getButtonClasses,
  getCardClasses,
  getTextGradient,
  getBadgeClasses,
  getInputClasses,
  getSpacing,
  getShadow,
  getAnimation,
  getThemeColor,
  componentPresets,
};