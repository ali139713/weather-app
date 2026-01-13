/**
 * CitySuggestions component to display search suggestions
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { CitySuggestion } from '../services/geocoding';

interface CitySuggestionsProps {
  suggestions: CitySuggestion[];
  loading: boolean;
  onSelect: (city: CitySuggestion) => void;
  onClose: () => void;
}

export const CitySuggestions: React.FC<CitySuggestionsProps> = ({
  suggestions,
  loading,
  onSelect,
  onClose,
}) => {
  const theme = useTheme();

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          styles.absoluteContainer,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
            Searching...
          </Text>
        </View>
      </View>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        styles.absoluteContainer,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}>
      <FlatList
        data={suggestions}
        keyExtractor={(item, index) => `${item.name}-${item.country}-${index}`}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.suggestionItem,
              {
                borderBottomColor: theme.colors.border,
              },
            ]}
            onPress={() => onSelect(item)}>
            <Text style={[styles.cityName, { color: theme.colors.text }]}>
              {item.name}
            </Text>
            <Text style={[styles.countryName, { color: theme.colors.textSecondary }]}>
              {item.state ? `${item.state}, ` : ''}
              {item.country}
            </Text>
          </TouchableOpacity>
        )}
        scrollEnabled={true}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  absoluteContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
  },
  suggestionItem: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  cityName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  countryName: {
    fontSize: 14,
  },
});
