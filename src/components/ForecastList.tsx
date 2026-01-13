/**
 * ForecastList component to display 5-day weather forecast
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { DailyForecast } from '../types';
import { WeatherIcon } from './WeatherIcon';
import { Card } from './Card';

interface ForecastListProps {
  forecasts: DailyForecast[];
}

export const ForecastList: React.FC<ForecastListProps> = ({ forecasts }) => {
  return (
    <Card style={styles.card}>
      <Text style={styles.title}>5-Day Forecast</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {forecasts.map((forecast, index) => (
          <View key={index} style={styles.forecastItem}>
            <Text style={styles.dayName}>{forecast.dayName}</Text>
            <Text style={styles.date}>{forecast.date.split(' ')[1]}</Text>
            <WeatherIcon iconCode={forecast.icon} size={48} />
            <Text style={styles.condition}>{forecast.condition}</Text>
            <View style={styles.tempContainer}>
              <Text style={styles.high}>{forecast.high}°</Text>
              <Text style={styles.low}> / {forecast.low}°</Text>
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
    color: '#000',
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
    color: '#000',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  condition: {
    fontSize: 12,
    color: '#666',
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
    color: '#000',
  },
  low: {
    fontSize: 14,
    color: '#666',
  },
});
