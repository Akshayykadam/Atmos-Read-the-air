
export const GenZTheme = {
    background: '#FDFBF7', // Soft Cream / Off-white
    text: {
        primary: '#1A1A1A', // Soft Black
        secondary: '#666666', // Dark Grey
        light: '#FFFFFF', // White
        accent: '#6C5CE7', // Soft Purple
    },
    cards: {
        background: '#FFFFFF',
        shadow: 'rgba(0,0,0,0.05)',
        border: '#F0F0F0',
    },
    colors: {
        primary: '#6C4AB6', // Deep vibrant purple
        secondary: '#B9E0FF', // Icy Blue
        success: '#00D2A0', // Mint
        warning: '#F9D71C', // Yellow
        danger: '#FF6B6B', // Coral
        info: '#74B9FF', // Sky Blue
        dark: '#2D3436', // Dark
        light: '#FFFFFF',
    },
    gradients: {
        primary: ['#A29BFE', '#6C5CE7'],
        background: ['#E0C3FC', '#8EC5FC'], // Soft purple to blue
        card: ['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.4)'],
        good: ['#00F260', '#0575E6'], // Green to Blue gradient
        moderate: ['#F7971E', '#FFD200'], // Orange to Yellow
        unhealthy: ['#cb2d3e', '#ef473a'], // Red gradient
    },
    glass: {
        default: {
            backgroundColor: 'rgba(255,255,255,0.25)',
            borderColor: 'rgba(255,255,255,0.3)',
            borderWidth: 1,
        },
        heavy: {
            backgroundColor: 'rgba(255,255,255,0.6)',
            borderColor: 'rgba(255,255,255,0.5)',
            borderWidth: 1,
        }
    },
    spacing: {
        s: 8,
        m: 16,
        l: 24,
        xl: 32,
    },
    borderRadius: {
        s: 12,
        m: 20,
        l: 32,
        xl: 50,
    }
};

// Pastel versions of AQI colors
export const AQIColors = {
    good: '#B9FBC0', // Mint Green
    moderate: '#FDFFB6', // Pastel Yellow
    unhealthySensitive: '#FFD6A5', // Pastel Orange
    unhealthy: '#FFADAD', // Pastel Red
    veryUnhealthy: '#CDB4DB', // Pastel Purple
    hazardous: '#A0C4FF', // Pastel Blue (or maybe dark purple/maroon usually, but keeping it aesthetic) - wait, hazardous should be scary. Let's keep it reddish/brown but nicer.
    // Actually, for AQI, readability is key. Let's stick to standard but nicer hexes.
    goodStandard: '#00b894',
    moderateStandard: '#ffeaa7',
    unhealthyStandard: '#fab1a0',
};
