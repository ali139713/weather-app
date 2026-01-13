/**
 * Error utility functions for user-friendly error messages
 */

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    // Network errors
    if (message.includes('network') || message.includes('fetch')) {
      return 'Unable to connect. Please check your internet connection.';
    }

    // API errors
    if (message.includes('404') || message.includes('not found')) {
      return 'City not found. Please try a different city name.';
    }

    if (message.includes('401') || message.includes('invalid api key')) {
      return 'API key is invalid. Please check your configuration.';
    }

    if (message.includes('429') || message.includes('too many requests')) {
      return 'Too many requests. Please wait a moment and try again.';
    }

    if (message.includes('400') || message.includes('bad request')) {
      return 'Invalid request. Please check your input.';
    }

    // Location errors
    if (message.includes('location') || message.includes('permission')) {
      return 'Location permission denied. Please enable location access in settings.';
    }

    // Generic error messages
    if (message.includes('failed to fetch')) {
      return 'Failed to fetch weather data. Please try again.';
    }

    // Return the original message if it's user-friendly
    if (message.length < 100) {
      return error.message;
    }
  }

  return 'An unexpected error occurred. Please try again.';
};
