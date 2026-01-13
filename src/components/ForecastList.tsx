/**
 * ForecastList component to display 5-day weather forecast
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { DailyForecast } from '../types';
import { WeatherIcon } from './WeatherIcon';
import { Card } from './Card';
import { useTheme } from '../context/ThemeContext';

interface ForecastListProps {
  forecasts: DailyForecast[];
}

export const ForecastList: React.FC<ForecastListProps> = ({ forecasts }) => {
  const theme = useTheme();
  return (
    <Card style={styles.card}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        5-Day Forecast
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {forecasts.map((forecast, index) => (
          <View key={index} style={styles.forecastItem}>
            <Text style={[styles.dayName, { color: theme.colors.text }]}>
              {forecast.dayName}
            </Text>
            <Text style={[styles.date, { color: theme.colors.textSecondary }]}>
              {forecast.date.split(' ')[1]}
            </Text>
            <WeatherIcon iconCode={forecast.icon} size={48} />
            <Text
              style={[styles.condition, { color: theme.colors.textSecondary }]}>
              {forecast.condition}
            </Text>
            <View style={styles.tempContainer}>
              <Text style={[styles.high, { color: theme.colors.text }]}>
                {forecast.high}°
              </Text>
              <Text style={[styles.low, { color: theme.colors.textSecondary }]}>
                {' '}/ {forecast.low}°
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  forecastItem: {
    alignItems: 'center',
    marginRight: 20,
    minWidth: 80,
  },
  dayName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    marginBottom: 8,
  },
  condition: {
    fontSize: 12,
    textTransform: 'capitalize',
    marginTop: 4,
    marginBottom: 8,
  },
  tempContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  high: {
    fontSize: 16,
    fontWeight: '600',
  },
  low: {
    fontSize: 14,
  },
});
