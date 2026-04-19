import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from 'react-native-gifted-charts';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { ThemeType } from '../constants/Theme';
import {
    OpenMeteoData,
    getWeatherInfo,
} from '../services/weatherApi';

interface WeatherDetailedProps {
    weatherData: OpenMeteoData | null;
    isLoading: boolean;
    cityName?: string;
}

const { width } = Dimensions.get('window');

export const WeatherDetailed = React.memo(function WeatherDetailed({ weatherData, isLoading, cityName }: WeatherDetailedProps) {
    const { t } = useTranslation();
    const { theme: GenZTheme } = useTheme();
    const styles = React.useMemo(() => getStyles(GenZTheme), [GenZTheme]);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={GenZTheme.colors.primary} />
                <Text style={styles.loadingText}>{t('common.loading')}</Text>
            </View>
        );
    }

    if (!weatherData) {
        return (
            <View style={styles.loadingContainer}>
                <Ionicons name="cloud-offline-outline" size={48} color={GenZTheme.text.secondary} />
                <Text style={styles.loadingText}>{t('common.error')}</Text>
            </View>
        );
    }

    const { current, hourly, daily } = weatherData;
    const weatherInfo = getWeatherInfo(current.weatherCode, current.isDay);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
            {/* Hero Weather Section - Editorial Impact */}
            <View style={styles.heroSection}>
                <View style={styles.heroMain}>
                    <Text style={styles.heroTemp}>{Math.round(current.temperature)}°</Text>
                    <View style={styles.heroMeta}>
                        <Ionicons 
                            name={weatherInfo.icon as any} 
                            size={48} 
                            color={GenZTheme.colors.primary} 
                        />
                        <Text style={styles.conditionText}>{weatherInfo.description}</Text>
                        <Text style={styles.feelsLike}>{t('weather.feelsLike')} {Math.round(current.feelsLike)}°</Text>
                    </View>
                </View>

                {/* Statistics - Tonal Modules */}
                <View style={styles.statsStrip}>
                    <View style={styles.statModule}>
                        <Text style={styles.statLabel}>{t('weather.humidity')}</Text>
                        <Text style={styles.statValue}>{current.humidity}%</Text>
                    </View>
                    <View style={styles.statModule}>
                        <Text style={styles.statLabel}>{t('weather.wind')}</Text>
                        <Text style={styles.statValue}>{Math.round(current.windSpeed)} km/h</Text>
                    </View>
                    <View style={styles.statModule}>
                        <Text style={styles.statLabel}>{t('weather.uvIndex')}</Text>
                        <Text style={styles.statValue}>{Math.round(current.uvIndex)}</Text>
                    </View>
                </View>
            </View>

            {/* Sun Cycle Card - Glassmorphism fallback */}
            {daily[0] && (
                <View style={[styles.card, styles.sunCard]}>
                    <View style={styles.sunItem}>
                        <View style={[styles.sunIconBg, { backgroundColor: '#FED0B9' }]}>
                            <Ionicons name="sunny-outline" size={24} color="#7A5745" />
                        </View>
                        <View>
                            <Text style={styles.sunLabel}>{t('weather.sunrise')}</Text>
                            <Text style={styles.sunValue}>{daily[0].sunrise}</Text>
                        </View>
                    </View>
                    <View style={styles.sunItem}>
                        <View style={[styles.sunIconBg, { backgroundColor: '#D5E3FF' }]}>
                            <Ionicons name="moon-outline" size={24} color="#3B6095" />
                        </View>
                        <View>
                            <Text style={styles.sunLabel}>{t('weather.sunset')}</Text>
                            <Text style={styles.sunValue}>{daily[0].sunset}</Text>
                        </View>
                    </View>
                </View>
            )}

            {/* Hourly Forecast - Horizontal Editorial Row */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{t('weather.hourlyForecast')}</Text>
            </View>
            <FlatList
                data={hourly}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.hourlyScroll}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item: hour, index }) => {
                    const info = getWeatherInfo(hour.weatherCode, true);
                    const isNow = index === 0;
                    return (
                        <View style={[styles.hourlyItem, isNow && styles.hourlyItemActive]}>
                            <Text style={[styles.hourlyTime, isNow && styles.hourlyTimeActive]}>
                                {isNow ? t('weather.now') : hour.hour}
                            </Text>
                            <Ionicons 
                                name={info.icon as any} 
                                size={28} 
                                color={isNow ? GenZTheme.colors.primary : GenZTheme.text.secondary} 
                            />
                            <Text style={[styles.hourlyTemp, isNow && styles.hourlyTempActive]}>
                                {hour.temperature}°
                            </Text>
                        </View>
                    );
                }}
            />

            {/* Weekly Outlook - Editorial List */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{t('weather.sevenDayForecast')}</Text>
            </View>
            <View style={styles.weeklyCard}>
                {daily.map((day: any, index: number) => {
                    const info = getWeatherInfo(day.weatherCode, true);
                    return (
                        <View key={index} style={styles.dailyRow}>
                            <Text style={styles.dailyDay}>{index === 0 ? t('weather.today') : day.dayName}</Text>
                            <View style={styles.dailyInfo}>
                                <Ionicons name={info.icon as any} size={24} color={GenZTheme.colors.primary} />
                                <Text style={styles.dailyCondition}>{info.description}</Text>
                            </View>
                            <View style={styles.dailyTemps}>
                                <Text style={styles.dailyMax}>{day.tempMax}°</Text>
                                <Text style={styles.dailyMin}>{day.tempMin}°</Text>
                            </View>
                        </View>
                    );
                })}
            </View>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
});

const getStyles = (GenZTheme: ThemeType) => StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: 40,
    },
    loadingContainer: {
        paddingVertical: 100,
        alignItems: 'center',
    },
    loadingText: {
        fontFamily: GenZTheme.typography.body.fontFamily,
        color: GenZTheme.text.secondary,
        marginTop: 16,
    },
    heroSection: {
        paddingHorizontal: 24,
        paddingTop: 16,
        marginBottom: 32,
    },
    heroMain: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 40,
    },
    heroTemp: {
        fontFamily: GenZTheme.typography.display.fontFamily,
        fontSize: 100,
        color: GenZTheme.text.primary,
        letterSpacing: -6,
        lineHeight: 110,
    },
    heroMeta: {
        alignItems: 'flex-end',
    },
    conditionText: {
        fontFamily: GenZTheme.typography.headline.fontFamily,
        fontSize: 24,
        color: GenZTheme.text.primary,
        marginTop: 8,
    },
    feelsLike: {
        fontFamily: GenZTheme.typography.body.fontFamily,
        fontSize: 14,
        color: GenZTheme.text.secondary,
        marginTop: 4,
    },
    statsStrip: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: GenZTheme.cards.secondary,
        borderRadius: GenZTheme.borderRadius.xl,
        padding: 24,
    },
    statModule: {
        alignItems: 'center',
    },
    statLabel: {
        fontFamily: GenZTheme.typography.label.fontFamily,
        fontSize: 10,
        color: GenZTheme.text.secondary,
        textTransform: 'uppercase',
        marginBottom: 6,
    },
    statValue: {
        fontFamily: GenZTheme.typography.title.fontFamily,
        fontSize: 18,
        color: GenZTheme.text.primary,
    },
    card: {
        backgroundColor: GenZTheme.cards.background,
        marginHorizontal: 16,
        borderRadius: GenZTheme.borderRadius.xl,
        padding: 24,
        ...GenZTheme.cards.shadow,
    },
    sunCard: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 32,
    },
    sunItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    sunIconBg: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sunLabel: {
        fontFamily: GenZTheme.typography.label.fontFamily,
        fontSize: 10,
        color: GenZTheme.text.secondary,
    },
    sunValue: {
        fontFamily: GenZTheme.typography.title.fontFamily,
        fontSize: 18,
        color: GenZTheme.text.primary,
    },
    sectionHeader: {
        paddingHorizontal: 24,
        marginBottom: 16,
    },
    sectionTitle: {
        fontFamily: GenZTheme.typography.title.fontFamily,
        fontSize: 18,
        color: GenZTheme.text.primary,
    },
    hourlyScroll: {
        paddingLeft: 24,
        marginBottom: 40,
    },
    hourlyItem: {
        alignItems: 'center',
        marginRight: 16,
        padding: 16,
        borderRadius: GenZTheme.borderRadius.l,
        width: 80,
    },
    hourlyItemActive: {
        backgroundColor: GenZTheme.cards.background,
        ...GenZTheme.cards.shadow,
    },
    hourlyTime: {
        fontFamily: GenZTheme.typography.label.fontFamily,
        fontSize: 12,
        color: GenZTheme.text.secondary,
        marginBottom: 12,
    },
    hourlyTimeActive: {
        color: GenZTheme.colors.primary,
        fontWeight: '700',
    },
    hourlyTemp: {
        fontFamily: GenZTheme.typography.title.fontFamily,
        fontSize: 18,
        color: GenZTheme.text.primary,
        marginTop: 12,
    },
    hourlyTempActive: {
        color: GenZTheme.colors.primary,
    },
    weeklyCard: {
        backgroundColor: GenZTheme.cards.background,
        marginHorizontal: 16,
        borderRadius: GenZTheme.borderRadius.xl,
        padding: 16,
        ...GenZTheme.cards.shadow,
    },
    dailyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.03)',
    },
    dailyDay: {
        width: 60,
        fontFamily: GenZTheme.typography.title.fontFamily,
        fontSize: 14,
        color: GenZTheme.text.primary,
    },
    dailyInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    dailyCondition: {
        fontFamily: GenZTheme.typography.body.fontFamily,
        fontSize: 14,
        color: GenZTheme.text.secondary,
    },
    dailyTemps: {
        flexDirection: 'row',
        gap: 12,
    },
    dailyMax: {
        fontFamily: GenZTheme.typography.title.fontFamily,
        fontSize: 16,
        color: GenZTheme.text.primary,
        width: 30,
        textAlign: 'right',
    },
    dailyMin: {
        fontFamily: GenZTheme.typography.title.fontFamily,
        fontSize: 16,
        color: GenZTheme.text.secondary,
        width: 30,
        textAlign: 'right',
    },
});
