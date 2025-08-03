# SocratesUI Design System Documentation

## Overview

The SocratesUI Design System is a comprehensive set of design tokens, components, and utilities that ensure consistent and scalable UI development. This system allows for easy global style changes and maintains design consistency across the entire application.

## Quick Start

### 1. Import the Design System

```typescript
import designSystem from '@/lib/design-system';
import { getButtonClasses, getCardClasses } from '@/lib/design-system-utils';
```

### 2. Use Design Tokens

```typescript
// Access colors
const primaryColor = designSystem.colors.brand.primary; // #00FFAE

// Access typography
const headingSize = designSystem.typography.fontSize['2xl']; // 24px

// Access spacing
const largePadding = designSystem.spacing[6]; // 24px
```

### 3. Use Utility Functions

```typescript
// Create a primary button
<button className={getButtonClasses('primary', 'lg')}>
  Create Market
</button>

// Create an interactive card
<div className={getCardClasses('bordered', true)}>
  {/* Card content */}
</div>
```

## Core Design Tokens

### Color System

#### Brand Colors
- **Primary**: `#00FFAE` - Main brand color (mint green)
- **Primary Dark**: `#00D4AA` - Hover states
- **Primary Light**: `#86FFC6` - Light variants

#### Semantic Colors
- **Success**: `#30A46C` - Success states, "Yes" buttons
- **Error**: `#E5484D` - Error states, "No" buttons
- **Warning**: `#F59E0B` - Warning messages
- **Info**: `#4285F4` - Information states

#### Special Colors
- **Card Border**: `#D9D9E0` - Default card borders
- **Divider**: `#2D2D2D` - Divider lines
- **Overlay**: `rgba(0, 0, 0, 0.7)` - Modal overlays

### Typography System

#### Font Families
```css
primary: 'Space Grotesk', 'Satoshi', 'Inter', system-ui, sans-serif
mono: ui-monospace, 'SFMono-Regular', 'Consolas', monospace
```

#### Font Sizes
- `xs`: 12px - Small labels, metadata
- `sm`: 14px - Body text, buttons
- `base`: 16px - Default body
- `lg`: 18px - Section titles
- `xl`: 20px - Modal titles
- `2xl`: 24px - Main headings
- `3xl`: 30px - Hero titles

#### Font Weights
- `normal`: 400
- `medium`: 500
- `semibold`: 600
- `bold`: 700

### Spacing System

```typescript
spacing: {
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
}
```

### Border System

#### Border Radius
- `sm`: 4px - Small elements
- `md`: 6px - Medium elements
- `lg`: 8px - Cards, buttons
- `xl`: 12px - Large cards
- `2xl`: 16px - Modals
- `full`: 9999px - Pills, badges

## Component Patterns

### Buttons

```typescript
// Primary Button
<button className={getButtonClasses('primary', 'md')}>
  Connect Wallet
</button>

// Secondary Button
<button className={getButtonClasses('secondary', 'md')}>
  Cancel
</button>

// Success Button (Yes)
<button className={getButtonClasses('success', 'md')}>
  Buy Yes
</button>

// Error Button (No)
<button className={getButtonClasses('error', 'md')}>
  Buy No
</button>
```

### Cards

```typescript
// Interactive Market Card
<div className={getCardClasses('bordered', true)}>
  <h3>Market Title</h3>
  {/* Card content */}
</div>

// Static Info Card
<div className={getCardClasses('default', false)}>
  <p>Information content</p>
</div>
```

### Text Gradients

```typescript
// Brand gradient text
<h1 className={getTextGradient('brand')}>
  PredictMarket
</h1>

// Success gradient
<span className={getTextGradient('success')}>
  +25.5%
</span>

// Error gradient
<span className={getTextGradient('error')}>
  -12.3%
</span>
```

### Badges

```typescript
// Status badges
<span className={getBadgeClasses('success', 'sm')}>Active</span>
<span className={getBadgeClasses('error', 'sm')}>Ended</span>
<span className={getBadgeClasses('warning', 'sm')}>Ending Soon</span>
```

## Making Global Changes

### 1. Update Brand Colors

To change the primary brand color across the entire application:

```typescript
// In lib/design-system.ts
export const colors = {
  brand: {
    primary: '#YOUR_NEW_COLOR',        // Was #00FFAE
    primaryDark: '#YOUR_DARKER_COLOR', // Was #00D4AA
    // ...
  }
}
```

### 2. Update Typography

To change the font family or sizes:

```typescript
// In lib/design-system.ts
export const typography = {
  fontFamily: {
    primary: ['Your New Font', 'fallback-font', 'sans-serif'],
  },
  fontSize: {
    base: '18px', // Increase base font size
    // ...
  }
}
```

### 3. Update Component Styles

To change button styles globally:

```typescript
// In lib/design-system.ts
export const components = {
  button: {
    primary: {
      background: '#NEW_COLOR',
      hover: '#NEW_HOVER_COLOR',
      // ...
    }
  }
}
```

### 4. Update Theme Colors

To modify dark/light theme colors:

```typescript
// In lib/design-system.ts
export const colors = {
  background: {
    dark: {
      primary: '#0A0A0A',    // Slightly lighter than pure black
      secondary: '#1A1A1A',
      // ...
    }
  }
}
```

## Theme Integration

### Using Theme-Aware Values

```typescript
import { getThemeValue } from '@/lib/design-system';

// Get theme-specific background
const bgColor = getThemeValue(currentTheme, 'background.primary');

// Get theme-specific text color
const textColor = getThemeValue(currentTheme, 'text.primary');
```

### CSS Variables

Generate CSS variables for use in stylesheets:

```typescript
import { generateCSSVariables } from '@/lib/design-system';

const cssVars = generateCSSVariables('dark');
// Returns: { '--color-brand-primary': '#00FFAE', ... }
```

## Animation System

### Transition Durations
- `fast`: 200ms - Quick interactions
- `normal`: 300ms - Standard transitions
- `slow`: 500ms - Elaborate animations

### Common Animations
```typescript
// Fade in animation
<div className={getAnimation('fadeIn')}>
  Content
</div>

// Scale in animation
<div className={getAnimation('scaleIn')}>
  Content
</div>
```

## Best Practices

1. **Always use design tokens** instead of hardcoded values
2. **Use utility functions** for consistent component styling
3. **Maintain theme awareness** by using theme-specific values
4. **Follow the spacing system** for consistent layouts
5. **Use semantic colors** for their intended purpose

## Updating Styles Globally

To make sweeping changes across the application:

1. **Update the design tokens** in `lib/design-system.ts`
2. **Run the build** to ensure no TypeScript errors
3. **Test in both themes** (dark and light mode)
4. **Check responsive layouts** across breakpoints

## Examples of Global Changes

### Example 1: Change to Blue Theme

```typescript
// Update brand colors
brand: {
  primary: '#0066FF',
  primaryDark: '#0052CC',
  primaryLight: '#3385FF',
}
```

### Example 2: Increase All Spacing

```typescript
// Multiply all spacing values by 1.25
spacing: {
  1: '5px',   // was 4px
  2: '10px',  // was 8px
  3: '15px',  // was 12px
  // ...
}
```

### Example 3: Change Card Style

```typescript
// Make all cards more rounded with shadows
card: {
  borderRadius: borders.radius['2xl'], // was lg
  shadow: shadows.lg,                  // was none
}
```

## Conclusion

This design system provides a single source of truth for all UI decisions in the SocratesUI application. By modifying the tokens in `lib/design-system.ts`, you can make application-wide changes quickly and consistently.