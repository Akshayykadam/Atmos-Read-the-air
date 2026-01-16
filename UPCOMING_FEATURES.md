# 🚀 Upcoming Features & Roadmap

Here are the planned enhancements for **Atmos**, focusing on leveraging our existing **Gemini AI**, **OpenMeteo**, and **OpenAQ** integrations.

## ⚡ Quick Wins (High Impact, Low Effort)

### 1. Smart Activity Planner (Forecast Integration)
*   **Goal**: Move beyond "current status" to "future planning".
*   **User Value**: Answers "Can I go for a run this evening?"
*   **Implementation**:
    - Pass the existing `forecast` data (PM2.5 hourly trends) to the Gemini prompt.
    - AI analyzes the trend and suggests the optimal time window.

### 2. Weather-Aware Health Advice
*   **Goal**: Contextualize air quality with weather conditions.
*   **User Value**: "It's raining/hot, is the pollution dangerous?"
*   **Implementation**:
    - Pass `weatherData` (Temp, Humidity, Rain) to Gemini.
    - AI combines Heat + Pollution data for better advice (e.g., heatstroke risks + lung irritation).

### 3. "Vayu" Persona Integration
*   **Goal**: Align the AI personality with the app's "Vayu" branding.
*   **User Value**: A more engaging, witty, and fun interaction style (Gen Z voice).
*   **Implementation**:
    - Update the Gemini System Prompt: *"You are Vayu, a witty air quality companion..."*

### 4. Interactive Pollutant Education
*   **Goal**: Explain *why* the air is bad.
*   **User Value**: "What is NO2?" -> "It comes from traffic."
*   **Implementation**:
    - existing Chat UI can already handle these questions; just better prompting.

---

## 🌟 Advanced Features (Medium Effort)

### 5. Dynamic "Atmos" Status Bar
*   **Goal**: A dynamic, always-fresh 1-liner on the Home Screen.
*   **Example**: _"The air is calm, but Vayu is eyeing that PM2.5 spike..."_
*   **Implementation**:
    - A specific API call on app load to generate a creative status message based on current data.

### 6. 24h Trend Analysis
*   **Goal**: Explain the past to reassure the user.
*   **Example**: _"Pollution spiked at 2 AM but has dropped 40% since sunrise."_
*   **Implementation**:
    - Feed the `HistoryGraph` data (last 24h) to Gemini for analysis.

### 7. Location Comparison
*   **Goal**: Compare two cities.
*   **Example**: _"Is Hyderabad better than Mumbai right now?"_
*   **Implementation**:
    - Fetch AQI for a second location and ask Gemini to compare them.
