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

export async function getCurrentLocation(): Promise<LocationData> {
    try {
        const hasPermission = await checkLocationPermission();
        if (!hasPermission) {
            const granted = await requestLocationPermission();
            if (!granted) {
                throw { type: 'permission', message: 'Location permission denied' } as LocationError;
            }
        }

        const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
        });

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
