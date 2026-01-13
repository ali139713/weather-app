/**
 * Main Weather Screen displaying current weather and forecast
 */

import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useWeather } from '../context/WeatherContext';
import {
  CurrentWeather,
  ForecastList,
  HourlyForecast,
  Loading,
  Error,
  SearchBar,
  Button,
} from '../components';
import { groupForecastByDay, getHourlyForecast } from '../utils';

export const WeatherScreen: React.FC = () => {
  const {
    currentWeather,
    forecast,
    loading,
    error,
    fetchCurrentLocationWeather,
    fetchWeatherByCity,
    refreshWeather,
    clearError,
  } = useWeather();

  useEffect(() => {
    if (!currentWeather) {
      fetchCurrentLocationWeather();
    }
  }, [currentWeather, fetchCurrentLocationWeather]);

  const handleSearch = async (cityName: string) => {
    await fetchWeatherByCity(cityName);
  };

  const handleRefresh = async () => {
    await refreshWeather();
  };

  const dailyForecasts = forecast ? groupForecastByDay(forecast.list) : [];
  const hourlyForecasts = forecast ? getHourlyForecast(forecast.list) : [];

  if (loading && !currentWeather) {
    return <Loading message="Loading weather data..." />;
  }

  if (error && !currentWeather) {
    return (
      <Error
        message={error}
        onRetry={() => {
          clearError();
          fetchCurrentLocationWeather();
        }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Weather Forecast</Text>
          <TouchableOpacity
            style={styles.locationButton}
            onPress={fetchCurrentLocationWeather}>
            <Text style={styles.locationButtonText}>📍 My Location</Text>
          </TouchableOpacity>
        </View>

        <SearchBar onSearch={handleSearch} />

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {currentWeather && <CurrentWeather weather={currentWeather} />}

        {hourlyForecasts.length > 0 && (
          <HourlyForecast hourlyData={hourlyForecasts} />
        )}

        {dailyForecasts.length > 0 && (
          <ForecastList forecasts={dailyForecasts} />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  locationButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  locationButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  errorContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
  },
});
