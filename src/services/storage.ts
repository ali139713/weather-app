/**
 * Storage service for caching weather data locally
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { CurrentWeather, ForecastResponse, Location } from '../types';
import { STORAGE_KEYS } from '../constants/config';

class StorageService {
  /**
   * Saves current weather data to storage
   */
  async saveCurrentWeather(weather: CurrentWeather): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.CURRENT_WEATHER,
        JSON.stringify(weather),
      );
    } catch (error) {
      console.error('Failed to save current weather:', error);
    }
  }

  /**
   * Retrieves cached current weather data
   */
  async getCurrentWeather(): Promise<CurrentWeather | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_WEATHER);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get current weather:', error);
      return null;
    }
  }

  /**
   * Saves forecast data to storage
   */
  async saveForecast(forecast: ForecastResponse): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.FORECAST,
        JSON.stringify(forecast),
      );
    } catch (error) {
      console.error('Failed to save forecast:', error);
    }
  }

  /**
   * Retrieves cached forecast data
   */
  async getForecast(): Promise<ForecastResponse | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.FORECAST);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get forecast:', error);
      return null;
    }
  }

  /**
   * Saves location data to storage
   */
  async saveLocation(location: Location): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.LOCATION,
        JSON.stringify(location),
      );
    } catch (error) {
      console.error('Failed to save location:', error);
    }
  }

  /**
   * Retrieves cached location data
   */
  async getLocation(): Promise<Location | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.LOCATION);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get location:', error);
      return null;
    }
  }

  /**
   * Saves city name to storage
   */
  async saveCityName(cityName: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CITY_NAME, cityName);
    } catch (error) {
      console.error('Failed to save city name:', error);
    }
  }

  /**
   * Retrieves cached city name
   */
  async getCityName(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.CITY_NAME);
    } catch (error) {
      console.error('Failed to get city name:', error);
      return null;
    }
  }

  /**
   * Saves last updated timestamp
   */
  async saveLastUpdated(timestamp: number): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.LAST_UPDATED,
        timestamp.toString(),
      );
    } catch (error) {
      console.error('Failed to save last updated:', error);
    }
  }

  /**
   * Retrieves last updated timestamp
   */
  async getLastUpdated(): Promise<number | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.LAST_UPDATED);
      return data ? parseInt(data, 10) : null;
    } catch (error) {
      console.error('Failed to get last updated:', error);
      return null;
    }
  }

  /**
   * Saves favorite cities list
   */
  async saveFavoriteCities(cities: string[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.FAVORITE_CITIES,
        JSON.stringify(cities),
      );
    } catch (error) {
      console.error('Failed to save favorite cities:', error);
    }
  }

  /**
   * Retrieves favorite cities list
   */
  async getFavoriteCities(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITE_CITIES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get favorite cities:', error);
      return [];
    }
  }

  /**
   * Clears all cached weather data
   */
  async clearCache(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.CURRENT_WEATHER,
        STORAGE_KEYS.FORECAST,
        STORAGE_KEYS.LOCATION,
        STORAGE_KEYS.CITY_NAME,
        STORAGE_KEYS.LAST_UPDATED,
      ]);
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }
}

export const storageService = new StorageService();
