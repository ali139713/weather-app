/**
 * CitySuggestions component to display search suggestions
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
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

  const containerStyle = [
    styles.container,
    styles.absoluteContainer,
    {
      backgroundColor: theme.isDark ? '#2C2C2E' : '#FFFFFF',
      borderColor: theme.isDark ? '#48484A' : '#E5E5EA',
      borderWidth: theme.isDark ? 1.5 : 1,
    },
  ];

  if (loading) {
    return (
      <View style={containerStyle}>
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
    <View style={containerStyle}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        nestedScrollEnabled={true}
        scrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}>
        {suggestions.map((item, index) => (
          <TouchableOpacity
            key={`${item.name}-${item.country}-${index}`}
            style={[
              styles.suggestionItem,
              {
                borderBottomColor: theme.colors.border,
                borderBottomWidth: index < suggestions.length - 1 ? StyleSheet.hairlineWidth : 0,
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
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    height: 200,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
    zIndex: 1000,
  },
  absoluteContainer: {
    position: 'absolute',
    top: '100%',
    left: 16,
    right: 16,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 8,
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
