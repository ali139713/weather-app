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
  top?: number;
  left?: number;
  width?: number;
}

export const CitySuggestions: React.FC<CitySuggestionsProps> = ({
  suggestions,
  loading,
  onSelect,
  top,
  left,
  width,
}) => {
  const theme = useTheme();

  const getContainerStyle = () => [
    styles.container,
    styles.absoluteContainer,
    theme.isDark ? styles.containerDark : styles.containerLight,
    top !== undefined && { top },
    left !== undefined && { left },
    width !== undefined && { width },
  ];

  const getSuggestionItemStyle = (index: number) => [
    styles.suggestionItem,
    index < suggestions.length - 1 && (theme.isDark ? styles.suggestionItemBorderDark : styles.suggestionItemBorderLight),
  ];

  const getTextStyle = (type: 'city' | 'country') => [
    type === 'city' ? styles.cityName : styles.countryName,
    theme.isDark ? styles.textDark : styles.textLight,
  ];

  if (loading) {
    return (
      <View style={getContainerStyle()}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
          <Text style={[styles.loadingText, theme.isDark ? styles.textSecondaryDark : styles.textSecondaryLight]}>
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
    <View style={getContainerStyle()}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}
        bounces={false}>
        {suggestions.map((item, index) => (
          <TouchableOpacity
            key={`${item.name}-${item.country}-${index}`}
            style={getSuggestionItemStyle(index)}
            onPress={() => onSelect(item)}>
            <Text style={getTextStyle('city')}>{item.name}</Text>
            <Text style={getTextStyle('country')}>
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
  containerLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E5EA',
    borderWidth: 1,
  },
  containerDark: {
    backgroundColor: '#2C2C2E',
    borderColor: '#48484A',
    borderWidth: 1.5,
  },
  absoluteContainer: {
    position: 'absolute',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 8,
    flexGrow: 1,
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
  suggestionItemBorderLight: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  suggestionItemBorderDark: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#48484A',
  },
  cityName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  countryName: {
    fontSize: 14,
  },
  textLight: {
    color: '#000000',
  },
  textDark: {
    color: '#FFFFFF',
  },
  textSecondaryLight: {
    color: '#8E8E93',
  },
  textSecondaryDark: {
    color: '#8E8E93',
  },
});
