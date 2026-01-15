# 🌿 AirQuality - Real-time AQI & Weather Monitor

A beautiful, production-ready React Native application for monitoring real-time Air Quality Index (AQI) and Weather conditions. Built with **React Native (Expo)**, **OpenAQ**, **Open-Meteo**, and **Google Gemini AI**.

## ✨ Features

- **🌍 Real-time AQI Monitoring**: Get accurate Air Quality Index data from thousands of stations worldwide via OpenAQ.
- **📍 Location-Based**: Automatic detection of your current location to show relevant data using GPS.
- **🗺️ Interactive Station Map**: Visual map to explore air quality stations near you.
- **🌤️ Advanced Weather Forecast**: 
  - 7-Day Weather Trend
  - Detailed Hourly Forecast
  - ☀️ **UV Index Forecast** & 🌧️ Rain predictions
  - 🌡️ Temperature Trends Graph (High/Low)
- **🤖 AI Health Assistant**: Integrated **Gemini AI** chat to ask health advice based on current air quality ("Can I go for a run?", "Do I need a mask?").
- **📊 Data Visualization**: Beautiful, interactive charts for historical AQI trends, temperature, and UV index.
- **📱 Modern UI/UX**: clean, glassmorphism-inspired design with smooth animations and dark mode support.
- **🌐 Multi-language Support**: Fully localized interface.

## 🛠️ Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) / [Expo](https://expo.dev/)
- **Languages**: TypeScript
- **State Management**: React Hooks
- **Navigation**: Expo Router
- **UI Components**: 
  - `react-native-gifted-charts` for graphs
  - `expo-blur` for glass effects
  - `react-native-maps` for station mapping
- **APIs**:
  - [OpenAQ](https://openaq.org/) (Air Quality Data)
  - [Open-Meteo](https://open-meteo.com/) (Weather forecasts)
  - [Google Gemini](https://deepmind.google/technologies/gemini/) (AI Chat)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Expo Go app on your phone (or iOS Simulator / Android Emulator)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/AirQuality-App.git
   cd AirQuality-App
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `constants/config.ts` file or check `services/geminiApi.ts` to add your API keys if needed (OpenAQ and Open-Meteo are free, Gemini requires an API Key).

4. **Run the app**
   ```bash
   npx expo start
   ```

5. **Scan & Go**: Scan the QR code with your phone (using Expo Go) or press `i` for iOS Simulator / `a` for Android Emulator.

## 📸 Screenshots

*(Add your screenshots here)*

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
