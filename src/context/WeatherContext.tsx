/**
 * Weather Context for global state management
 */

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import {
  WeatherState,
  CurrentWeather,
  ForecastResponse,
  Location,
} from '../types';
import { weatherApiService } from '../services/weatherApi';
import { geolocationService } from '../services/geolocation';
import { storageService } from '../services/storage';
import { CACHE_DURATION } from '../constants/config';

type WeatherAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CURRENT_WEATHER'; payload: CurrentWeather | null }
  | { type: 'SET_FORECAST'; payload: ForecastResponse | null }
  | { type: 'SET_LOCATION'; payload: Location | null }
  | { type: 'SET_CITY_NAME'; payload: string }
  | { type: 'SET_LAST_UPDATED'; payload: number };

interface WeatherContextType extends WeatherState {
  fetchWeatherByLocation: (location: Location) => Promise<void>;
  fetchWeatherByCity: (cityName: string) => Promise<void>;
  fetchCurrentLocationWeather: () => Promise<void>;
  refreshWeather: () => Promise<void>;
  clearError: () => void;
}

const initialState: WeatherState = {
  currentWeather: null,
  forecast: null,
  location: null,
  cityName: '',
  loading: false,
  error: null,
  lastUpdated: null,
};

const weatherReducer = (
  state: WeatherState,
  action: WeatherAction,
): WeatherState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_CURRENT_WEATHER':
      return { ...state, currentWeather: action.payload };
    case 'SET_FORECAST':
      return { ...state, forecast: action.payload };
    case 'SET_LOCATION':
      return { ...state, location: action.payload };
    case 'SET_CITY_NAME':
      return { ...state, cityName: action.payload };
    case 'SET_LAST_UPDATED':
      return { ...state, lastUpdated: action.payload };
    default:
      return state;
  }
};

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(weatherReducer, initialState);

  const fetchWeatherByLocation = useCallback(
    async (location: Location) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        const [currentWeather, forecast] = await Promise.all([
          weatherApiService.getCurrentWeather(
            location.latitude,
            location.longitude,
          ),
          weatherApiService.getForecast(location.latitude, location.longitude),
        ]);

        dispatch({ type: 'SET_CURRENT_WEATHER', payload: currentWeather });
        dispatch({ type: 'SET_FORECAST', payload: forecast });
        dispatch({ type: 'SET_LOCATION', payload: location });
        dispatch({ type: 'SET_CITY_NAME', payload: currentWeather.name });
        dispatch({ type: 'SET_LAST_UPDATED', payload: Date.now() });
        dispatch({ type: 'SET_LOADING', payload: false });

        await Promise.all([
          storageService.saveCurrentWeather(currentWeather),
          storageService.saveForecast(forecast),
          storageService.saveLocation(location),
          storageService.saveCityName(currentWeather.name),
          storageService.saveLastUpdated(Date.now()),
        ]);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to fetch weather';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [],
  );

  const fetchWeatherByCity = useCallback(async (cityName: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const [currentWeather, forecast] = await Promise.all([
        weatherApiService.getCurrentWeatherByCity(cityName),
        weatherApiService.getForecastByCity(cityName),
      ]);

      const location: Location = {
        latitude: currentWeather.coord.lat,
        longitude: currentWeather.coord.lon,
      };

      dispatch({ type: 'SET_CURRENT_WEATHER', payload: currentWeather });
      dispatch({ type: 'SET_FORECAST', payload: forecast });
      dispatch({ type: 'SET_LOCATION', payload: location });
      dispatch({ type: 'SET_CITY_NAME', payload: currentWeather.name });
      dispatch({ type: 'SET_LAST_UPDATED', payload: Date.now() });
      dispatch({ type: 'SET_LOADING', payload: false });

      await Promise.all([
        storageService.saveCurrentWeather(currentWeather),
        storageService.saveForecast(forecast),
        storageService.saveLocation(location),
        storageService.saveCityName(currentWeather.name),
        storageService.saveLastUpdated(Date.now()),
      ]);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch weather';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const fetchCurrentLocationWeather = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const location = await geolocationService.getCurrentLocation();
      await fetchWeatherByLocation(location);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to get location';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [fetchWeatherByLocation]);

  const refreshWeather = useCallback(async () => {
    if (state.cityName) {
      await fetchWeatherByCity(state.cityName);
    } else if (state.location) {
      await fetchWeatherByLocation(state.location);
    }
  }, [state.cityName, state.location, fetchWeatherByCity, fetchWeatherByLocation]);

  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  const loadCachedData = useCallback(async () => {
    try {
      const [
        cachedWeather,
        cachedForecast,
        cachedLocation,
        cachedCityName,
        lastUpdated,
      ] = await Promise.all([
        storageService.getCurrentWeather(),
        storageService.getForecast(),
        storageService.getLocation(),
        storageService.getCityName(),
        storageService.getLastUpdated(),
      ]);

      if (
        cachedWeather &&
        cachedForecast &&
        lastUpdated &&
        Date.now() - lastUpdated < CACHE_DURATION
      ) {
        dispatch({ type: 'SET_CURRENT_WEATHER', payload: cachedWeather });
        dispatch({ type: 'SET_FORECAST', payload: cachedForecast });
        dispatch({ type: 'SET_LOCATION', payload: cachedLocation });
        dispatch({ type: 'SET_CITY_NAME', payload: cachedCityName || '' });
        dispatch({ type: 'SET_LAST_UPDATED', payload: lastUpdated });
      }
    } catch (error) {
      console.error('Failed to load cached data:', error);
    }
  }, []);

  React.useEffect(() => {
    loadCachedData();
  }, [loadCachedData]);

  const value: WeatherContextType = {
    ...state,
    fetchWeatherByLocation,
    fetchWeatherByCity,
    fetchCurrentLocationWeather,
    refreshWeather,
    clearError,
  };

  return (
    <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
  );
};

export const useWeather = (): WeatherContextType => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};
