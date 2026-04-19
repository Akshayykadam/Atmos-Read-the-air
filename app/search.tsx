import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { ThemeType } from '../constants/Theme';

import { CitySearch } from '../components/CitySearch';
import { City } from '../constants/cities';
import { getSelectedCity, setSelectedCity } from '../services/cacheService';

export default function SearchScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const { theme: GenZTheme } = useTheme();
    const styles = React.useMemo(() => getStyles(GenZTheme), [GenZTheme]);
    const [currentCityId, setCurrentCityId] = React.useState<string | null>(null);

    React.useEffect(() => {
        const loadCurrent = async () => {
            const city = await getSelectedCity();
            setCurrentCityId(city);
        };
        loadCurrent();
    }, []);

    const handleSelectCity = async (city: City) => {
        await setSelectedCity(city.aqicnId);
        router.back();
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Custom Header with Back Button */}
            <View style={styles.header}>
                <Pressable style={styles.backButton} onPress={handleBack}>
                    <Ionicons name="arrow-back" size={24} color={GenZTheme.text.primary} />
                </Pressable>
                <Text style={styles.headerTitle}>{t('search.title')}</Text>
                <View style={styles.placeholder} />
            </View>

            <CitySearch onSelectCity={handleSelectCity} currentCityId={currentCityId} />
        </View>
    );
}

const getStyles = (GenZTheme: ThemeType) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: GenZTheme.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: GenZTheme.background,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: GenZTheme.cards.background,
        justifyContent: 'center',
        alignItems: 'center',
        ...GenZTheme.cards.shadow,
    },
    headerTitle: {
        fontSize: 16,
        fontFamily: GenZTheme.typography.title.fontFamily,
        color: GenZTheme.text.primary,
        letterSpacing: 1,
    },
    placeholder: {
        width: 40,
    },
});
