/**
 * CurrentWeather component to display current weather information
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { CurrentWeather as CurrentWeatherType } from '../types';
import { WeatherIcon } from './WeatherIcon';
import { Card } from './Card';
import { useTheme } from '../context/ThemeContext';
import { formatDate } from '../utils/dateUtils';

interface CurrentWeatherProps {
  weather: CurrentWeatherType;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ weather }) => {
  const theme = useTheme();
  const condition = weather.weather[0];
  const main = weather.main;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [weather]);

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.city, { color: theme.colors.text }]}>
              {weather.name}
            </Text>
            <Text style={[styles.date, { color: theme.colors.textSecondary }]}>
              {formatDate(weather.dt)}
            </Text>
          </View>
          <Animated.View
            style={[
              {
                transform: [
                  {
                    rotate: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['-10deg', '0deg'],
                    }),
                  },
                ],
              },
            ]}>
            <WeatherIcon iconCode={condition.icon} size={80} />
          </Animated.View>
        </View>

        <View style={styles.temperatureContainer}>
          <Animated.Text
            style={[
              styles.temperature,
              {
                color: theme.colors.text,
                opacity: fadeAnim,
                transform: [
                  {
                    scale: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
              },
            ]}>
            {Math.round(main.temp)}°
          </Animated.Text>
          <Text
            style={[styles.condition, { color: theme.colors.textSecondary }]}>
            {condition.description}
          </Text>
        </View>

        <View style={[styles.details, { borderTopColor: theme.colors.border }]}>
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Feels like
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>
              {Math.round(main.feels_like)}°
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Humidity
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>
              {main.humidity}%
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Wind Speed
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>
              {weather.wind.speed} m/s
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
              Pressure
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>
              {main.pressure} hPa
            </Text>
          </View>
        </View>
      </Card>
    </Animated.View>
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
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
  },
  temperatureContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  temperature: {
    fontSize: 72,
    fontWeight: '300',
  },
  condition: {
    fontSize: 18,
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
  },
  detailItem: {
    width: '48%',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '600',
  },
});
