
export interface GeocodingResult {
    lat: number;
    lon: number;
    name: string;
    display_name: string;
}

export const searchLocation = async (query: string): Promise<GeocodingResult[]> => {
    if (!query || query.length < 3) return [];

    try {
        // Nominatim OpenStreetMap Search API
        // User-Agent is required by their Usage Policy
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`;

        const response = await fetch(url, {
            headers: {
                'Accept-Language': 'en'
            }
        });

        if (!response.ok) {
            throw new Error('Geocoding failed');
        }

        const data = await response.json();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return data.map((item: any) => ({
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
            name: item.name || item.display_name.split(',')[0],
            display_name: item.display_name
        }));
    } catch (error) {
        console.error('Geocoding error:', error);
        return [];
    }
};
