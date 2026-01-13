/**
 * ThemeToggle component for switching between light and dark mode
 */

import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: isDark ? '#FFD700' : '#1C1C1E',
        },
      ]}
      onPress={toggleTheme}
      activeOpacity={0.7}>
      <Text style={styles.icon}>{isDark ? '☀️' : '🌙'}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
  },
});
