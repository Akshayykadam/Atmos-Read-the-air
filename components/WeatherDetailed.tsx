import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart, BarChart } from 'react-native-gifted-charts';
import { GenZTheme } from '../constants/Theme';
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

// Weather-based gradient colors
const getWeatherGradient = (code: number, isDay: boolean): string[] => {
    if (code === 0 || code === 1) { // Clear
        return isDay ? ['#FFD93D', '#FF9500'] : ['#4BA9FF', '#1E3A5F'];
    }
    if (code === 2 || code === 3) { // Cloudy
        return ['#8E9AAF', '#5C677D'];
    }
    if (code >= 51 && code <= 67) { // Rain
        return ['#4BA9FF', '#3D5A80'];
    }
    if (code >= 71 && code <= 77) { // Snow
        return ['#E0E1DD', '#778DA9'];
    }
    if (code >= 95) { // Thunderstorm
        return ['#7B2CBF', '#3C096C'];
    }
    return isDay ? ['#87CEEB', '#4BA9FF'] : ['#2D3436', '#636E72'];
};

export function WeatherDetailed({ weatherData, isLoading, cityName }: WeatherDetailedProps) {

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={GenZTheme.colors.primary} />
                <Text style={styles.loadingText}>Loading weather...</Text>
            </View>
        );
    }

    if (!weatherData) {
        return (
            <View style={styles.loadingContainer}>
                <Ionicons name="cloud-offline" size={48} color={GenZTheme.text.secondary} />
                <Text style={styles.loadingText}>No weather data</Text>
            </View>
        );
    }

    const { current, hourly, daily } = weatherData;
    const weatherInfo = getWeatherInfo(current.weatherCode, current.isDay);
    const gradient = getWeatherGradient(current.weatherCode, current.isDay);

    return (
        <>
            {/* Hero Weather Card */}
            <View style={styles.heroContainer}>
                <LinearGradient
                    colors={[gradient[0], 'transparent']}
                    start={{ x: 0.5, y: 1 }}
                    end={{ x: 0.5, y: 0 }}
                    style={[StyleSheet.absoluteFill, { opacity: 0.25 }]}
                />
                <BlurView intensity={25} tint="dark" style={styles.heroGlass}>
                    {/* Top Row: Location + Weather Icon */}
                    <View style={styles.heroHeader}>
                        <View style={styles.liveIndicator}>
                            <View style={[styles.liveDot, { backgroundColor: gradient[0] }]} />
                            <Text style={styles.liveText}>Live Weather</Text>
                        </View>
                    </View>

                    {/* Main Temperature Display */}
                    <View style={styles.tempRow}>
                        <View>
                            <Text style={styles.heroTemp}>{Math.round(current.temperature)}°</Text>
                            <Text style={styles.feelsLike}>Feels like {Math.round(current.feelsLike)}°</Text>
                        </View>
                        <View style={styles.iconContainer}>
                            <Ionicons
                                name={weatherInfo.icon as any}
                                size={72}
                                color={current.isDay ? '#FFD93D' : '#4BA9FF'}
                            />
                        </View>
                    </View>

                    {/* Condition Badge */}
                    <View style={[styles.conditionBadge, { backgroundColor: gradient[0] + '30' }]}>
                        <Text style={[styles.conditionText, { color: gradient[0] }]}>
                            {weatherInfo.description}
                        </Text>
                    </View>

                    {/* Stats Grid */}
                    <View style={styles.statsGrid}>
                        <View style={styles.statItem}>
                            <Ionicons name="water" size={22} color="#4BA9FF" />
                            <Text style={styles.statValue}>{current.humidity}%</Text>
                            <Text style={styles.statLabel}>Humidity</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Ionicons name="navigate" size={22} color="#A8DADC" />
                            <Text style={styles.statValue}>{Math.round(current.windSpeed)} km/h</Text>
                            <Text style={styles.statLabel}>Wind</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Ionicons name="sunny" size={22} color="#FFD93D" />
                            <Text style={styles.statValue}>{Math.round(current.uvIndex)}</Text>
                            <Text style={styles.statLabel}>UV Index</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Ionicons name="eye" size={22} color="#E9ECEF" />
                            <Text style={styles.statValue}>{current.visibility.toFixed(0)} km</Text>
                            <Text style={styles.statLabel}>Visibility</Text>
                        </View>
                    </View>
                </BlurView>
            </View>

            {/* Sun Times Card */}
            {daily[0] && (
                <View style={styles.card}>
                    <BlurView intensity={20} tint="dark" style={styles.cardGlass}>
                        <View style={styles.sunTimesRow}>
                            <View style={styles.sunTimeItem}>
                                <LinearGradient
                                    colors={['#FFD93D', '#FF9500']}
                                    style={styles.sunIconBg}
                                >
                                    <Ionicons name="sunny" size={24} color="#fff" />
                                </LinearGradient>
                                <View>
                                    <Text style={styles.sunTimeLabel}>Sunrise</Text>
                                    <Text style={styles.sunTimeValue}>{daily[0].sunrise}</Text>
                                </View>
                            </View>
                            <View style={styles.sunTimeDivider} />
                            <View style={styles.sunTimeItem}>
                                <LinearGradient
                                    colors={['#4BA9FF', '#1E3A5F']}
                                    style={styles.sunIconBg}
                                >
                                    <Ionicons name="moon" size={24} color="#fff" />
                                </LinearGradient>
                                <View>
                                    <Text style={styles.sunTimeLabel}>Sunset</Text>
                                    <Text style={styles.sunTimeValue}>{daily[0].sunset}</Text>
                                </View>
                            </View>
                        </View>
                    </BlurView>
                </View>
            )}

            {/* Hourly Forecast */}
            {hourly.length > 0 && (
                <View style={styles.card}>
                    <BlurView intensity={20} tint="dark" style={styles.cardGlass}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="time-outline" size={18} color={GenZTheme.colors.primary} />
                            <Text style={styles.sectionTitle}>Hourly Forecast</Text>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={styles.hourlyContainer}>
                                {hourly.map((hour, index) => {
                                    const info = getWeatherInfo(hour.weatherCode, true);
                                    const isNow = index === 0;
                                    return (
                                        <View
                                            key={index}
                                            style={[
                                                styles.hourlyItem,
                                                isNow && styles.hourlyItemActive
                                            ]}
                                        >
                                            <Text style={[styles.hourlyTime, isNow && styles.hourlyTimeActive]}>
                                                {isNow ? 'Now' : hour.hour}
                                            </Text>
                                            <Ionicons
                                                name={info.icon as any}
                                                size={28}
                                                color={isNow ? '#FFD93D' : GenZTheme.text.primary}
                                            />
                                            <Text style={[styles.hourlyTemp, isNow && styles.hourlyTempActive]}>
                                                {hour.temperature}°
                                            </Text>
                                            {hour.precipitation > 0 && (
                                                <View style={styles.rainBadge}>
                                                    <Ionicons name="water" size={10} color="#4BA9FF" />
                                                    <Text style={styles.rainText}>{hour.precipitation}%</Text>
                                                </View>
                                            )}
                                        </View>
                                    );
                                })}
                            </View>
                        </ScrollView>
                    </BlurView>
                </View>
            )}

            {/* Temperature Trend Graph */}
            {daily.length > 0 && (
                <View style={styles.card}>
                    <BlurView intensity={20} tint="dark" style={styles.cardGlass}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="thermometer-outline" size={18} color="#FF6B6B" />
                            <Text style={styles.sectionTitle}>7-Day Temperature</Text>
                        </View>

                        {/* Min/Max Summary */}
                        <View style={styles.tempSummary}>
                            <View style={styles.tempSummaryItem}>
                                <Ionicons name="arrow-up" size={16} color="#FF6B6B" />
                                <Text style={styles.tempSummaryLabel}>Highest</Text>
                                <Text style={styles.tempSummaryValue}>
                                    {Math.max(...daily.map(d => d.tempMax))}°
                                </Text>
                            </View>
                            <View style={styles.tempSummaryDivider} />
                            <View style={styles.tempSummaryItem}>
                                <Ionicons name="arrow-down" size={16} color="#4BA9FF" />
                                <Text style={styles.tempSummaryLabel}>Lowest</Text>
                                <Text style={styles.tempSummaryValue}>
                                    {Math.min(...daily.map(d => d.tempMin))}°
                                </Text>
                            </View>
                        </View>

                        <View style={styles.graphContainer}>
                            <LineChart
                                data={daily.map(day => ({
                                    value: day.tempMax,
                                    label: day.dayName,
                                    labelTextStyle: { color: GenZTheme.text.secondary, fontSize: 10 },
                                }))}
                                data2={daily.map(day => ({
                                    value: day.tempMin,
                                }))}
                                height={120}
                                width={width - 110} // Reduced width to fit Y-axis
                                spacing={(width - 110) / daily.length}
                                initialSpacing={10}
                                color1="#FF6B6B"
                                color2="#4BA9FF"
                                thickness={3}
                                hideDataPoints={false}
                                dataPointsColor1="#FF6B6B"
                                dataPointsColor2="#4BA9FF"
                                dataPointsRadius={4}
                                curved
                                areaChart
                                startFillColor1="#FF6B6B"
                                endFillColor1="#FF6B6B"
                                startOpacity1={0.3}
                                endOpacity1={0.0}
                                startFillColor2="#4BA9FF"
                                endFillColor2="#4BA9FF"
                                startOpacity2={0.3}
                                endOpacity2={0.0}
                                hideRules={false}
                                rulesColor="rgba(255,255,255,0.05)"
                                yAxisColor="rgba(255,255,255,0.1)"
                                yAxisTextStyle={{ color: GenZTheme.text.secondary, fontSize: 10 }}
                                yAxisLabelWidth={35}
                                noOfSections={3}
                                xAxisColor="rgba(255,255,255,0.1)"
                                pointerConfig={{
                                    pointerStripHeight: 120,
                                    pointerStripColor: 'rgba(255,255,255,0.1)',
                                    pointerStripWidth: 2,
                                    pointerColor: 'rgba(255,255,255,0.3)',
                                    radius: 6,
                                    pointerLabelWidth: 100,
                                    pointerLabelHeight: 90,
                                    activatePointersOnLongPress: false,
                                    autoAdjustPointerLabelPosition: true,
                                    pointerLabelComponent: (items: any) => {
                                        const high = items[0]?.value;
                                        const low = items[1]?.value;
                                        return (
                                            <View
                                                style={{
                                                    height: 70,
                                                    width: 80,
                                                    justifyContent: 'center',
                                                    marginTop: -30,
                                                    marginLeft: -40,
                                                    backgroundColor: 'rgba(0,0,0,0.8)',
                                                    borderRadius: 8,
                                                    padding: 8,
                                                }}
                                            >
                                                <Text style={{ color: '#FF6B6B', fontSize: 12, fontWeight: 'bold' }}>
                                                    High: {high}°
                                                </Text>
                                                <Text style={{ color: '#4BA9FF', fontSize: 12, fontWeight: 'bold', marginTop: 4 }}>
                                                    Low: {low}°
                                                </Text>
                                            </View>
                                        );
                                    },
                                }}
                            />
                        </View>
                    </BlurView>
                </View>
            )}

            {/* UV Index Forecast */}
            {daily.length > 0 && (
                <View style={styles.card}>
                    <BlurView intensity={20} tint="dark" style={styles.cardGlass}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="sunny" size={18} color="#FFCC00" />
                            <Text style={styles.sectionTitle}>7-Day UV Index</Text>
                        </View>
                        <View style={[styles.graphContainer, { marginTop: 10 }]}>
                            <LineChart
                                data={daily.map(day => ({
                                    value: day.uvIndexMax,
                                    label: day.dayName,
                                    labelTextStyle: { color: GenZTheme.text.secondary, fontSize: 10 },
                                }))}
                                height={120}
                                width={width - 110}
                                spacing={(width - 110) / daily.length}
                                initialSpacing={10}
                                color="#FFCC00"
                                thickness={3}
                                hideDataPoints={false}
                                dataPointsColor="#FFCC00"
                                dataPointsRadius={4}
                                curved
                                areaChart
                                startFillColor="#FFCC00"
                                endFillColor="#FFCC00"
                                startOpacity={0.3}
                                endOpacity={0.0}
                                hideRules={false}
                                rulesColor="rgba(255,255,255,0.05)"
                                yAxisColor="rgba(255,255,255,0.1)"
                                yAxisTextStyle={{ color: GenZTheme.text.secondary, fontSize: 10 }}
                                yAxisLabelWidth={35}
                                noOfSections={5}
                                maxValue={10}
                                stepValue={2}
                                roundToDigits={0}
                                xAxisColor="rgba(255,255,255,0.1)"
                                pointerConfig={{
                                    pointerStripHeight: 120,
                                    pointerStripColor: 'rgba(255,255,255,0.1)',
                                    pointerStripWidth: 2,
                                    pointerColor: 'rgba(255,255,255,0.3)',
                                    radius: 6,
                                    pointerLabelWidth: 100,
                                    pointerLabelHeight: 90,
                                    activatePointersOnLongPress: false,
                                    autoAdjustPointerLabelPosition: true,
                                    pointerLabelComponent: (items: any) => {
                                        const uv = items[0]?.value;
                                        let color = '#4CD964';
                                        let level = 'Low';
                                        if (uv >= 3) { color = '#FFCC00'; level = 'Moderate'; }
                                        if (uv >= 6) { color = '#FF9500'; level = 'High'; }
                                        if (uv >= 8) { color = '#FF3B30'; level = 'Very High'; }
                                        if (uv >= 11) { color = '#AF52DE'; level = 'Extreme'; }

                                        return (
                                            <View
                                                style={{
                                                    height: 70,
                                                    width: 80,
                                                    justifyContent: 'center',
                                                    marginTop: -30,
                                                    marginLeft: -40,
                                                    backgroundColor: 'rgba(0,0,0,0.8)',
                                                    borderRadius: 8,
                                                    padding: 8,
                                                }}
                                            >
                                                <Text style={{ color: color, fontSize: 14, fontWeight: 'bold' }}>
                                                    UV: {uv?.toFixed(1)}
                                                </Text>
                                                <Text style={{ color: '#fff', fontSize: 12, marginTop: 4 }}>
                                                    {level}
                                                </Text>
                                            </View>
                                        );
                                    },
                                }}
                            />
                        </View>
                    </BlurView>
                </View>
            )}

            {/* 7-Day Forecast */}
            <View style={styles.card}>
                <BlurView intensity={20} tint="dark" style={styles.cardGlass}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="calendar-outline" size={18} color={GenZTheme.colors.primary} />
                        <Text style={styles.sectionTitle}>7-Day Forecast</Text>
                    </View>
                    {daily.map((day, index) => {
                        const info = getWeatherInfo(day.weatherCode, true);
                        const isToday = index === 0;
                        return (
                            <View key={index} style={[styles.dailyRow, isToday && styles.dailyRowToday]}>
                                <Text style={[styles.dailyDay, isToday && styles.dailyDayToday]}>
                                    {isToday ? 'Today' : day.dayName}
                                </Text>
                                <View style={styles.dailyWeather}>
                                    <Ionicons name={info.icon as any} size={24} color={GenZTheme.text.primary} />
                                    {day.precipitationSum > 0 && (
                                        <View style={styles.dailyRainBadge}>
                                            <Ionicons name="water" size={10} color="#4BA9FF" />
                                            <Text style={styles.dailyRainText}>
                                                {day.precipitationSum.toFixed(1)}mm
                                            </Text>
                                        </View>
                                    )}
                                </View>
                                <View style={styles.dailyTemps}>
                                    <Text style={styles.dailyMax}>{day.tempMax}°</Text>
                                    <View style={styles.tempBar}>
                                        <View
                                            style={[
                                                styles.tempBarFill,
                                                { width: `${((day.tempMax - day.tempMin) / 20) * 100}%` }
                                            ]}
                                        />
                                    </View>
                                    <Text style={styles.dailyMin}>{day.tempMin}°</Text>
                                </View>
                            </View>
                        );
                    })}
                </BlurView>
            </View>

            <View style={{ height: 20 }} />
        </>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 100,
    },
    loadingText: {
        color: GenZTheme.text.secondary,
        fontSize: 14,
        marginTop: 16,
    },
    // Hero Card
    heroContainer: {
        borderRadius: 28,
        overflow: 'hidden',
        marginHorizontal: 16,
        marginTop: 8,
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        backgroundColor: 'rgba(20, 20, 20, 0.5)',
    },
    heroGlass: {
        padding: 24,
    },
    heroHeader: {
        marginBottom: 16,
    },
    liveIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    liveDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    liveText: {
        fontSize: 12,
        fontWeight: '600',
        color: GenZTheme.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    tempRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    heroTemp: {
        fontSize: 80,
        fontWeight: '200',
        color: GenZTheme.text.primary,
        lineHeight: 85,
    },
    feelsLike: {
        fontSize: 14,
        color: GenZTheme.text.secondary,
        marginTop: 4,
    },
    iconContainer: {
        shadowColor: '#FFD93D',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
    },
    conditionBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginTop: 16,
    },
    conditionText: {
        fontSize: 14,
        fontWeight: '700',
    },
    statsGrid: {
        flexDirection: 'row',
        marginTop: 24,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statDivider: {
        width: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    statValue: {
        fontSize: 14,
        fontWeight: '700',
        color: GenZTheme.text.primary,
        marginTop: 8,
    },
    statLabel: {
        fontSize: 10,
        color: GenZTheme.text.secondary,
        marginTop: 2,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    // Cards
    card: {
        borderRadius: 24,
        overflow: 'hidden',
        marginHorizontal: 16,
        marginTop: 16,
        borderColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        backgroundColor: 'rgba(20, 20, 20, 0.4)',
    },
    cardGlass: {
        padding: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: GenZTheme.text.primary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    // Sun Times
    sunTimesRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sunTimeItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    sunIconBg: {
        width: 48,
        height: 48,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sunTimeLabel: {
        fontSize: 12,
        color: GenZTheme.text.secondary,
    },
    sunTimeValue: {
        fontSize: 18,
        fontWeight: '700',
        color: GenZTheme.text.primary,
        marginTop: 2,
    },
    sunTimeDivider: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginHorizontal: 16,
    },
    // Hourly
    hourlyContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    hourlyItem: {
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 16,
        minWidth: 60,
    },
    hourlyItemActive: {
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    hourlyTime: {
        fontSize: 12,
        color: GenZTheme.text.secondary,
        marginBottom: 10,
        fontWeight: '500',
    },
    hourlyTimeActive: {
        color: GenZTheme.colors.primary,
        fontWeight: '700',
    },
    hourlyTemp: {
        fontSize: 16,
        fontWeight: '600',
        color: GenZTheme.text.primary,
        marginTop: 10,
    },
    hourlyTempActive: {
        color: GenZTheme.colors.primary,
    },
    rainBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        marginTop: 6,
    },
    rainText: {
        fontSize: 10,
        color: '#4BA9FF',
    },
    // Daily
    dailyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    dailyRowToday: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        marginHorizontal: -20,
        paddingHorizontal: 20,
        borderRadius: 12,
    },
    dailyDay: {
        width: 50,
        fontSize: 14,
        fontWeight: '500',
        color: GenZTheme.text.secondary,
    },
    dailyDayToday: {
        color: GenZTheme.text.primary,
        fontWeight: '700',
    },
    dailyWeather: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    dailyRainBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        backgroundColor: 'rgba(75, 169, 255, 0.15)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    dailyRainText: {
        fontSize: 10,
        color: '#4BA9FF',
    },
    dailyTemps: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    dailyMax: {
        fontSize: 15,
        fontWeight: '700',
        color: GenZTheme.text.primary,
        width: 30,
        textAlign: 'right',
    },
    tempBar: {
        width: 50,
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 2,
    },
    tempBarFill: {
        height: '100%',
        backgroundColor: GenZTheme.colors.primary,
        borderRadius: 2,
    },
    dailyMin: {
        fontSize: 15,
        color: GenZTheme.text.secondary,
        width: 30,
    },
    // Graph styles
    graphContainer: {
        marginHorizontal: -10,
        marginTop: 8,
    },
    legendRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 24,
        marginTop: 16,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    legendText: {
        fontSize: 12,
        color: GenZTheme.text.secondary,
    },
    // Temperature summary styles
    tempSummary: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        paddingVertical: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
    },
    tempSummaryItem: {
        flex: 1,
        alignItems: 'center',
        gap: 4,
    },
    tempSummaryLabel: {
        fontSize: 11,
        color: GenZTheme.text.secondary,
        marginTop: 2,
    },
    tempSummaryValue: {
        fontSize: 22,
        fontWeight: '700',
        color: GenZTheme.text.primary,
    },
    tempSummaryDivider: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
});
