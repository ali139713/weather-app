# Weather App

A React Native mobile weather forecast application that displays current weather and a 5-day forecast for the user's location or any searched city.

## Features

### Core Features
- ✅ Current weather display with temperature, condition, humidity, and wind speed
- ✅ 5-day weather forecast with daily high/low temperatures and weather icons
- ✅ Automatic geolocation detection
- ✅ City search functionality
- ✅ Loading states and error handling with user-friendly UI feedback
- ✅ Offline support with cached weather data (last fetched data available offline)

### Bonus Features
- ✅ Dark mode support (follows system theme)
- ✅ Pull-to-refresh functionality
- ✅ Favorite cities for quick access
- ✅ Hourly forecast view for the current day
- ✅ Weather icons with emoji representation
- ✅ Smooth animations and transitions

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (>= 20)
- npm or yarn
- React Native development environment set up:
  - For iOS: Xcode and CocoaPods
  - For Android: Android Studio and Android SDK
- OpenWeatherMap API key (free tier available at [openweathermap.org](https://openweathermap.org/api))

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd weather-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add your OpenWeatherMap API key:
   ```
   WEATHER_API_KEY=your_api_key_here
   ```
   - Note: For React Native, you may need to use `react-native-config` or set the API key directly in `src/constants/config.ts` for now

4. For iOS, install CocoaPods dependencies:
```bash
cd ios
bundle install
bundle exec pod install
cd ..
```

## Running the App

### Start Metro Bundler
```bash
npm start
```

### Run on iOS
```bash
npm run ios
```

### Run on Android
```bash
npm run android
```

## Project Structure

```
weather-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── CurrentWeather.tsx
│   │   ├── Error.tsx
│   │   ├── FavoriteButton.tsx
│   │   ├── FavoritesList.tsx
│   │   ├── ForecastList.tsx
│   │   ├── HourlyForecast.tsx
│   │   ├── Loading.tsx
│   │   ├── SearchBar.tsx
│   │   └── WeatherIcon.tsx
│   ├── context/             # React Context providers
│   │   ├── ThemeContext.tsx
│   │   └── WeatherContext.tsx
│   ├── hooks/               # Custom React hooks
│   │   └── useFavorites.ts
│   ├── screens/             # Screen components
│   │   └── WeatherScreen.tsx
│   ├── services/            # API and service layers
│   │   ├── geolocation.ts
│   │   ├── storage.ts
│   │   └── weatherApi.ts
│   ├── types/               # TypeScript type definitions
│   │   └── weather.ts
│   ├── utils/               # Utility functions
│   │   ├── dateUtils.ts
│   │   └── forecastUtils.ts
│   └── constants/           # App constants
│       └── config.ts
├── App.tsx                  # Main app entry point
└── package.json
```

## Architecture & Key Decisions

### State Management
- **Context API**: Used for global state management (weather data and theme)
- **Local State**: React hooks (`useState`, `useEffect`) for component-level state
- **Custom Hooks**: `useFavorites` for managing favorite cities

### Data Fetching & Caching
- **API Service**: Centralized weather API service with error handling
- **Offline Support**: AsyncStorage for caching weather data
- **Cache Duration**: 5 minutes (configurable in `src/constants/config.ts`)
- **Automatic Cache Loading**: App loads cached data on startup if available

### Styling & Theming
- **Theme Context**: Centralized theme management with dark mode support
- **StyleSheet**: React Native StyleSheet for component styles
- **Dynamic Theming**: Components adapt to light/dark mode automatically

### Component Design
- **Small, Reusable Components**: Each component has a single responsibility
- **Composition**: Components are composed to build complex UIs
- **Type Safety**: Full TypeScript support with proper type definitions

### Error Handling
- **Graceful Degradation**: App shows cached data if API fails
- **User Feedback**: Clear error messages with retry functionality
- **Loading States**: Proper loading indicators during data fetching

## API Configuration

The app uses the OpenWeatherMap API. To get your API key:

1. Sign up at [openweathermap.org](https://openweathermap.org/api)
2. Get your free API key from the dashboard
3. Add it to your environment variables or `src/constants/config.ts`

**Note**: The free tier allows 60 calls per minute, which is sufficient for this app.

## Testing

Run tests with:
```bash
npm test
```

## Assumptions & Trade-offs

### Assumptions
- Users have location permissions enabled (app requests permission)
- Internet connection available for initial data fetch (cached data available offline)
- OpenWeatherMap API is accessible and responsive

### Trade-offs
1. **Emoji Icons**: Used emoji instead of icon libraries for simplicity and no additional dependencies
2. **Context API vs Redux**: Chose Context API for simplicity given the app's size
3. **AsyncStorage**: Used for offline caching (simple but sufficient for this use case)
4. **No State Persistence Library**: Manual cache management for better control

## Future Improvements

- [ ] Add unit tests for all components and services
- [ ] Implement weather map view
- [ ] Add more detailed weather information (UV index, visibility, etc.)
- [ ] Implement push notifications for weather alerts
- [ ] Add weather history/charts
- [ ] Support for multiple units (Celsius/Fahrenheit)
- [ ] Add more animation effects
- [ ] Implement weather widget for home screen

## License

This project is created for evaluation purposes.

## Author

Built as a test project for React Native Developer position evaluation.
