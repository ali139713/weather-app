/**
 * Utility functions for processing forecast data
 */

import { ForecastItem, DailyForecast, HourlyForecast } from '../types';
import {
  getDayName,
  getShortDate,
  formatTime,
  getHour,
  isToday,
  isSameDay,
} from './dateUtils';

/**
 * Groups forecast items by day and returns daily forecast summary
 */
export const groupForecastByDay = (
  forecastItems: ForecastItem[],
): DailyForecast[] => {
  const dailyMap = new Map<string, ForecastItem[]>();

  forecastItems.forEach(item => {
    const date = new Date(item.dt * 1000);
    const dateKey = date.toDateString();

    if (!dailyMap.has(dateKey)) {
      dailyMap.set(dateKey, []);
    }
    dailyMap.get(dateKey)!.push(item);
  });

  const dailyForecasts: DailyForecast[] = [];

  dailyMap.forEach((items, dateKey) => {
    const temps = items.map(item => item.main.temp);
    const high = Math.max(...temps);
    const low = Math.min(...temps);

    const midDayItem = items[Math.floor(items.length / 2)];
    const weather = midDayItem.weather[0];

    dailyForecasts.push({
      date: dateKey,
      dayName: getDayName(midDayItem.dt),
      high: Math.round(high),
      low: Math.round(low),
      icon: weather.icon,
      condition: weather.main,
    });
  });

  return dailyForecasts.slice(0, 5);
};

/**
 * Gets hourly forecast for today
 */
export const getHourlyForecast = (
  forecastItems: ForecastItem[],
): HourlyForecast[] => {
  const today = new Date();
  const todayItems = forecastItems.filter(item => isToday(item.dt));

  return todayItems.slice(0, 24).map(item => ({
    time: formatTime(item.dt),
    hour: getHour(item.dt),
    temp: Math.round(item.main.temp),
    icon: item.weather[0].icon,
    condition: item.weather[0].main,
  }));
};

/**
 * Gets hourly forecast for a specific day
 */
export const getHourlyForecastForDay = (
  forecastItems: ForecastItem[],
  targetTimestamp: number,
): HourlyForecast[] => {
  const dayItems = forecastItems.filter(item =>
    isSameDay(item.dt, targetTimestamp),
  );

  return dayItems.map(item => ({
    time: formatTime(item.dt),
    hour: getHour(item.dt),
    temp: Math.round(item.main.temp),
    icon: item.weather[0].icon,
    condition: item.weather[0].main,
  }));
};
