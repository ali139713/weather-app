/**
 * Custom hook for managing favorite cities
 */

import { useState, useEffect, useCallback } from 'react';
import { storageService } from '../services/storage';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const savedFavorites = await storageService.getFavoriteCities();
      setFavorites(savedFavorites);
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = useCallback(async (cityName: string) => {
    if (!favorites.includes(cityName)) {
      const updated = [...favorites, cityName];
      setFavorites(updated);
      await storageService.saveFavoriteCities(updated);
    }
  }, [favorites]);

  const removeFavorite = useCallback(async (cityName: string) => {
    const updated = favorites.filter(city => city !== cityName);
    setFavorites(updated);
    await storageService.saveFavoriteCities(updated);
  }, [favorites]);

  const isFavorite = useCallback((cityName: string) => {
    return favorites.includes(cityName);
  }, [favorites]);

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorite,
  };
};
