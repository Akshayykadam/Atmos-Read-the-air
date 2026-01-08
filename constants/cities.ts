// Major Indian cities for AQI lookup
export interface City {
    name: string;
    nameHi?: string; // Hindi name
    state: string;
    aqicnId: string; // ID used in AQICN API
}

export const INDIAN_CITIES: City[] = [
    // Metros
    { name: 'Delhi', nameHi: 'दिल्ली', state: 'Delhi', aqicnId: 'delhi' },
    { name: 'Mumbai', nameHi: 'मुंबई', state: 'Maharashtra', aqicnId: 'mumbai' },
    { name: 'Kolkata', nameHi: 'कोलकाता', state: 'West Bengal', aqicnId: 'kolkata' },
    { name: 'Chennai', nameHi: 'चेन्नई', state: 'Tamil Nadu', aqicnId: 'chennai' },
    { name: 'Bengaluru', nameHi: 'बेंगलुरु', state: 'Karnataka', aqicnId: 'bangalore' },
    { name: 'Hyderabad', nameHi: 'हैदराबाद', state: 'Telangana', aqicnId: 'hyderabad' },

    // Major Cities
    { name: 'Pune', nameHi: 'पुणे', state: 'Maharashtra', aqicnId: 'pune' },
    { name: 'Ahmedabad', nameHi: 'अहमदाबाद', state: 'Gujarat', aqicnId: 'ahmedabad' },
    { name: 'Jaipur', nameHi: 'जयपुर', state: 'Rajasthan', aqicnId: 'jaipur' },
    { name: 'Lucknow', nameHi: 'लखनऊ', state: 'Uttar Pradesh', aqicnId: 'lucknow' },
    { name: 'Kanpur', nameHi: 'कानपुर', state: 'Uttar Pradesh', aqicnId: 'kanpur' },
    { name: 'Nagpur', nameHi: 'नागपुर', state: 'Maharashtra', aqicnId: 'nagpur' },
    { name: 'Indore', nameHi: 'इंदौर', state: 'Madhya Pradesh', aqicnId: 'indore' },
    { name: 'Thane', nameHi: 'ठाणे', state: 'Maharashtra', aqicnId: 'thane' },
    { name: 'Bhopal', nameHi: 'भोपाल', state: 'Madhya Pradesh', aqicnId: 'bhopal' },
    { name: 'Visakhapatnam', nameHi: 'विशाखापट्टनम', state: 'Andhra Pradesh', aqicnId: 'visakhapatnam' },
    { name: 'Patna', nameHi: 'पटना', state: 'Bihar', aqicnId: 'patna' },
    { name: 'Vadodara', nameHi: 'वडोदरा', state: 'Gujarat', aqicnId: 'vadodara' },
    { name: 'Ghaziabad', nameHi: 'गाज़ियाबाद', state: 'Uttar Pradesh', aqicnId: 'ghaziabad' },
    { name: 'Ludhiana', nameHi: 'लुधियाना', state: 'Punjab', aqicnId: 'ludhiana' },
    { name: 'Agra', nameHi: 'आगरा', state: 'Uttar Pradesh', aqicnId: 'agra' },
    { name: 'Nashik', nameHi: 'नाशिक', state: 'Maharashtra', aqicnId: 'nashik' },
    { name: 'Faridabad', nameHi: 'फरीदाबाद', state: 'Haryana', aqicnId: 'faridabad' },
    { name: 'Meerut', nameHi: 'मेरठ', state: 'Uttar Pradesh', aqicnId: 'meerut' },
    { name: 'Rajkot', nameHi: 'राजकोट', state: 'Gujarat', aqicnId: 'rajkot' },
    { name: 'Varanasi', nameHi: 'वाराणसी', state: 'Uttar Pradesh', aqicnId: 'varanasi' },
    { name: 'Srinagar', nameHi: 'श्रीनगर', state: 'Jammu & Kashmir', aqicnId: 'srinagar' },
    { name: 'Aurangabad', nameHi: 'औरंगाबाद', state: 'Maharashtra', aqicnId: 'aurangabad' },
    { name: 'Dhanbad', nameHi: 'धनबाद', state: 'Jharkhand', aqicnId: 'dhanbad' },
    { name: 'Amritsar', nameHi: 'अमृतसर', state: 'Punjab', aqicnId: 'amritsar' },
    { name: 'Noida', nameHi: 'नोएडा', state: 'Uttar Pradesh', aqicnId: 'noida' },
    { name: 'Gurugram', nameHi: 'गुरुग्राम', state: 'Haryana', aqicnId: 'gurugram' },
    { name: 'Chandigarh', nameHi: 'चंडीगढ़', state: 'Chandigarh', aqicnId: 'chandigarh' },
    { name: 'Coimbatore', nameHi: 'कोयंबटूर', state: 'Tamil Nadu', aqicnId: 'coimbatore' },
    { name: 'Madurai', nameHi: 'मदुरै', state: 'Tamil Nadu', aqicnId: 'madurai' },
    { name: 'Kochi', nameHi: 'कोच्चि', state: 'Kerala', aqicnId: 'kochi' },
    { name: 'Guwahati', nameHi: 'गुवाहाटी', state: 'Assam', aqicnId: 'guwahati' },
    { name: 'Thiruvananthapuram', nameHi: 'तिरुवनंतपुरम', state: 'Kerala', aqicnId: 'thiruvananthapuram' },
    { name: 'Ranchi', nameHi: 'रांची', state: 'Jharkhand', aqicnId: 'ranchi' },
    { name: 'Raipur', nameHi: 'रायपुर', state: 'Chhattisgarh', aqicnId: 'raipur' },
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
