/**
 * FavoriteButton component for adding/removing favorite cities
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onPress: () => void;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  isFavorite,
  onPress,
}) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: isFavorite
            ? theme.colors.primary
            : theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
      onPress={onPress}>
      <Text
        style={[
          styles.icon,
          { color: isFavorite ? theme.colors.surface : theme.colors.text },
        ]}>
        {isFavorite ? '❤️' : '🤍'}
      </Text>
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
    borderWidth: 1,
  },
  icon: {
    fontSize: 20,
  },
});
