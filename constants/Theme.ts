
export const PastelTheme = {
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
      moderate: '#3b6095', // Using secondary blue for calm weather/moderate
      poor: '#7a5745', // Warm peach
      unhealthy: '#fa746f', // Error container red
      severe: '#6e0a12', // Darker red/maroon
      hazardous: '#67040d',
    }
  },
  gradients: {
    hero: ['#a1f2e3', '#d5e3ff'], // primary_fixed to secondary_fixed
    aqiTrack: ['#a1f2e3', '#fed0b9', '#fa746f'],
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48, // 3rem
  },
  borderRadius: {
    s: 12,
    m: 16,
    l: 24,
    xl: 48, // 3rem (ROUND_FULL / editorial look)
  },
  typography: {
    display: {
      fontFamily: 'Manrope_600SemiBold',
      fontSize: 56, // 3.5rem
      letterSpacing: -2.24, // -0.04em
    },
    headline: {
        fontFamily: 'Manrope_500Medium',
        fontSize: 32, // 2rem
    },
    title: {
        fontFamily: 'Inter_500Medium',
        fontSize: 18, // 1.125rem
    },
    body: {
        fontFamily: 'Inter_400Regular',
        fontSize: 14, // 0.875rem
    },
    label: {
        fontFamily: 'Inter_700Bold',
        fontSize: 11, // 0.6875rem
    }
  }
};

// Aliasing for compatibility during transition
export const GenZTheme = PastelTheme;

export const AQIColors = {
  good: '#096b60',
  moderate: '#3b6095',
  poor: '#7a5745',
  unhealthy: '#fa746f',
  severe: '#6e0a12',
  hazardous: '#67040d',
};
