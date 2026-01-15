
export const GenZTheme = {
    background: '#121212', // Darker Black
    text: {
        primary: '#FAFAFA', // Almost White
        secondary: 'rgba(208, 210, 215, 0.9)', // Light Grey
        light: '#FFFFFF',
        accent: '#4BA9FF', // Bright Blue
    },
    cards: {
        background: 'rgba(30, 30, 30, 0.6)',
        shadow: 'none',
        border: 'rgba(255, 255, 255, 0.1)',
        backdrop: 'blur(12px)',
    },
    colors: {
        primary: '#4BA9FF', // Bright Blue
        secondary: '#A0A0A0',
        success: '#50F0E6', // Cyan-Green
        warning: '#FAD519', // Yellow
        danger: '#E95478', // Pinkish-Red
        info: '#AF52DE', // Purple
        dark: '#121212',
        light: '#FFFFFF',
        aqi: {
            good: '#50F0E6',
            moderate: '#FAD519',
            poor: '#FF9500',
            unhealthy: '#E95478',
            severe: '#AF52DE',
            hazardous: '#8B0000',
        }
    },
    gradients: {
        primary: ['#4BA9FF', '#007AFF'],
        background: ['#121212', '#121212'], // Solid dark
        card: ['rgba(30, 30, 30, 0.8)', 'rgba(30, 30, 30, 0.4)'],
        good: ['#50F0E6', '#00F260'],
        moderate: ['#FAD519', '#F7971E'],
        unhealthy: ['#E95478', '#cb2d3e'],
    },
    glass: {
        default: {
            backgroundColor: 'rgba(20, 20, 20, 0.6)',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
        },
        heavy: {
            backgroundColor: 'rgba(34, 39, 44, 0.85)',
            borderColor: 'rgba(255,255,255,0.2)',
            borderWidth: 1,
        }
    },
    spacing: {
        s: 8,
        m: 16,
        l: 24,
        xl: 32,
        xxl: 40,
    },
    borderRadius: {
        s: 12,
        m: 16,
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
