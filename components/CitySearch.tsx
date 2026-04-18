
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

    const renderCityItem = (city: City, prefix: string = '') => {
        const isCurrent = city.aqicnId === currentCityId;
        const key = prefix ? `${prefix}-${city.aqicnId}` : city.aqicnId;
        return (
            <Pressable
                key={key}
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
                        color={isCurrent ? GenZTheme.colors.primary : GenZTheme.text.secondary}
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
                    placeholderTextColor={GenZTheme.text.secondary}
                    autoFocus
                />
                {query.length > 0 && (
                    <Pressable onPress={() => handleSearch('')}>
                        <Ionicons name="close-circle" style={styles.clearIcon} />
                    </Pressable>
                )}
            </View>

            {isSearching && (
                <ActivityIndicator style={styles.loader} color={GenZTheme.colors.primary} />
            )}

            {/* Search Results */}
            {query.length > 0 && results.length > 0 && (
                <FlatList
                    data={results}
                    keyExtractor={(item) => `search-${item.aqicnId}`}
                    renderItem={({ item }) => renderCityItem(item, 'search')}
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
                            {recentCities.map((city) => renderCityItem(city, 'recent'))}
                        </View>
                    )}

                    {/* Popular Cities */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('search.popular')}</Text>
                        {popularCities.map((city) => renderCityItem(city, 'popular'))}
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
        backgroundColor: GenZTheme.cards.background,
        marginHorizontal: 24,
        marginTop: 20,
        marginBottom: 24,
        paddingHorizontal: 24,
        borderRadius: 100,
        height: 56,
        ...GenZTheme.cards.shadow,
    },
    searchIcon: {
        fontSize: 18,
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        fontFamily: GenZTheme.typography.body.fontFamily,
        color: GenZTheme.text.primary,
        paddingVertical: 16,
    },
    clearIcon: {
        fontSize: 20,
        color: GenZTheme.text.secondary,
        padding: 4,
    },
    loader: {
        marginVertical: 20,
    },
    section: {
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 10,
        fontFamily: GenZTheme.typography.label.fontFamily,
        color: GenZTheme.text.secondary,
        marginBottom: 16,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    cityItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 18,
        paddingHorizontal: 24,
        backgroundColor: GenZTheme.cards.background,
        borderRadius: 24,
        marginBottom: 12,
        ...GenZTheme.cards.shadow,
    },
    currentCityItem: {
        backgroundColor: GenZTheme.colors.primaryContainer,
    },
    currentText: {
        color: GenZTheme.colors.primary,
        fontFamily: GenZTheme.typography.body.fontFamily,
        fontSize: 12,
    },
    cityName: {
        fontSize: 14,
        fontFamily: GenZTheme.typography.title.fontFamily,
        color: GenZTheme.text.primary,
    },
    cityState: {
        fontSize: 12,
        fontFamily: GenZTheme.typography.body.fontFamily,
        color: GenZTheme.text.secondary,
        marginTop: 2,
    },
    cityNameHi: {
        fontSize: 14,
        fontFamily: GenZTheme.typography.body.fontFamily,
        color: GenZTheme.text.secondary,
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
        fontSize: 14,
        fontFamily: GenZTheme.typography.body.fontFamily,
        color: GenZTheme.text.secondary,
    },
});
