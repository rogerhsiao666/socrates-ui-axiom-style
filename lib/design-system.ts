/**
 * SocratesUI Design System Configuration
 * 
 * This file contains all the design tokens and configuration for the entire UI system.
 * Modify these values to update the entire application's appearance.
 */

// Color System
export const colors = {
  // Primary Brand Colors
  brand: {
    primary: '#00FFAE',        // Main brand color (mint green)
    primaryDark: '#00D4AA',    // Darker variant for hover states
    primaryLight: '#86FFC6',   // Lighter variant
    primaryBg: 'rgba(0, 255, 174, 0.1)', // Background tint
  },

  // Semantic Colors
  semantic: {
    success: '#30A46C',        // Success actions (Yes buttons)
    error: '#E5484D',          // Error states (No buttons)
    warning: '#F59E0B',        // Warning states
    info: '#4285F4',          // Information states
  },

  // Accent Colors
  accent: {
    red: '#FF3D5A',           // Accent red (negative values)
    redDark: '#E6354F',       // Darker red for hover
    redLight: '#FF6B7A',      // Lighter red for gradients
    blue: '#3B82F6',          // Accent blue
    yellow: '#F59E0B',        // Accent yellow
  },

  // Neutral Colors
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',
  },

  // Special Colors
  special: {
    cardBorder: '#D9D9E0',    // Card border color
    divider: '#2D2D2D',       // Divider lines
    overlay: 'rgba(0, 0, 0, 0.7)', // Modal overlays
  },

  // Theme-specific backgrounds
  background: {
    dark: {
      primary: '#000000',
      secondary: '#121212',
      tertiary: '#1A1A1A',
      card: '#1A1A1A',
    },
    light: {
      primary: '#FFFFFF',
      secondary: '#F9FAFB',
      tertiary: '#F3F4F6',
      card: '#FFFFFF',
    }
  },

  // Text Colors
  text: {
    dark: {
      primary: '#FFFFFF',
      secondary: '#D1D5DB',
      tertiary: '#9CA3AF',
    },
    light: {
      primary: '#111827',
      secondary: '#4B5563',
      tertiary: '#6B7280',
    }
  }
};

// Typography System
export const typography = {
  // Font Families
  fontFamily: {
    primary: ['Space Grotesk', 'Satoshi', 'Inter', 'system-ui', 'sans-serif'],
    grotesk: ['Space Grotesk', 'sans-serif'],
    satoshi: ['Satoshi', 'sans-serif'],
    mono: ['ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace'],
  },

  // Font Sizes (in px)
  fontSize: {
    xs: '12px',    // Small labels, metadata
    sm: '14px',    // Body text, buttons
    base: '16px',  // Default body
    lg: '18px',    // Section titles
    xl: '20px',    // Modal titles
    '2xl': '24px', // Main headings
    '3xl': '30px', // Hero titles
    '4xl': '36px', // Large displays
  },

  // Font Weights
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Line Heights
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Letter Spacing
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
  }
};

// Spacing System (in px)
export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
};

// Border System
export const borders = {
  // Border Radius
  radius: {
    none: '0',
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    '2xl': '16px',
    '3xl': '24px',
    full: '9999px',
  },

  // Border Width
  width: {
    none: '0',
    thin: '1px',
    medium: '2px',
    thick: '4px',
  },

  // Border Colors (references color system)
  color: {
    default: colors.neutral.gray700,
    light: colors.neutral.gray300,
    card: colors.special.cardBorder,
    brand: colors.brand.primary,
  }
};

// Shadow System
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  glow: `0 0 20px ${colors.brand.primaryBg}`,
  glowLg: `0 0 40px ${colors.brand.primaryBg}`,
};

// Animation System
export const animations = {
  // Transition Durations
  duration: {
    fast: '200ms',
    normal: '300ms',
    slow: '500ms',
  },

  // Easing Functions
  easing: {
    default: 'ease-out',
    linear: 'linear',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },

  // Common Transitions
  transition: {
    all: 'all 200ms ease-out',
    colors: 'background-color, border-color, color, fill, stroke 200ms ease-out',
    transform: 'transform 200ms ease-out',
    opacity: 'opacity 200ms ease-out',
  }
};

// Breakpoints (for responsive design)
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Z-Index Scale
export const zIndex = {
  auto: 'auto',
  0: 0,
  10: 10,    // Base elements
  20: 20,    // Elevated cards
  30: 30,    // Sticky elements
  40: 40,    // Dropdowns
  50: 50,    // Modals
  60: 60,    // Notifications
  70: 70,    // Tooltips
  999: 999,  // Maximum
};

// Component Specific Styles
export const components = {
  // Button Styles
  button: {
    primary: {
      background: colors.brand.primary,
      hover: colors.brand.primaryDark,
      text: colors.neutral.black,
      fontWeight: typography.fontWeight.bold,
      padding: `${spacing[2]} ${spacing[4]}`,
      borderRadius: borders.radius.lg,
    },
    secondary: {
      background: 'transparent',
      hover: colors.neutral.gray800,
      text: colors.text.dark.primary,
      fontWeight: typography.fontWeight.medium,
      padding: `${spacing[2]} ${spacing[4]}`,
      borderRadius: borders.radius.lg,
      border: `${borders.width.thin} solid ${borders.color.default}`,
    },
    success: {
      background: colors.semantic.success,
      hover: '#2A8F5F',
      text: colors.neutral.white,
      fontWeight: typography.fontWeight.bold,
    },
    error: {
      background: colors.semantic.error,
      hover: '#DC4446',
      text: colors.neutral.white,
      fontWeight: typography.fontWeight.bold,
    }
  },

  // Card Styles
  card: {
    background: colors.background.dark.card,
    border: `${borders.width.thin} solid ${colors.special.cardBorder}`,
    borderRadius: borders.radius.lg,
    padding: spacing[2],
    hover: {
      scale: 1.02,
      shadow: shadows.xl,
    }
  },

  // Input Styles
  input: {
    background: colors.background.dark.secondary,
    border: `${borders.width.thin} solid ${borders.color.default}`,
    borderRadius: borders.radius.lg,
    padding: `${spacing[3]} ${spacing[4]}`,
    fontSize: typography.fontSize.sm,
    focusBorder: colors.brand.primary,
  },

  // Badge Styles
  badge: {
    padding: `${spacing[1]} ${spacing[2]}`,
    borderRadius: borders.radius.full,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  }
};

// Export a function to get theme-aware values
export const getThemeValue = (theme: 'dark' | 'light', path: string) => {
  const paths = path.split('.');
  let value: any = colors;
  
  for (const p of paths) {
    value = value?.[p];
  }
  
  if (typeof value === 'object' && value[theme]) {
    return value[theme];
  }
  
  return value;
};

// Utility function to generate CSS variables from design tokens
export const generateCSSVariables = (theme: 'dark' | 'light' = 'dark') => {
  const cssVars: Record<string, string> = {};
  
  // Colors
  cssVars['--color-brand-primary'] = colors.brand.primary;
  cssVars['--color-brand-primary-dark'] = colors.brand.primaryDark;
  cssVars['--color-success'] = colors.semantic.success;
  cssVars['--color-error'] = colors.semantic.error;
  
  // Theme-specific
  cssVars['--color-bg-primary'] = colors.background[theme].primary;
  cssVars['--color-bg-secondary'] = colors.background[theme].secondary;
  cssVars['--color-bg-tertiary'] = colors.background[theme].tertiary;
  cssVars['--color-text-primary'] = colors.text[theme].primary;
  cssVars['--color-text-secondary'] = colors.text[theme].secondary;
  
  // Spacing
  Object.entries(spacing).forEach(([key, value]) => {
    cssVars[`--spacing-${key}`] = value;
  });
  
  // Border radius
  Object.entries(borders.radius).forEach(([key, value]) => {
    cssVars[`--radius-${key}`] = value;
  });
  
  return cssVars;
};

export default {
  colors,
  typography,
  spacing,
  borders,
  shadows,
  animations,
  breakpoints,
  zIndex,
  components,
  getThemeValue,
  generateCSSVariables,
};