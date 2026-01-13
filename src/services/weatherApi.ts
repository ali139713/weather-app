/**
 * Weather API service for fetching weather data from OpenWeatherMap
 */

import { CurrentWeather, ForecastResponse } from '../types';
import { WEATHER_API_BASE_URL, WEATHER_API_KEY } from '../constants/config';

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
    const url = `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'Failed to fetch weather data',
      }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Fetches current weather data for a city by name
   */
  async getCurrentWeatherByCity(cityName: string): Promise<CurrentWeather> {
    const url = `${this.baseUrl}/weather?q=${encodeURIComponent(cityName)}&appid=${this.apiKey}&units=metric`;
    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'Failed to fetch weather data',
      }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Fetches 5-day weather forecast for a given location
   */
  async getForecast(lat: number, lon: number): Promise<ForecastResponse> {
    const url = `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'Failed to fetch forecast data',
      }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Fetches 5-day weather forecast for a city by name
   */
  async getForecastByCity(cityName: string): Promise<ForecastResponse> {
    const url = `${this.baseUrl}/forecast?q=${encodeURIComponent(cityName)}&appid=${this.apiKey}&units=metric`;
    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'Failed to fetch forecast data',
      }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

export const weatherApiService = new WeatherApiService();
