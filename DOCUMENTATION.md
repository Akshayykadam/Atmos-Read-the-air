# 📘 Atmos - Official Documentation

This document provides a comprehensive technical overview of the Atmos Air Quality & Weather application.

## 🌟 Project Overview

**Atmos** is a React Native application built with Expo that provides real-time air quality data, advanced weather forecasts, and AI-powered health advice. It is designed to be a "Super App" for environmental monitoring, specifically tailored for Indian users with multilingual support.

### Key Features
1.  **Hyper-Local AQI**: Real-time Air Quality Index from thousands of stations via OpenAQ.
2.  **Advanced Weather**: 7-day temperature trends, UV index, and hourly forecasts via Open-Meteo.
3.  **Interactive Maps**: Dark-mode OpenStreetMap integration with station markers.
4.  **AI Assistant**: "Vayu" AI chatbot (powered by Google Gemini) for personalized health tips.
5.  **Multilingual**: Full support for English, Hindi, Marathi, Tamil, and Telugu.
6.  **Dark Mode First**: A premium, OLED-friendly dark UI with glassmorphism effects.

---

## 🏗️ Architecture & Tech Stack

### Frameworks
-   **React Native**: Core framework for cross-platform mobile development.
-   **Expo**: Toolchain for rapid development, building, and OTA updates.
-   **TypeScript**: Statically typed JavaScript for type safety and maintainability.

### Key Libraries
-   **Navigation**: `expo-router` (File-based routing similar to Next.js).
-   **Styling**: `StyleSheet` with a custom `GenZTheme` design system.
-   **State Management**: React Context & Hooks (`useState`, `useEffect`, `useContext`).
-   **Charts**: `react-native-gifted-charts` for smooth, interactive graphs.
-   **Maps**: `react-native-webview` rendering Leaflet.js (standard OSM tiles).
-   **Localization**: `react-i18next` for managing translations.

### Directory Structure
```
AQI_APP/
├── app/                  # Application screens (Expo Router)
│   ├── index.tsx         # Home Dashboard
│   ├── search.tsx        # City Search
│   ├── chat.tsx          # AI Chat Interface
│   └── _layout.tsx       # Root Layout & Navigation
├── components/           # Reusable UI Components
│   ├── AQICard.tsx       # Main AQI Display
│   ├── WeatherDetailed.tsx # Weather & Forecasts
│   ├── PollutantGrid.tsx # Grid of pollutants (PM2.5, etc)
│   ├── HistoryGraph.tsx  # 24h Trend Chart
│   └── ...
├── services/             # API Integration Layer
│   ├── aqiApi.ts         # OpenAQ & AQICN interfaces
│   ├── weatherApi.ts     # Open-Meteo interface
│   ├── geminiApi.ts      # Google Gemini AI interface
│   └── locationService.ts # GPS & Permissions
├── locales/              # Translation files (en, hi, mr, ta, te)
├── constants/            # Config, Theme, and API keys
└── assets/               # Static images and icons
```

---

## 🔌 API Integration

### 1. Air Quality (OpenAQ & WAQI)
-   **Primary Source**: [WAQI API](https://aqicn.org/api/) (World Air Quality Index project).
-   **Endpoints**:
    -   `feed/@{uid}/`: Fetches real-time data for a specific station.
    -   `map/bounds/`: Fetches all stations within a geographic bounding box.
-   **Data Points**: PM2.5, PM10, O3, NO2, SO2, CO.

### 2. Weather (Open-Meteo)
-   **Source**: [Open-Meteo](https://open-meteo.com/).
-   **Features**: No API key required, high-precision hourly data.
-   **Endpoints**: `v1/forecast` with parameters for `temperature_2m`, `relative_humidity_2m`, `uv_index`, `precipitation_probability`.

### 3. AI Chat (Google Gemini)
-   **Model**: Gemini 1.5 Flash (optimized for latency/cost).
-   **Integration**: `GoogleGenerativeAI` SDK.
-   **Function**: Context-aware chat. The app sends the current AQI and pollutant levels as "system context" so the AI gives relevant advice (e.g., "The AQI is 150, wear a mask").

---

## 🌍 Localization (i18n)

The app supports 5 languages using `i18next`.

-   **Files**: `locales/en.json`, `hi.json`, `mr.json`, etc.
-   **Setup**: `services/i18n.ts` initializes the instance.
-   **Usage**: 
    ```typescript
    const { t } = useTranslation();
    <Text>{t('dashboard.title')}</Text>
    ```
-   **Adding a Language**: Add the JSON file in `locales/` and import it in `i18n.ts`.

---

## 📲 Build & Deployment

### Development
1.  **Install dependencies**: `npm install`
2.  **Start Metro Bundler**: `npx expo start`
3.  **Run on Device**: Scan the QR code with Expo Go (Android/iOS).

### Building Production APK (Android)
The project is configured for **EAS Build** or local Gradle builds.

**Method A: Local Build (Recommended for Debugging)**
```bash
cd android
./gradlew assembleRelease
```
*Output*: `android/app/build/outputs/apk/release/app-release.apk`

**Method B: EAS Build (Cloud)**
```bash
npm install -g eas-cli
eas build -p android --profile production
```

### Signing (Important)
-   **Debug Builds**: Automatically signed with a debug keystore.
-   **Release Builds**: 
    -   Currently configured to use the **debug keystore** for testing ease.
    -   **For Play Store**: You MUST generate a proper upload keystore and update `android/app/build.gradle` signing configs.

---

## 🔧 Troubleshooting

### 1. "No Data Available" on First Launch
-   **Cause**: Location permission might have timed out.
-   **Fix**: The app now has a 60s timeout window. Ensure GPS is enabled on your device.

### 2. Build Failures
-   *`React Native version mismatch`*: Run `npx expo install --fix`.
-   *`Gradle build failed`*: Try cleaning the build folder:
    ```bash
    cd android
    ./gradlew clean
    ./gradlew assembleDebug
    ```

### 3. Metro Bundler Issues
-   Clear cache: `npx expo start -c`

---

## 📜 Credits
-   **UI Design**: Inspired by glassmorphism and modern iOS weather apps.
-   **Data Providers**: OpenAQ, Open-Meteo, OpenStreetMap contributors.
