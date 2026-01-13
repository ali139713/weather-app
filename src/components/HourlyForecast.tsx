/**
 * HourlyForecast component to display hourly weather forecast for today
 */

import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { HourlyForecast as HourlyForecastType } from '../types';
import { WeatherIcon } from './WeatherIcon';
import { Card } from './Card';
import { useTheme } from '../context/ThemeContext';

interface HourlyForecastProps {
  hourlyData: HourlyForecastType[];
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({
  hourlyData,
}) => {
  const theme = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      delay: 100,
      useNativeDriver: true,
    }).start();
  }, [hourlyData]);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <Card style={styles.card}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Hourly Forecast
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {hourlyData.map((item, index) => (
            <Animated.View
              key={index}
              style={[
                styles.hourItem,
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateX: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [15 * (index + 1), 0],
                      }),
                    },
                  ],
                },
              ]}>
              <Text style={[styles.time, { color: theme.colors.textSecondary }]}>
                {item.time}
              </Text>
              <WeatherIcon iconCode={item.icon} size={40} />
              <Text style={[styles.temp, { color: theme.colors.text }]}>
                {item.temp}°
              </Text>
            </Animated.View>
          ))}
        </ScrollView>
      </Card>
    </Animated.View>
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
  hourItem: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 60,
  },
  time: {
    fontSize: 12,
    marginBottom: 8,
  },
  temp: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
});
