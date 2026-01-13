/**
 * Unit tests for date utility functions
 */

import {
  formatDate,
  getDayName,
  getShortDate,
  formatTime,
  isToday,
  isSameDay,
} from '../dateUtils';

describe('dateUtils', () => {
  const mockTimestamp = 1640995200; // 2022-01-01 00:00:00 UTC

  describe('formatDate', () => {
    it('should format timestamp to readable date', () => {
      const result = formatDate(mockTimestamp);
      expect(result).toContain('2022');
      expect(result).toContain('January');
    });
  });

  describe('getDayName', () => {
    it('should return day name', () => {
      const result = getDayName(mockTimestamp);
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('getShortDate', () => {
    it('should return short date format', () => {
      const result = getShortDate(mockTimestamp);
      expect(result).toContain('Jan');
    });
  });

  describe('formatTime', () => {
    it('should format timestamp to time string', () => {
      const result = formatTime(mockTimestamp);
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });
  });

  describe('isToday', () => {
    it('should return true for today', () => {
      const today = Math.floor(Date.now() / 1000);
      expect(isToday(today)).toBe(true);
    });

    it('should return false for past date', () => {
      expect(isToday(mockTimestamp)).toBe(false);
    });
  });

  describe('isSameDay', () => {
    it('should return true for same day timestamps', () => {
      expect(isSameDay(mockTimestamp, mockTimestamp + 3600)).toBe(true);
    });

    it('should return false for different day timestamps', () => {
      expect(isSameDay(mockTimestamp, mockTimestamp + 86400)).toBe(false);
    });
  });
});
