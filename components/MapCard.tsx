import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { BlurView } from 'expo-blur';
import { GenZTheme } from '../constants/Theme';

interface MapCardProps {
    latitude: number;
    longitude: number;
    aqi: number;
    cityName?: string; // Used to search for nearby stations as fallback
}

const DARK_MAP_STYLE = [
    {
        "elementType": "geometry",
        "stylers": [{ "color": "#212121" }]
    },
    {
        "elementType": "labels.icon",
        "stylers": [{ "visibility": "off" }]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#757575" }]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [{ "color": "#212121" }]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [{ "color": "#757575" }]
    },
    {
        "featureType": "administrative.country",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#9e9e9e" }]
    },
    {
        "featureType": "administrative.land_parcel",
        "stylers": [{ "visibility": "off" }]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#bdbdbd" }]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#757575" }]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{ "color": "#181818" }]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#616161" }]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.stroke",
        "stylers": [{ "color": "#1b1b1b" }]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [{ "color": "#2c2c2c" }]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#8a8a8a" }]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [{ "color": "#373737" }]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{ "color": "#3c3c3c" }]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [{ "color": "#4e4e4e" }]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#616161" }]
    },
    {
        "featureType": "transit",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#757575" }]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{ "color": "#000000" }]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#3d3d3d" }]
    }
];

import { fetchStationsInBounds, MapStation, searchStations } from '../services/aqiApi';

export function MapCard({ latitude, longitude, aqi, cityName }: MapCardProps) {
    const [stations, setStations] = React.useState<MapStation[]>([]);

    const getAQIColor = (value: number) => {
        if (value <= 50) return GenZTheme.colors.aqi.good;
        if (value <= 100) return GenZTheme.colors.aqi.moderate;
        if (value <= 150) return GenZTheme.colors.aqi.poor;
        if (value <= 200) return GenZTheme.colors.aqi.unhealthy;
        if (value <= 300) return GenZTheme.colors.aqi.severe;
        return GenZTheme.colors.aqi.hazardous;
    };

    React.useEffect(() => {
        const fetchNearby = async () => {
            // Try bounds API first
            const delta = 0.5;
            const minLat = latitude - delta;
            const minLng = longitude - delta;
            const maxLat = latitude + delta;
            const maxLng = longitude + delta;

            console.log(`MapCard: Fetching stations near ${latitude}, ${longitude}`);
            let data = await fetchStationsInBounds(minLat, minLng, maxLat, maxLng);

            // Fallback: If bounds API returns empty and we have a city name, search for it
            if (data.length === 0 && cityName) {
                console.log(`MapCard: Bounds empty, searching for "${cityName}"`);
                // Extract city name (e.g., "Pune" from "Shivajinagar, Pune, India")
                const parts = cityName.split(',');
                const searchTerm = parts.length > 1 ? parts[1].trim() : parts[0].trim();
                const searchResults = await searchStations(searchTerm);

                // Convert search results to MapStation format (approximate coordinates)
                // Since search doesn't give coordinates, we'll just show the popup list
                // and rely on the StationPicker component for actual switching
                console.log(`MapCard: Found ${searchResults.length} stations via search`);

                // For the map, we'll just show the main marker since search doesn't return coords
                // The StationPicker will handle the multi-station selection
            }

            // Filter out stations with invalid AQI
            const validData = data.filter(s => s.aqi !== '-');
            console.log(`MapCard: ${validData.length} valid stations after filter`);
            setStations(validData);
        };
        fetchNearby();
    }, [latitude, longitude, cityName]);

    return (
        <View style={styles.container}>
            <BlurView intensity={20} tint="dark" style={styles.glass}>
                <View style={styles.header}>
                    <Text style={styles.title}>Nearby Stations</Text>
                </View>

                <View style={styles.mapContainer}>
                    <MapView
                        provider={PROVIDER_DEFAULT}
                        style={styles.map}
                        customMapStyle={DARK_MAP_STYLE}
                        initialRegion={{
                            latitude: latitude,
                            longitude: longitude,
                            latitudeDelta: 0.1, // Zoom out slightly to see neighbors
                            longitudeDelta: 0.1,
                        }}
                    >
                        {stations.map(station => {
                            const val = parseInt(station.aqi);
                            if (isNaN(val)) return null;
                            const color = getAQIColor(val);

                            // Highlight the current station if UID matches or coordinates are very close
                            // For simplicity, we just render all fetched stations.
                            // The one passed in props might be one of them.

                            return (
                                <Marker
                                    key={station.uid}
                                    coordinate={{ latitude: station.lat, longitude: station.lon }}
                                    title={station.station.name}
                                    description={`AQI: ${val}`}
                                >
                                    <View style={[styles.marker, { backgroundColor: color }]}>
                                        <Text style={styles.markerText}>{val}</Text>
                                    </View>
                                </Marker>
                            );
                        })}

                        {/* Fallback: If bounds API fails or returns nothing, ensure at least the main station is shown */}
                        {stations.length === 0 && (
                            <Marker
                                coordinate={{ latitude, longitude }}
                                title={`AQI: ${aqi}`}
                            >
                                <View style={[styles.marker, { backgroundColor: getAQIColor(aqi) }]}>
                                    <Text style={styles.markerText}>{aqi}</Text>
                                </View>
                            </Marker>
                        )}
                    </MapView>
                </View>
            </BlurView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 24,
        overflow: 'hidden',
        marginHorizontal: 16,
        marginTop: 24,
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        backgroundColor: 'rgba(30, 30, 30, 0.6)',
    },
    glass: {
        padding: 20,
    },
    header: {
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: GenZTheme.text.primary,
    },
    mapContainer: {
        height: 200,
        borderRadius: 16,
        overflow: 'hidden',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    marker: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    markerText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
    },
});
