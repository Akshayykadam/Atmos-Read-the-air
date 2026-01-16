// Major Indian cities for AQI lookup
export interface City {
    name: string;
    nameHi?: string; // Hindi name
    state: string;
    aqicnId: string; // ID used in AQICN API (legacy, now using coords for Open-Meteo)
    lat: number; // Latitude for Open-Meteo API
    lng: number; // Longitude for Open-Meteo API
}

export const INDIAN_CITIES: City[] = [
    // Metros
    { name: 'Delhi', nameHi: 'दिल्ली', state: 'Delhi', aqicnId: 'delhi', lat: 28.6139, lng: 77.2090 },
    { name: 'Mumbai', nameHi: 'मुंबई', state: 'Maharashtra', aqicnId: 'mumbai', lat: 19.0760, lng: 72.8777 },
    { name: 'Kolkata', nameHi: 'कोलकाता', state: 'West Bengal', aqicnId: 'kolkata', lat: 22.5726, lng: 88.3639 },
    { name: 'Chennai', nameHi: 'चेन्नई', state: 'Tamil Nadu', aqicnId: 'chennai', lat: 13.0827, lng: 80.2707 },
    { name: 'Bengaluru', nameHi: 'बेंगलुरु', state: 'Karnataka', aqicnId: 'bangalore', lat: 12.9716, lng: 77.5946 },
    { name: 'Hyderabad', nameHi: 'हैदराबाद', state: 'Telangana', aqicnId: 'hyderabad', lat: 17.3850, lng: 78.4867 },

    // Pune stations
    { name: 'Pune', nameHi: 'पुणे', state: 'Maharashtra', aqicnId: 'pune', lat: 18.5204, lng: 73.8567 },
    { name: 'Pune - Shivajinagar', nameHi: 'पुणे - शिवाजीनगर', state: 'Maharashtra', aqicnId: '@8699', lat: 18.5308, lng: 73.8475 },
    { name: 'Pune - Karve Road', nameHi: 'पुणे - कर्वे रोड', state: 'Maharashtra', aqicnId: '@8700', lat: 18.5018, lng: 73.8172 },
    { name: 'Pune - Pashan', nameHi: 'पुणे - पाषाण', state: 'Maharashtra', aqicnId: '@8701', lat: 18.5362, lng: 73.8032 },
    { name: 'Pune - Hadapsar', nameHi: 'पुणे - हडपसर', state: 'Maharashtra', aqicnId: '@8702', lat: 18.5089, lng: 73.9260 },
    { name: 'Ahmedabad', nameHi: 'अहमदाबाद', state: 'Gujarat', aqicnId: 'ahmedabad', lat: 23.0225, lng: 72.5714 },
    { name: 'Jaipur', nameHi: 'जयपुर', state: 'Rajasthan', aqicnId: 'jaipur', lat: 26.9124, lng: 75.7873 },
    { name: 'Lucknow', nameHi: 'लखनऊ', state: 'Uttar Pradesh', aqicnId: 'lucknow', lat: 26.8467, lng: 80.9461 },
    { name: 'Kanpur', nameHi: 'कानपुर', state: 'Uttar Pradesh', aqicnId: 'kanpur', lat: 26.4499, lng: 80.3319 },
    { name: 'Nagpur', nameHi: 'नागपुर', state: 'Maharashtra', aqicnId: 'nagpur', lat: 21.1458, lng: 79.0882 },
    { name: 'Indore', nameHi: 'इंदौर', state: 'Madhya Pradesh', aqicnId: 'indore', lat: 22.7196, lng: 75.8577 },
    { name: 'Thane', nameHi: 'ठाणे', state: 'Maharashtra', aqicnId: 'thane', lat: 19.2183, lng: 72.9781 },
    { name: 'Bhopal', nameHi: 'भोपाल', state: 'Madhya Pradesh', aqicnId: 'bhopal', lat: 23.2599, lng: 77.4126 },
    { name: 'Visakhapatnam', nameHi: 'विशाखापट्टनम', state: 'Andhra Pradesh', aqicnId: 'visakhapatnam', lat: 17.6868, lng: 83.2185 },
    { name: 'Patna', nameHi: 'पटना', state: 'Bihar', aqicnId: 'patna', lat: 25.5941, lng: 85.1376 },
    { name: 'Vadodara', nameHi: 'वडोदरा', state: 'Gujarat', aqicnId: 'vadodara', lat: 22.3072, lng: 73.1812 },
    { name: 'Ghaziabad', nameHi: 'गाज़ियाबाद', state: 'Uttar Pradesh', aqicnId: 'ghaziabad', lat: 28.6692, lng: 77.4538 },
    { name: 'Ludhiana', nameHi: 'लुधियाना', state: 'Punjab', aqicnId: 'ludhiana', lat: 30.9010, lng: 75.8573 },
    { name: 'Agra', nameHi: 'आगरा', state: 'Uttar Pradesh', aqicnId: 'agra', lat: 27.1767, lng: 78.0081 },
    { name: 'Nashik', nameHi: 'नाशिक', state: 'Maharashtra', aqicnId: 'nashik', lat: 19.9975, lng: 73.7898 },
    { name: 'Faridabad', nameHi: 'फरीदाबाद', state: 'Haryana', aqicnId: 'faridabad', lat: 28.4089, lng: 77.3178 },
    { name: 'Meerut', nameHi: 'मेरठ', state: 'Uttar Pradesh', aqicnId: 'meerut', lat: 28.9845, lng: 77.7064 },
    { name: 'Rajkot', nameHi: 'राजकोट', state: 'Gujarat', aqicnId: 'rajkot', lat: 22.3039, lng: 70.8022 },
    { name: 'Varanasi', nameHi: 'वाराणसी', state: 'Uttar Pradesh', aqicnId: 'varanasi', lat: 25.3176, lng: 82.9739 },
    { name: 'Srinagar', nameHi: 'श्रीनगर', state: 'Jammu & Kashmir', aqicnId: 'srinagar', lat: 34.0837, lng: 74.7973 },
    { name: 'Aurangabad', nameHi: 'औरंगाबाद', state: 'Maharashtra', aqicnId: 'aurangabad', lat: 19.8762, lng: 75.3433 },
    { name: 'Dhanbad', nameHi: 'धनबाद', state: 'Jharkhand', aqicnId: 'dhanbad', lat: 23.7957, lng: 86.4304 },
    { name: 'Amritsar', nameHi: 'अमृतसर', state: 'Punjab', aqicnId: 'amritsar', lat: 31.6340, lng: 74.8723 },
    { name: 'Noida', nameHi: 'नोएडा', state: 'Uttar Pradesh', aqicnId: 'noida', lat: 28.5355, lng: 77.3910 },
    { name: 'Gurugram', nameHi: 'गुरुग्राम', state: 'Haryana', aqicnId: 'gurugram', lat: 28.4595, lng: 77.0266 },
    { name: 'Chandigarh', nameHi: 'चंडीगढ़', state: 'Chandigarh', aqicnId: 'chandigarh', lat: 30.7333, lng: 76.7794 },
    { name: 'Coimbatore', nameHi: 'कोयंबटूर', state: 'Tamil Nadu', aqicnId: 'coimbatore', lat: 11.0168, lng: 76.9558 },
    { name: 'Madurai', nameHi: 'मदुरै', state: 'Tamil Nadu', aqicnId: 'madurai', lat: 9.9252, lng: 78.1198 },
    { name: 'Kochi', nameHi: 'कोच्चि', state: 'Kerala', aqicnId: 'kochi', lat: 9.9312, lng: 76.2673 },
    { name: 'Guwahati', nameHi: 'गुवाहाटी', state: 'Assam', aqicnId: 'guwahati', lat: 26.1445, lng: 91.7362 },
    { name: 'Thiruvananthapuram', nameHi: 'तिरुवनंतपुरम', state: 'Kerala', aqicnId: 'thiruvananthapuram', lat: 8.5241, lng: 76.9366 },
    { name: 'Ranchi', nameHi: 'रांची', state: 'Jharkhand', aqicnId: 'ranchi', lat: 23.3441, lng: 85.3096 },
    { name: 'Raipur', nameHi: 'रायपुर', state: 'Chhattisgarh', aqicnId: 'raipur', lat: 21.2514, lng: 81.6296 },
];

export function searchCities(query: string): City[] {
    const lowerQuery = query.toLowerCase();
    return INDIAN_CITIES.filter(
        (city) =>
            city.name.toLowerCase().includes(lowerQuery) ||
            city.state.toLowerCase().includes(lowerQuery) ||
            city.nameHi?.includes(query)
    ).slice(0, 10);
}
