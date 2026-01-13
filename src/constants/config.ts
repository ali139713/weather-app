/**
 * Application configuration constants
 * 
 * IMPORTANT: Replace the WEATHER_API_KEY below with your OpenWeatherMap API key.
 * Get your free API key at: https://openweathermap.org/api
 */

export const WEATHER_API_BASE_URL = 'https://api.openweathermap.org/data/2.5';
// TODO: Replace with your OpenWeatherMap API key
export const WEATHER_API_KEY = 'YOUR_API_KEY_HERE';

export const STORAGE_KEYS = {
  CURRENT_WEATHER: '@weather_app:current_weather',
  FORECAST: '@weather_app:forecast',
  LOCATION: '@weather_app:location',
  CITY_NAME: '@weather_app:city_name',
  FAVORITE_CITIES: '@weather_app:favorite_cities',
  LAST_UPDATED: '@weather_app:last_updated',
} as const;

export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
