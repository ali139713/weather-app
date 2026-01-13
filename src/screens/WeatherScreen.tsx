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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWeather } from '../context/WeatherContext';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../hooks/useFavorites';
import {
  CurrentWeather,
  ForecastList,
  HourlyForecast,
  Loading,
  Error,
  SearchBar,
  FavoriteButton,
  FavoritesList,
} from '../components';
import { groupForecastByDay, getHourlyForecast } from '../utils';

export const WeatherScreen: React.FC = () => {
  const theme = useTheme();
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
  const { favorites, addFavorite, removeFavorite, isFavorite } =
    useFavorites();

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

  const handleToggleFavorite = () => {
    if (currentWeather) {
      if (isFavorite(currentWeather.name)) {
        removeFavorite(currentWeather.name);
      } else {
        addFavorite(currentWeather.name);
      }
    }
  };

  const handleSelectFavorite = async (cityName: string) => {
    await fetchWeatherByCity(cityName);
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
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            Weather Forecast
          </Text>
          <View style={styles.headerActions}>
            {currentWeather && (
              <FavoriteButton
                isFavorite={isFavorite(currentWeather.name)}
                onPress={handleToggleFavorite}
              />
            )}
            <TouchableOpacity
              style={[styles.locationButton, { backgroundColor: theme.colors.primary }]}
              onPress={fetchCurrentLocationWeather}>
              <Text style={styles.locationButtonText}>📍 My Location</Text>
            </TouchableOpacity>
          </View>
        </View>

        <FavoritesList
          favorites={favorites}
          onSelectCity={handleSelectFavorite}
          onRemoveFavorite={removeFavorite}
        />

        <SearchBar onSearch={handleSearch} />

        {error && (
          <View style={[styles.errorContainer, { backgroundColor: theme.colors.error + '20' }]}>
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {error}
            </Text>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
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
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
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
    borderRadius: 8,
  },
  errorText: {
    fontSize: 14,
  },
});
