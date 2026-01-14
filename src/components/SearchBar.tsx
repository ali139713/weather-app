/**
 * SearchBar component with debounced search and city suggestions
 */

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
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

interface SearchBarProps {
  onSearch: (cityName: string) => void;
  placeholder?: string;
  onFocus?: () => void;
  onSuggestionsChange?: (suggestions: CitySuggestion[], loading: boolean, visible: boolean) => void;
  onLayout?: (event: any) => void;
}

export const SearchBar = forwardRef<View, SearchBarProps>(({
  onSearch,
  placeholder = 'Search city...',
  onFocus,
  onSuggestionsChange,
  onLayout,
}, ref) => {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.trim().length >= 2) {
        setLoading(true);
        onSuggestionsChange?.([], true, true);
        try {
          const results = await geocodingService.getCitySuggestions(debouncedQuery);
          setSuggestions(results);
          onSuggestionsChange?.(results, false, true);
        } catch {
          setSuggestions([]);
          onSuggestionsChange?.([], false, false);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
        onSuggestionsChange?.([], false, false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery, onSuggestionsChange]);

  const handleSearch = (cityName?: string) => {
    const searchTerm = cityName || query.trim();
    if (searchTerm) {
      onSearch(searchTerm);
      setQuery('');
      setSuggestions([]);
      onSuggestionsChange?.([], false, false);
    }
  };

  const getContainerStyle = () => [
    styles.container,
    theme.isDark ? styles.containerDark : styles.containerLight,
  ];

  const getInputStyle = () => [
    styles.input,
    theme.isDark ? styles.inputDark : styles.inputLight,
  ];

  const getButtonStyle = () => [
    styles.button,
    theme.isDark ? styles.buttonDark : styles.buttonLight,
    !query.trim() && styles.buttonDisabled,
  ];

  const wrapperRef = React.useRef<View>(null);

  useImperativeHandle(ref, () => wrapperRef.current as View);

  const handleLayout = () => {
    // Measure in window to get absolute screen coordinates
    wrapperRef.current?.measureInWindow((x, y, width, height) => {
      onLayout?.({ nativeEvent: { layout: { x, y, width, height } } } as any);
    });
  };

  return (
    <View ref={wrapperRef} style={styles.wrapper} onLayout={handleLayout}>
      <View style={getContainerStyle()}>
        <TextInput
          style={getInputStyle()}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => handleSearch()}
          onFocus={() => {
            if (onFocus) onFocus();
            if (suggestions.length > 0 || loading) {
              onSuggestionsChange?.(suggestions, loading, true);
            }
          }}
          onBlur={() => {
            // Delay hiding to allow suggestion selection
            setTimeout(() => {
              onSuggestionsChange?.(suggestions, loading, false);
            }, 300);
          }}
          returnKeyType="search"
        />
        <TouchableOpacity
          style={getButtonStyle()}
          onPress={() => handleSearch()}
          disabled={!query.trim()}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

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
  containerLight: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E5EA',
  },
  containerDark: {
    backgroundColor: '#1C1C1E',
    borderColor: '#38383A',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
    paddingRight: 8,
  },
  inputLight: {
    color: '#000000',
  },
  inputDark: {
    color: '#FFFFFF',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    minWidth: 70,
  },
  buttonLight: {
    backgroundColor: '#007AFF',
  },
  buttonDark: {
    backgroundColor: '#007AFF',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
