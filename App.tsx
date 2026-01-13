/**
 * Weather App - Main Entry Point
 */

import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WeatherProvider } from './src/context/WeatherContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { WeatherScreen } from './src/screens';
import { SplashScreen } from './src/screens/SplashScreen';

const Stack = createNativeStackNavigator();

function AppContent(): React.JSX.Element {
  const [showSplash, setShowSplash] = useState(true);
  const { isDark } = useTheme();

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#000000' : '#FFFFFF'}
      />
      {showSplash ? (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      ) : (
        <WeatherProvider>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
              }}>
              <Stack.Screen name="Weather" component={WeatherScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </WeatherProvider>
      )}
    </>
  );
}

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;
