/**
 * Weather App - Main Entry Point
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WeatherProvider } from './src/context/WeatherContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { WeatherScreen } from './src/screens';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={isDarkMode ? '#000000' : '#FFFFFF'}
        />
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
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;
