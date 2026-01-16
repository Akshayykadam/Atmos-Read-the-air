import * as Location from 'expo-location';

export interface LocationData {
    latitude: number;
    longitude: number;
}

export interface LocationError {
    type: 'permission' | 'unavailable' | 'timeout' | 'unknown';
    message: string;
}

export async function requestLocationPermission(): Promise<boolean> {
    try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        return status === 'granted';
    } catch {
        return false;
    }
}

export async function checkLocationPermission(): Promise<boolean> {
    try {
        const { status } = await Location.getForegroundPermissionsAsync();
        return status === 'granted';
    } catch {
        return false;
    }
}

// Helper to add timeout to any promise
function withTimeout<T>(promise: Promise<T>, ms: number, errorMessage: string): Promise<T> {
    const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(errorMessage)), ms)
    );
    return Promise.race([promise, timeout]);
}

export async function getCurrentLocation(): Promise<LocationData> {
    try {
        // Check permission with 3s timeout
        const hasPermission = await withTimeout(
            checkLocationPermission(),
            3000,
            'Permission check timeout'
        );

        if (!hasPermission) {
            // Request permission with 5s timeout
            const granted = await withTimeout(
                requestLocationPermission(),
                5000,
                'Permission request timeout'
            );
            if (!granted) {
                throw { type: 'permission', message: 'Location permission denied' } as LocationError;
            }
        }

        // Get location with 10s timeout
        const location = await withTimeout(
            Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            }),
            10000,
            'Location request timeout'
        );

        return {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        };
    } catch (error) {
        if ((error as LocationError).type) {
            throw error;
        }

        if (error instanceof Error) {
            if (error.message.includes('timeout')) {
                throw { type: 'timeout', message: 'Location request timed out' } as LocationError;
            }
            if (error.message.includes('unavailable')) {
                throw { type: 'unavailable', message: 'Location services unavailable' } as LocationError;
            }
        }

        throw { type: 'unknown', message: 'Failed to get location' } as LocationError;
    }
}

export async function getLocationWithFallback(): Promise<LocationData | null> {
    try {
        return await getCurrentLocation();
    } catch {
        return null;
    }
}
