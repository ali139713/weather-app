/**
 * CurrentWeather component to display current weather information
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CurrentWeather as CurrentWeatherType } from '../types';
import { WeatherIcon } from './WeatherIcon';
import { Card } from './Card';
import { formatDate } from '../utils/dateUtils';

interface CurrentWeatherProps {
  weather: CurrentWeatherType;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ weather }) => {
  const condition = weather.weather[0];
  const main = weather.main;

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.city}>{weather.name}</Text>
          <Text style={styles.date}>{formatDate(weather.dt)}</Text>
        </View>
        <WeatherIcon iconCode={condition.icon} size={80} />
      </View>

      <View style={styles.temperatureContainer}>
        <Text style={styles.temperature}>{Math.round(main.temp)}°</Text>
        <Text style={styles.condition}>{condition.description}</Text>
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Feels like</Text>
          <Text style={styles.detailValue}>{Math.round(main.feels_like)}°</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Humidity</Text>
          <Text style={styles.detailValue}>{main.humidity}%</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Wind Speed</Text>
          <Text style={styles.detailValue}>{weather.wind.speed} m/s</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Pressure</Text>
          <Text style={styles.detailValue}>{main.pressure} hPa</Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  city: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  temperatureContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  temperature: {
    fontSize: 72,
    fontWeight: '300',
    color: '#000',
  },
  condition: {
    fontSize: 18,
    color: '#666',
    textTransform: 'capitalize',
    marginTop: 8,
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  detailItem: {
    width: '48%',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
});
