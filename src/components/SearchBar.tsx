/**
 * SearchBar component with debounced search and city suggestions
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useDebounce } from '../hooks/useDebounce';
import { geocodingService, CitySuggestion } from '../services/geocoding';
import { CitySuggestions } from './CitySuggestions';

interface SearchBarProps {
  onSearch: (cityName: string) => void;
  placeholder?: string;
  onFocus?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search city...',
  onFocus,
}) => {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.trim().length >= 2) {
        setLoading(true);
        try {
          const results = await geocodingService.getCitySuggestions(debouncedQuery);
          setSuggestions(results);
          setShowSuggestions(true);
        } catch (error) {
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  const handleSearch = (cityName?: string) => {
    const searchTerm = cityName || query.trim();
    if (searchTerm) {
      onSearch(searchTerm);
      setQuery('');
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (city: CitySuggestion) => {
    handleSearch(city.name);
  };

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.isDark ? '#1C1C1E' : '#FFFFFF',
            borderColor: theme.isDark ? '#38383A' : '#E5E5EA',
          },
        ]}>
        <TextInput
          style={[styles.input, { color: theme.colors.text }]}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => handleSearch()}
          onFocus={() => {
            if (onFocus) onFocus();
            if (suggestions.length > 0 || loading) {
              setShowSuggestions(true);
            }
          }}
          onBlur={() => {
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          returnKeyType="search"
        />
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: theme.colors.primary,
              opacity: query.trim() ? 1 : 0.5,
            },
          ]}
          onPress={() => handleSearch()}
          disabled={!query.trim()}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>
      {showSuggestions && (suggestions.length > 0 || loading) && (
        <CitySuggestions
          suggestions={suggestions}
          loading={loading}
          onSelect={handleSelectSuggestion}
          onClose={() => setShowSuggestions(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    zIndex: 1000,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
    paddingRight: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    minWidth: 70,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
