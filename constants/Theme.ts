

export const PastelLightTheme = {
  background: '#f6fafe', // Base Layer
  surface: '#f6fafe',
  text: {
    primary: '#2a343a', // on-surface
    secondary: '#566167', // on-surface-variant
    light: '#ffffff',
    accent: '#096b60', // primary
  },
  cards: {
    background: '#ffffff', // surface-container-lowest
    secondary: '#eef4fa', // surface-container-low
    border: 'rgba(169, 179, 187, 0.15)', // outline-variant (15% opacity)
    shadow: {
        shadowColor: "#2a343a",
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.06,
        shadowRadius: 40,
        elevation: 10,
    }
  },
  colors: {
    primary: '#096b60',
    onPrimary: '#e2fff8',
    primaryContainer: '#a1f2e3',
    secondary: '#3b6095',
    secondaryContainer: '#d5e3ff',
    tertiary: '#7a5745',
    tertiaryContainer: '#fed0b9',
    error: '#fa746f', // error_container
    success: '#096b60',
    warning: '#7a5745',
    aqi: {
      good: '#096b60',
      moderate: '#3b6095',
      poor: '#7a5745',
      unhealthy: '#fa746f',
      severe: '#6e0a12',
      hazardous: '#67040d',
    }
  },
  gradients: {
    hero: ['#a1f2e3', '#d5e3ff'], 
    aqiTrack: ['#a1f2e3', '#fed0b9', '#fa746f'],
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48, 
  },
  borderRadius: {
    s: 12,
    m: 16,
    l: 24,
    xl: 48, 
  },
  typography: {
    display: {
      fontFamily: 'Manrope_600SemiBold',
      fontSize: 56,
      letterSpacing: -2.24,
    },
    headline: {
        fontFamily: 'Manrope_500Medium',
        fontSize: 32,
    },
    title: {
        fontFamily: 'Inter_500Medium',
        fontSize: 18,
    },
    body: {
        fontFamily: 'Inter_400Regular',
        fontSize: 14,
    },
    label: {
        fontFamily: 'Inter_700Bold',
        fontSize: 11,
    }
  }
};

export const PastelDarkTheme = {
  ...PastelLightTheme,
  background: '#12171a', // Deep Slate Base
  surface: '#1b2226',
  text: {
    ...PastelLightTheme.text,
    primary: '#f6fafe', // Flipped from light background
    secondary: '#a9b3bb', 
  },
  cards: {
    ...PastelLightTheme.cards,
    background: '#1b2226', // surface-container-lowest (dark)
    secondary: '#222b30', // surface-container-low
    border: 'rgba(255, 255, 255, 0.08)',
    shadow: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.25,
        shadowRadius: 40,
        elevation: 10,
    }
  },
  colors: {
    ...PastelLightTheme.colors,
    onPrimary: '#12171a', // Contrast on dark
  },
  gradients: {
    hero: ['#1b2226', '#222b30'], // Subtler for dark mode
    aqiTrack: ['#a1f2e3', '#fed0b9', '#fa746f'],
  }
};

export type ThemeType = typeof PastelLightTheme;

// Aliasing for compatibility during transition
export const GenZTheme = PastelLightTheme;
export const PastelTheme = PastelLightTheme;

export const AQIColors = {
  good: '#096b60',
  moderate: '#3b6095',
  poor: '#7a5745',
  unhealthy: '#fa746f',
  severe: '#6e0a12',
  hazardous: '#67040d',
};

