/**
 * WeatherIcon component to display weather condition icons
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface WeatherIconProps {
  iconCode: string;
  size?: number;
}

const getWeatherEmoji = (iconCode: string): string => {
  const code = iconCode.slice(0, 2);
  const time = iconCode.slice(2);

  const iconMap: Record<string, string> = {
    '01': '☀️', // clear sky
    '02': '⛅', // few clouds
    '03': '☁️', // scattered clouds
    '04': '☁️', // broken clouds
    '09': '🌧️', // shower rain
    '10': '🌦️', // rain
    '11': '⛈️', // thunderstorm
    '13': '❄️', // snow
    '50': '🌫️', // mist
  };

  return iconMap[code] || '☀️';
};

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  iconCode,
  size = 64,
}) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Text style={[styles.icon, { fontSize: size * 0.8 }]}>
        {getWeatherEmoji(iconCode)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    textAlign: 'center',
  },
});
