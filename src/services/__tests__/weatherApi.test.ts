/**
 * Unit tests for Weather API service
 */

import { weatherApiService } from '../weatherApi';

// Mock fetch globally
const mockFetch = jest.fn();
// @ts-ignore - global fetch mock for testing
global.fetch = mockFetch;

describe('WeatherApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCurrentWeather', () => {
    it('should fetch current weather for given coordinates', async () => {
      const mockResponse = {
        coord: { lon: 0, lat: 0 },
        weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
        main: { temp: 20, feels_like: 19, temp_min: 18, temp_max: 22, pressure: 1013, humidity: 60 },
        wind: { speed: 5, deg: 180 },
        name: 'Test City',
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await weatherApiService.getCurrentWeather(0, 0);

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('weather?lat=0&lon=0'),
      );
    });

    it('should throw error when API request fails', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        json: jest.fn().mockResolvedValue({ message: 'City not found' }),
      });

      await expect(weatherApiService.getCurrentWeather(0, 0)).rejects.toThrow();
    });
  });

  describe('getForecast', () => {
    it('should fetch forecast for given coordinates', async () => {
      const mockResponse = {
        cod: '200',
        message: 0,
        cnt: 40,
        list: [],
        city: { id: 1, name: 'Test City', coord: { lat: 0, lon: 0 }, country: 'US' },
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await weatherApiService.getForecast(0, 0);

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('forecast?lat=0&lon=0'),
      );
    });
  });
});
