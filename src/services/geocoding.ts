/**
 * Geocoding service for city search suggestions
 */

import { WEATHER_API_BASE_URL, WEATHER_API_KEY } from '../constants/config';

export interface CitySuggestion {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

class GeocodingService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = 'https://api.openweathermap.org/geo/1.0';
    this.apiKey = WEATHER_API_KEY;
  }

  /**
   * Gets city suggestions based on search query
   */
  async getCitySuggestions(query: string, limit: number = 5): Promise<CitySuggestion[]> {
    if (!query.trim() || query.length < 2) {
      return [];
    }

    try {
      const url = `${this.baseUrl}/direct?q=${encodeURIComponent(query)}&limit=${limit}&appid=${this.apiKey}`;
      const response = await fetch(url);

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.map((item: any) => ({
        name: item.name,
        country: item.country,
        state: item.state,
        lat: item.lat,
        lon: item.lon,
      }));
    } catch (error) {
      console.error('Failed to fetch city suggestions:', error);
      return [];
    }
  }
}

export const geocodingService = new GeocodingService();
