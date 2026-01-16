# 🌿 Atmos - Read the Air

A beautiful React Native application for monitoring real-time Air Quality Index (AQI) and Weather conditions. Built with **React Native (Expo)**, **OpenAQ**, **Open-Meteo**, and **Google Gemini AI**.

<p align="center">
  <img src="https://github.com/user-attachments/assets/56a7b9fc-c916-48b1-b8f1-8ff75b6a7f7a" width="15%" />
  <img src="https://github.com/user-attachments/assets/29ce993b-378a-4f99-99dd-67f51cc982bc" width="15%" />
  <img src="https://github.com/user-attachments/assets/7f2fbe04-dbba-40de-8644-6ae8d10003d4" width="15%" />
  <img src="https://github.com/user-attachments/assets/5bf0e2d7-218f-4418-b481-fcbec605a6b5" width="15%" />
  <img src="https://github.com/user-attachments/assets/79e42e65-4589-40ea-a7f0-a5e156000ad7" width="15%" />
  <img src="https://github.com/user-attachments/assets/b11fe895-0333-43fe-9819-9a2f6549a393" width="15%" />
</p>

## ✨ Features

- **🌍 Real-time AQI Monitoring**: Accurate Air Quality Index data from thousands of stations worldwide via OpenAQ.
- **📍 Location-Based**: Automatic GPS detection to show relevant local data.
- **🗺️ Interactive Station Map**: OpenStreetMap-powered dark mode map with AQI markers (no API key required!).
- **🌤️ Advanced Weather Forecast**: 
  - 7-Day Weather Trend with temperature graphs
  - Detailed Hourly Forecast
  - ☀️ UV Index Forecast & 🌧️ Rain predictions
- **🤖 AI Health Assistant**: Integrated **Gemini AI** chat for personalized health advice.
- **📊 Data Visualization**: Interactive charts for AQI trends, temperature, and UV index.
- **📱 Modern UI/UX**: Glassmorphism design with dark mode support.
- **🌐 Multi-language Support**: English, Hindi, Marathi, Tamil, Telugu.

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React Native / Expo |
| **Language** | TypeScript |
| **Maps** | OpenStreetMap + Leaflet.js (via WebView) |
| **Charts** | react-native-gifted-charts |
| **AI** | Google Gemini API |

### APIs Used (All Free!)
- [OpenAQ](https://openaq.org/) - Air Quality Data
- [Open-Meteo](https://open-meteo.com/) - Weather Forecasts
- [OpenStreetMap](https://www.openstreetmap.org/) - Map Tiles (CartoDB Dark)
- [Google Gemini](https://deepmind.google/technologies/gemini/) - AI Chat (requires API key)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Expo Go app (or Android Emulator)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/atmos-aqi.git
cd atmos-aqi

# Install dependencies
npm install

# Run the app
npx expo start
```

### Building Release APK

```bash
# Generate native Android project
npx expo prebuild --platform android

# Build optimized APK (arm64-only for modern phones)
cd android && ./gradlew assembleRelease
```

The APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

> **Note**: The release APK is optimized for modern phones (Pixel 8/9, arm64-v8a) and won't work on older 32-bit devices.

## 📁 Project Structure

```
├── app/                 # Expo Router screens
├── components/          # Reusable UI components
├── services/            # API services (AQI, Weather, Gemini)
├── constants/           # Theme, config, translations
└── assets/              # Images and icons
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

