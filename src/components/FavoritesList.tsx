/**
 * FavoritesList component to display and manage favorite cities
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface FavoritesListProps {
  favorites: string[];
  onSelectCity: (cityName: string) => void;
  onRemoveFavorite: (cityName: string) => void;
}

export const FavoritesList: React.FC<FavoritesListProps> = ({
  favorites,
  onSelectCity,
  onRemoveFavorite,
}) => {
  const theme = useTheme();

  if (favorites.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Favorite Cities
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {favorites.map((city, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.cityChip,
              { backgroundColor: theme.colors.background },
            ]}
            onPress={() => onSelectCity(city)}>
            <Text style={[styles.cityText, { color: theme.colors.text }]}>
              {city}
            </Text>
            <TouchableOpacity
              onPress={() => onRemoveFavorite(city)}
              style={styles.removeButton}>
              <Text style={styles.removeText}>×</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  cityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  cityText: {
    fontSize: 14,
    marginRight: 8,
  },
  removeButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 16,
  },
});
