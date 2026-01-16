
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    Pressable,
    ActivityIndicator,
    Platform,
    ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { City, INDIAN_CITIES } from '../constants/cities';
import { getRecentCities, addRecentCity } from '../services/cacheService';
import { GenZTheme } from '../constants/Theme';
import { searchStations } from '../services/aqiApi';

interface CitySearchProps {
    onSelectCity: (city: City) => void;
    currentCityId?: string | null;
}

export function CitySearch({ onSelectCity, currentCityId }: CitySearchProps) {
    const { t } = useTranslation();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<City[]>([]);
    const [recentCities, setRecentCities] = useState<City[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        loadRecentCities();
    }, []);

    const loadRecentCities = async () => {
        const recentIds = await getRecentCities();
        const cities = recentIds
            .map((id) => INDIAN_CITIES.find((c) => c.aqicnId === id))
            .filter((c): c is City => c !== undefined);
        setRecentCities(cities);
    };

    const handleSearch = async (text: string) => {
        setQuery(text);

        if (text.trim().length === 0) {
            setResults([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);

        try {
            // Debounce could be added here, but for now direct call
            const stations = await searchStations(text);
            // Map to City interface
            const found: City[] = stations.map(s => ({
                name: s.name,
                state: s.state,
                aqicnId: s.aqicnId,
                lat: s.lat,
                lng: s.lon,
            }));
            setResults(found);
        } catch (e) {
            console.error(e);
            setResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectCity = async (city: City) => {
        await addRecentCity(city.aqicnId);
        onSelectCity(city);
    };

    const popularCities = INDIAN_CITIES.slice(0, 6);

    const renderCityItem = (city: City) => {
        const isCurrent = city.aqicnId === currentCityId;
        return (
            <Pressable
                key={city.aqicnId}
                style={[
                    styles.cityItem,
                    isCurrent && styles.currentCityItem // Optional: change border/bg
                ]}
                onPress={() => handleSelectCity(city)}
            >
                <View style={styles.cityInfoWrapper}>
                    <Ionicons
                        name={isCurrent ? "location" : "location-outline"}
                        size={20}
                        color={isCurrent ? GenZTheme.colors.success : GenZTheme.colors.primary}
                        style={{ marginRight: 12 }}
                    />
                    <View>
                        <Text style={styles.cityName}>
                            {city.name}
                            {isCurrent && <Text style={styles.currentText}> • Location</Text>}
                        </Text>
                        <Text style={styles.cityState}>{city.state}</Text>
                    </View>
                </View>
                {city.nameHi && (
                    <Text style={styles.cityNameHi}>{city.nameHi}</Text>
                )}
            </Pressable>
        );
    };

    return (
        <View style={styles.container}>
            {/* Search Input */}
            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={24} color={GenZTheme.text.secondary} style={{ marginRight: 12 }} />
                <TextInput
                    style={styles.searchInput}
                    value={query}
                    onChangeText={handleSearch}
                    placeholder={t('search.placeholder')}
                    placeholderTextColor="#999"
                    autoFocus
                />
                {query.length > 0 && (
                    <Pressable onPress={() => handleSearch('')}>
                        <Text style={styles.clearIcon}>✕</Text>
                    </Pressable>
                )}
            </View>

            {isSearching && (
                <ActivityIndicator style={styles.loader} color="#1a1a2e" />
            )}

            {/* Search Results */}
            {query.length > 0 && results.length > 0 && (
                <FlatList
                    data={results}
                    keyExtractor={(item) => item.aqicnId}
                    renderItem={({ item }) => renderCityItem(item)}
                />
            )}

            {/* No Results */}
            {query.length > 0 && results.length === 0 && !isSearching && (
                <View style={styles.noResults}>
                    <Text style={styles.noResultsText}>{t('search.noResults')}</Text>
                </View>
            )}

            {/* Recent and Popular when not searching */}
            {query.length === 0 && (
                <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
                    {/* Recent Searches */}
                    {recentCities.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>{t('search.recent')}</Text>
                            {recentCities.map((city) => renderCityItem(city))}
                        </View>
                    )}

                    {/* Popular Cities */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('search.popular')}</Text>
                        {popularCities.map((city) => renderCityItem(city))}
                    </View>
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GenZTheme.background, // Match screen background
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.08)',
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 16,
        paddingHorizontal: 24,
        borderRadius: 32,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        height: 60,
    },
    searchIcon: {
        fontSize: 18,
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 16,
        color: '#FFFFFF',
        fontWeight: '500',
    },
    clearIcon: {
        fontSize: 16,
        color: '#rgba(255,255,255,0.5)',
        padding: 4,
    },
    loader: {
        marginVertical: 20,
    },
    section: {
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.5)',
        marginBottom: 16,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    cityItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: GenZTheme.cards.background, // Dark card
        borderRadius: 20,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    currentCityItem: {
        borderColor: GenZTheme.colors.success + '50', // Subtle green border
        borderWidth: 1,
        backgroundColor: GenZTheme.colors.success + '10', // Very subtle green tint
    },
    currentText: {
        color: GenZTheme.colors.success,
        fontSize: 12,
        fontWeight: '700',
    },
    cityName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    cityState: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.5)',
        marginTop: 2,
    },
    cityNameHi: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.7)',
    },
    cityInfoWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    noResults: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    noResultsText: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.5)',
        fontWeight: '500',
    },
});
