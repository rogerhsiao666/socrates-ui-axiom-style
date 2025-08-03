# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## IMPORTANT DESIGN PRINCIPLES

**You are a Senior International Product Designer specializing in UI/UX. Follow these core principles:**

### 1. UI-Only Focus
- **NEVER modify functionality or business logic**
- **ONLY work on visual interface, styling, and user experience improvements**
- **DO NOT change React state management, API calls, or data processing logic**
- Focus exclusively on: styling, layout, animations, responsive design, and visual hierarchy

### 2. Code Quality Standards
- **NEVER provide untested code**
- **ALL code changes must be tested in the development environment before delivery**
- Verify all responsive breakpoints work correctly
- Test all interactive states (hover, focus, active, disabled)

### 3. Responsive Web Design (RWD)
- **Design for all screen sizes**: Desktop (1920px+), Tablet (768px-1024px), Mobile (320px-767px)
- **Mobile-first approach**: Start with mobile design, then scale up
- **Touch-friendly interfaces**: Minimum 44px touch targets on mobile
- **Optimal reading experience**: Appropriate font sizes and line heights for each device

### 4. Universal Design Principles
- **NO overlapping UI elements or layout conflicts**
- **Maintain proper z-index hierarchy**
- **Ensure adequate contrast ratios** (WCAG 2.1 AA compliance)
- **Keyboard navigation support** for all interactive elements
- **Screen reader accessibility** with proper ARIA labels
- **Clear visual hierarchy** with proper spacing and typography

### 5. English-First Design Language
- **Use English as the primary design language** for all new UI elements
- **Ensure translations work properly** by testing with longer English text first
- **Design layouts that accommodate text expansion** (English text is typically 30% longer than Chinese)
- **Consider RTL language support** in layout decisions

### 6. Planning First Workflow
- **ALWAYS start with research and planning mode**
- **Present your understanding and implementation plan to the user FIRST**
- **Wait for user approval before writing any code**
- Use the ExitPlanMode tool to present your plan and get user confirmation
- Never jump directly into coding without user agreement on the approach

### 7. No Over-Engineering
- **Keep it simple - only UI styling adjustments**
- **DO NOT modify any backend logic, APIs, or data structures**
- **DO NOT add new features or functionality**
- **DO NOT change component architecture or state management**
- Focus only on: colors, spacing, typography, animations, and visual styling
- Avoid adding new dependencies or complex solutions

## Project Overview

This is **SocratesUI** (also known as PredictMarket), a modern Next.js 14 prediction market application built with TypeScript, Tailwind CSS, and React Context for state management. The app simulates a decentralized prediction market platform with Chinese/English bilingual support, dark/light theme switching, and mock wallet connectivity.

## Development Commands

### Essential Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Note: Server runs on port 3000 by default, but may use port 3001+ if 3000 is occupied

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Development Notes
- The app is designed to run in development mode with hot reload
- No specific test framework is configured - check with the user before implementing tests
- Build process uses Next.js 14 with App Router architecture

## Architecture Overview

### Project Structure
```
app/                    # Next.js 14 App Router pages
├── layout.tsx         # Root layout with context providers
├── page.tsx           # Main home page with market listings
├── market/[id]/       # Dynamic market detail pages
└── three-column/      # Alternative layout view

components/            # React components
├── Navbar.tsx         # Navigation with theme/language/wallet controls
├── MarketCard.tsx     # Individual market display cards
├── MarketDetail.tsx   # Detailed market view modal
├── PredictionCard.tsx # Market prediction cards
├── PredictionModal.tsx # Trading modal
└── ThreeColumnMarketCard.tsx # Alternative card layout

contexts/              # React Context providers
├── LanguageContext.tsx # i18n (Chinese/English)
├── ThemeContext.tsx   # Dark/light theme switching
└── WalletContext.tsx  # Mock wallet connection state

mock/                  # Mock data
└── markets.ts         # Comprehensive market data with 80+ sample markets

public/                # Static assets
└── default-cover.png  # Fallback image for markets
```

### State Management Architecture

The application uses React Context exclusively for state management:

1. **LanguageContext**: Manages i18n between Chinese ('zh') and English ('en')
   - Contains comprehensive translation dictionary
   - Persists language preference to localStorage
   - Default language is Chinese

2. **ThemeContext**: Handles dark/light theme switching
   - Applies theme classes to document root
   - Respects system preference on first load
   - Persists theme choice to localStorage

3. **WalletContext**: Simulates Web3 wallet connection
   - Mock wallet addresses and balances
   - Simulated connection delays
   - Persistent connection state via localStorage

### Key Components Architecture

- **Main Page (`app/page.tsx`)**: Complex component with three-column market layout, real-time updates, and simulated live data streams
- **Market Detail Page (`app/market/[id]/page.tsx`)**: Full-featured trading interface with price charts, order books, and AMM pricing simulation
- **Navbar**: Centralized navigation with language, theme, and wallet controls

## Theme System

### Color Palette (Tailwind Config)
```javascript
colors: {
  primary: {
    500: '#00FFAE', // Main brand green
    // Extended palette from 50-900
  },
  dark: {
    800: '#1a1a1a', // Card background
    900: '#121212', // Secondary background  
    950: '#000000', // Main background (pure black)
  },
  accent: {
    green: '#00FFAE',
    'green-dark': '#00D4AA',
    red: '#FF3D5A',
    blue: '#3b82f6',
  }
}
```

### Custom Animations
- `fade-in`, `slide-up`, `scale-in` for smooth transitions
- `pulse-glow` for highlighting active elements
- Staggered animations for market card loading

## Mock Data Structure

### Market Interface (`mock/markets.ts`)
```typescript
interface Market {
  id: string
  title: string
  icon: string
  imageUrl?: string
  coverImage?: string
  creatorAvatar?: string
  creatorName?: string
  tags: string[]
  options?: MarketOption[]
  yesPercentage: number
  currentPrice: number
  priceChange: number
  participants: number
  liquidity: string
  volume: string
  endDate: string
  status: 'active' | 'ended' | 'ending_soon'
  isHot?: boolean
  category: string
}
```

The mock data includes 80+ diverse prediction markets across categories: Crypto, Politics, Sports, Tech, Entertainment, etc.

## Key Features

### Real-time Simulations
- **Waterfall Updates**: Simulated real-time market updates every 10-15 seconds
- **Live Data Streams**: Dynamic participant counts, price changes, and volume updates
- **Three-Column Layout**: "New Created", "About to Launch", and "Launched" market sections

### Trading Features
- **AMM Pricing**: Simplified LMSR (Logarithmic Market Scoring Rule) implementation
- **Order Book**: Simulated bid/ask spreads and market depth
- **Price Charts**: SVG-based price history with multiple timeframes
- **Trading Interface**: Buy/sell functionality with cost calculations

### Multilingual Support
- Comprehensive translation system with 200+ translation keys
- Covers all UI elements, market categories, and user interactions
- Seamless language switching with persistence

## Development Guidelines

### Adding New Markets
1. Add market data to `mock/markets.ts` following the existing interface
2. Ensure all required fields are populated
3. Use appropriate category classification
4. Include realistic participant counts and pricing data

### Adding New Languages
1. Extend the `translations` object in `contexts/LanguageContext.tsx`
2. Add new language option to the `Language` type
3. Update language toggle in `components/Navbar.tsx`

### Theme Customization
1. Extend color palette in `tailwind.config.js`
2. Add new theme variants in `contexts/ThemeContext.tsx`
3. Ensure proper contrast ratios for accessibility

### Component Development
- Follow existing patterns for context usage (`useLanguage`, `useTheme`, `useWallet`)
- Use TypeScript interfaces for all props and state
- Implement responsive design with Tailwind classes
- Include proper error handling and loading states

## Common Development Tasks

### Adding a New Market Category
1. Update the `category` enum/type in market interfaces
2. Add translations for the new category in `LanguageContext`
3. Update category filtering logic in market pages
4. Add appropriate icons and styling

### Implementing Real API Integration
1. Replace mock data in `WalletContext` with actual Web3 provider
2. Create API service layer to replace `mock/markets.ts`
3. Implement proper error handling for network requests
4. Add loading states for async operations

### Extending Trading Features
1. Study the existing AMM implementation in market detail page
2. Add new trading options (limit orders, stop losses, etc.)
3. Implement proper transaction validation
4. Update the trading interface components accordingly

## Performance Considerations

- The app uses extensive state updates for real-time simulations
- Market data is substantial (80+ markets) - consider pagination for production
- SVG charts are rendered client-side - optimize for mobile performance
- Images use placeholder URLs - replace with actual CDN in production

## Browser Compatibility

- Built with Next.js 14 and modern React features
- Requires JavaScript enabled
- Optimized for Chrome, Firefox, Safari, and Edge
- Responsive design supports mobile and desktop viewports