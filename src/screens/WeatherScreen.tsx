/**
 * Main Weather Screen displaying current weather and forecast
 */

import React, { useEffect, useState, useCallback, useRef } from 'react';
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
  ThemeToggle,
  CitySuggestions,
} from '../components';
import { groupForecastByDay, getHourlyForecast } from '../utils';
import { CitySuggestion } from '../services/geocoding';

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
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchBarLayout, setSearchBarLayout] = useState<{ y: number; x: number; width: number; height: number } | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

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

  const searchBarRef = useRef<View>(null);

  const handleSearchBarLayout = useCallback((event: any) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setSearchBarLayout({ x, y, width, height });
  }, []);

  const handleSuggestionsChange = useCallback((suggestionsList: CitySuggestion[], isLoading: boolean, visible: boolean) => {
    setSuggestions(suggestionsList);
    setSuggestionsLoading(isLoading);
    setShowSuggestions(visible);
  }, []);

  const handleSelectSuggestion = useCallback(async (city: CitySuggestion) => {
    await fetchWeatherByCity(city.name);
    setSuggestions([]);
    setShowSuggestions(false);
  }, [fetchWeatherByCity]);

  const dailyForecasts = forecast ? groupForecastByDay(forecast.list) : [];
  const hourlyForecasts = forecast ? getHourlyForecast(forecast.list) : [];

  // Show loading if we don't have weather data yet (either loading or waiting for initial load)
  if (!currentWeather) {
    if (error) {
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
    return <Loading message="Loading weather data..." />;
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top', 'left', 'right']}>
      <ScrollView
        ref={scrollViewRef}
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
            <ThemeToggle />
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

        <SearchBar
          ref={searchBarRef}
          onSearch={handleSearch}
          onLayout={handleSearchBarLayout}
          onSuggestionsChange={handleSuggestionsChange}
        />

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
      {showSuggestions && (suggestions.length > 0 || suggestionsLoading) && searchBarLayout && (
        <>
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={() => setShowSuggestions(false)}
          />
          <CitySuggestions
            suggestions={suggestions}
            loading={suggestionsLoading}
            onSelect={handleSelectSuggestion}
            onClose={() => setShowSuggestions(false)}
            top={searchBarLayout.y + searchBarLayout.height + 4}
            left={searchBarLayout.x}
            width={searchBarLayout.width}
          />
        </>
      )}
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
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  locationButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
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
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 999,
  },
});
