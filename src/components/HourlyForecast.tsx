/**
 * HourlyForecast component to display hourly weather forecast for today
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { HourlyForecast as HourlyForecastType } from '../types';
import { WeatherIcon } from './WeatherIcon';
import { Card } from './Card';

interface HourlyForecastProps {
  hourlyData: HourlyForecastType[];
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({
  hourlyData,
}) => {
  return (
    <Card style={styles.card}>
      <Text style={styles.title}>Hourly Forecast</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {hourlyData.map((item, index) => (
          <View key={index} style={styles.hourItem}>
            <Text style={styles.time}>{item.time}</Text>
            <WeatherIcon iconCode={item.icon} size={40} />
            <Text style={styles.temp}>{item.temp}°</Text>
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
  hourItem: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 60,
  },
  time: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  temp: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginTop: 4,
  },
});
