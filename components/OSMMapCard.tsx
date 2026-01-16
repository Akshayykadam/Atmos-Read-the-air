import React from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';
import { GenZTheme } from '../constants/Theme';
import { fetchStationsInBounds, MapStation } from '../services/aqiApi';

interface OSMMapCardProps {
    latitude: number;
    longitude: number;
    aqi: number;
    cityName?: string;
}

export function OSMMapCard({ latitude, longitude, aqi, cityName }: OSMMapCardProps) {
    const { t } = useTranslation();
    const [stations, setStations] = React.useState<MapStation[]>([]);

    const getAQIColor = (value: number) => {
        if (value <= 50) return GenZTheme.colors.aqi.good;
        if (value <= 100) return GenZTheme.colors.aqi.moderate;
        if (value <= 150) return GenZTheme.colors.aqi.poor;
        if (value <= 200) return GenZTheme.colors.aqi.unhealthy;
        if (value <= 300) return GenZTheme.colors.aqi.severe;
        return GenZTheme.colors.aqi.hazardous;
    };

    // Fetch nearby stations
    React.useEffect(() => {
        const fetchNearby = async () => {
            const delta = 0.2;
            const data = await fetchStationsInBounds(
                latitude - delta,
                longitude - delta,
                latitude + delta,
                longitude + delta
            );

            const validData = data.filter(s => s.aqi !== '-');
            setStations(validData);
        };
        fetchNearby();
    }, [latitude, longitude, cityName]);

    // Generate markers JSON for the WebView
    const markersJson = JSON.stringify(
        stations.length > 0
            ? stations.map(s => ({
                lat: s.lat,
                lon: s.lon,
                aqi: parseInt(s.aqi),
                name: s.station.name,
                color: getAQIColor(parseInt(s.aqi)),
            }))
            : [{
                lat: latitude,
                lon: longitude,
                aqi: aqi,
                name: t('dashboard.currentLocation'),
                color: getAQIColor(aqi),
            }]
    );

    // HTML content with Leaflet.js and OpenStreetMap
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body, #map { width: 100%; height: 100%; }
        .aqi-marker {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border: 2px solid white;
            color: white;
            font-weight: bold;
            font-size: 12px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        }
    </style>
</head>
<body>
    <div id="map"></div>
    <script>
        // Dark mode tile layer (CartoDB Dark Matter)
        var darkTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap, &copy; CartoDB',
            subdomains: 'abcd',
            maxZoom: 19
        });

        var map = L.map('map', {
            center: [${latitude}, ${longitude}],
            zoom: 12,
            zoomControl: false,
            attributionControl: false,
            layers: [darkTiles]
        });

        // Add markers
        var markers = ${markersJson};
        markers.forEach(function(m) {
            var icon = L.divIcon({
                className: 'custom-marker',
                html: '<div class="aqi-marker" style="background-color: ' + m.color + ';">' + m.aqi + '</div>',
                iconSize: [36, 36],
                iconAnchor: [18, 18]
            });
            L.marker([m.lat, m.lon], { icon: icon })
                .bindPopup('<b>' + m.name + '</b><br>AQI: ' + m.aqi)
                .addTo(map);
        });

        // Fit bounds to show all markers
        if (markers.length > 1) {
            var group = new L.featureGroup(markers.map(function(m) {
                return L.marker([m.lat, m.lon]);
            }));
            map.fitBounds(group.getBounds().pad(0.1));
        }
    </script>
</body>
</html>
`;

    return (
        <View style={styles.container}>
            <BlurView intensity={20} tint="dark" style={styles.glass}>
                <View style={styles.header}>
                    <Text style={styles.title}>{t('dashboard.nearbyStations')}</Text>
                </View>

                <View style={styles.mapContainer}>
                    <WebView
                        source={{ html: htmlContent }}
                        style={styles.map}
                        scrollEnabled={false}
                        bounces={false}
                        overScrollMode="never"
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        originWhitelist={['*']}
                    />
                </View>
            </BlurView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 24,
        overflow: 'hidden',
        marginHorizontal: 20,
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
        backgroundColor: '#212121',
    },
});
