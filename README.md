# 🌿 Atmos - Read the Air

A beautiful, production-ready React Native application for monitoring real-time Air Quality Index (AQI) and Weather conditions. Built with **React Native (Expo)**, **OpenAQ**, **Open-Meteo**, and **Google Gemini AI**.

> **📘 Technical Documentation**: For detailed architecture, API guide, and troubleshooting, please read [DOCUMENTATION.md](./DOCUMENTATION.md).

<p align="center">
  <img src="https://github.com/user-attachments/assets/56a7b9fc-c916-48b1-b8f1-8ff75b6a7f7a" width="18%" />
  <img src="https://github.com/user-attachments/assets/29ce993b-378a-4f99-99dd-67f51cc982bc" width="18%" />
  <img src="https://github.com/user-attachments/assets/7f2fbe04-dbba-40de-8644-6ae8d10003d4" width="18%" />
  <img src="https://github.com/user-attachments/assets/5bf0e2d7-218f-4418-b481-fcbec605a6b5" width="18%" />
  <img src="https://github.com/user-attachments/assets/79e42e65-4589-40ea-a7f0-a5e156000ad7" width="18%" />
</p>

## ✨ Features

- **🌍 Real-time AQI**: Live data from thousands of stations worldwide.
- **🌤️ Weather Integration**: 7-Day Forecasts, UV Index, and Rain predictions.
- **🤖 AI Health Assistant**: "Vayu" chatbot powered by **Google Gemini** for personalized advice.
- **📱 Modern Design**: Premium dark mode with glassmorphism UI.
- **🌐 Multilingual**: Supports English, Hindi, Marathi, Tamil, and Telugu.
- **🗺️ Maps**: Built-in OpenStreetMap with station markers.

## 🚀 Quick Start

### Prerequisites
-   Node.js (v18+)
-   Expo Go app (for testing)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/your-username/atmos-aqi.git
cd atmos-aqi

# 2. Install dependencies
npm install

# 3. Running the app
npx expo start
```

## 📦 Building APKs

**Debug APK** (For development):
```bash
cd android && ./gradlew assembleDebug
# Output: android/app/build/outputs/apk/debug/app-debug.apk
```

**Release APK** (For testing on device):
```bash
cd android && ./gradlew assembleRelease
# Output: android/app/build/outputs/apk/release/app-release.apk
```

> **Note**: The release APK is signed with a debug keystore for easy testing. For Play Store deployment, see the [deployment guide](./DOCUMENTATION.md#build--deployment).

## 🛠️ Tech Stack at a Glance

| Component | Tech |
| :--- | :--- |
| **Mobile Framework** | React Native + Expo |
| **Language** | TypeScript |
| **AI Engine** | Google Gemini (1.5 Flash) |
| **Data Sources** | WAQI, Open-Meteo, OpenStreetMap |
| **Styling** | Custom Design System (StyleSheet) |

## 📄 License

This project is licensed under the MIT License.
