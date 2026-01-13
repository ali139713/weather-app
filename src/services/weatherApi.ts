/**
 * Weather API service for fetching weather data from OpenWeatherMap
 */

import { CurrentWeather, ForecastResponse } from '../types';
import { WEATHER_API_BASE_URL, WEATHER_API_KEY } from '../constants/config';
import { getErrorMessage } from '../utils/errorUtils';

class WeatherApiService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = WEATHER_API_BASE_URL;
    this.apiKey = WEATHER_API_KEY;
  }

  /**
   * Fetches current weather data for a given location
   */
  async getCurrentWeather(
    lat: number,
    lon: number,
  ): Promise<CurrentWeather> {
    try {
      const url = `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `HTTP error! status: ${response.status}`,
        }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to weather service');
      }
      throw error;
    }
  }

  /**
   * Fetches current weather data for a city by name
   */
  async getCurrentWeatherByCity(cityName: string): Promise<CurrentWeather> {
    try {
      const url = `${this.baseUrl}/weather?q=${encodeURIComponent(cityName)}&appid=${this.apiKey}&units=metric`;
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `HTTP error! status: ${response.status}`,
        }));
        
        if (response.status === 404) {
          throw new Error(`City "${cityName}" not found. Please check the spelling and try again.`);
        }
        
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to weather service');
      }
      throw error;
    }
  }

  /**
   * Fetches 5-day weather forecast for a given location
   */
  async getForecast(lat: number, lon: number): Promise<ForecastResponse> {
    try {
      const url = `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `HTTP error! status: ${response.status}`,
        }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to weather service');
      }
      throw error;
    }
  }

  /**
   * Fetches 5-day weather forecast for a city by name
   */
  async getForecastByCity(cityName: string): Promise<ForecastResponse> {
    try {
      const url = `${this.baseUrl}/forecast?q=${encodeURIComponent(cityName)}&appid=${this.apiKey}&units=metric`;
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `HTTP error! status: ${response.status}`,
        }));
        
        if (response.status === 404) {
          throw new Error(`City "${cityName}" not found. Please check the spelling and try again.`);
        }
        
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to weather service');
      }
      throw error;
    }
  }
}

export const weatherApiService = new WeatherApiService();
