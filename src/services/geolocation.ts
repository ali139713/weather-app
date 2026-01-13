/**
 * Geolocation service for getting user's current location
 */

import Geolocation from '@react-native-community/geolocation';
import { Location } from '../types';
import { Platform, PermissionsAndroid } from 'react-native';

class GeolocationService {
  /**
   * Requests location permissions for Android
   */
  private async requestAndroidPermission(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      return true;
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'Weather App needs access to your location to show local weather',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Location permission error:', err);
      return false;
    }
  }

  /**
   * Gets the user's current location
   */
  async getCurrentLocation(): Promise<Location> {
    const hasPermission = await this.requestAndroidPermission();
    if (!hasPermission && Platform.OS === 'android') {
      throw new Error('Location permission denied');
    }

    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        error => {
          reject(new Error(`Failed to get location: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        },
      );
    });
  }
}

export const geolocationService = new GeolocationService();
