
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
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { searchCities, City, INDIAN_CITIES } from '../constants/cities';
import { getRecentCities, addRecentCity } from '../services/cacheService';
import { GenZTheme } from '../constants/Theme';

interface CitySearchProps {
    onSelectCity: (city: City) => void;
}

export function CitySearch({ onSelectCity }: CitySearchProps) {
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

    const handleSearch = (text: string) => {
        setQuery(text);
        setIsSearching(true);

        if (text.trim().length > 0) {
            const found = searchCities(text);
            setResults(found);
        } else {
            setResults([]);
        }

        setIsSearching(false);
    };

    const handleSelectCity = async (city: City) => {
        await addRecentCity(city.aqicnId);
        onSelectCity(city);
    };

    const popularCities = INDIAN_CITIES.slice(0, 6);

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
                    renderItem={({ item }) => (
                        <Pressable
                            style={styles.cityItem}
                            onPress={() => handleSelectCity(item)}
                        >
                            <Ionicons name="location-outline" size={20} color={GenZTheme.colors.primary} style={{ marginRight: 12 }} />
                            <View>
                                <Text style={styles.cityName}>{item.name}</Text>
                                <Text style={styles.cityState}>{item.state}</Text>
                            </View>
                            {item.nameHi && (
                                <Text style={styles.cityNameHi}>{item.nameHi}</Text>
                            )}
                        </Pressable>
                    )}
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
                <>
                    {/* Recent Searches */}
                    {recentCities.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>{t('search.recent')}</Text>
                            {recentCities.map((city) => (
                                <Pressable
                                    key={city.aqicnId}
                                    style={styles.cityItem}
                                    onPress={() => handleSelectCity(city)}
                                >
                                    <Ionicons name="location-outline" size={20} color={GenZTheme.colors.primary} style={{ marginRight: 12 }} />
                                    <View>
                                        <Text style={styles.cityName}>{city.name}</Text>
                                        <Text style={styles.cityState}>{city.state}</Text>
                                    </View>
                                </Pressable>
                            ))}
                        </View>
                    )}

                    {/* Popular Cities */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('search.popular')}</Text>
                        {popularCities.map((city) => (
                            <Pressable
                                key={city.aqicnId}
                                style={styles.cityItem}
                                onPress={() => handleSelectCity(city)}
                            >
                                <Ionicons name="location-outline" size={20} color={GenZTheme.colors.primary} style={{ marginRight: 12 }} />
                                <View>
                                    <Text style={styles.cityName}>{city.name}</Text>
                                    <Text style={styles.cityState}>{city.state}</Text>
                                </View>
                                {city.nameHi && (
                                    <Text style={styles.cityNameHi}>{city.nameHi}</Text>
                                )}
                            </Pressable>
                        ))}
                    </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GenZTheme.cards.background,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 16,
        paddingHorizontal: 24,
        borderRadius: 32, // Pill shape
        borderWidth: 1.5,
        borderColor: '#EEEEEE',
        height: 60, // Taller touch target
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    searchIcon: {
        fontSize: 18,
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 16,
        color: GenZTheme.text.primary,
        fontWeight: '500',
    },
    clearIcon: {
        fontSize: 16,
        color: GenZTheme.text.secondary,
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
        color: GenZTheme.text.secondary,
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
        backgroundColor: '#FCFCFC',
        borderRadius: 20,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#F5F5F5',
    },
    cityName: {
        fontSize: 16,
        fontWeight: '700',
        color: GenZTheme.text.primary,
    },
    cityState: {
        fontSize: 13,
        color: GenZTheme.text.secondary,
        marginTop: 2,
    },
    cityNameHi: {
        fontSize: 16,
        color: GenZTheme.text.secondary,
    },
    noResults: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    noResultsText: {
        fontSize: 16,
        color: GenZTheme.text.secondary,
        fontWeight: '500',
    },
});
