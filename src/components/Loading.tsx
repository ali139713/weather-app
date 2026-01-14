/**
 * Loading component to display while data is being fetched
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated, Easing } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface LoadingProps {
  message?: string;
}

export const Loading: React.FC<LoadingProps> = ({ message = 'Loading weather data...' }) => {
  const theme = useTheme();
  const cloud1Anim = useRef(new Animated.Value(0)).current;
  const cloud2Anim = useRef(new Animated.Value(0)).current;
  const cloud3Anim = useRef(new Animated.Value(0)).current;
  const sunAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Cloud floating animations
    const cloud1Animation = Animated.loop(
      Animated.sequence([
        Animated.timing(cloud1Anim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(cloud1Anim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    const cloud2Animation = Animated.loop(
      Animated.sequence([
        Animated.timing(cloud2Anim, {
          toValue: 1,
          duration: 2500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(cloud2Anim, {
          toValue: 0,
          duration: 2500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    const cloud3Animation = Animated.loop(
      Animated.sequence([
        Animated.timing(cloud3Anim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(cloud3Anim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    // Sun rotation animation
    const sunAnimation = Animated.loop(
      Animated.timing(sunAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    // Pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    cloud1Animation.start();
    cloud2Animation.start();
    cloud3Animation.start();
    sunAnimation.start();
    pulseAnimation.start();

    return () => {
      cloud1Animation.stop();
      cloud2Animation.stop();
      cloud3Animation.stop();
      sunAnimation.stop();
      pulseAnimation.stop();
    };
  }, [cloud1Anim, cloud2Anim, cloud3Anim, sunAnim, pulseAnim]);

  const cloud1TranslateY = cloud1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  const cloud2TranslateY = cloud2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const cloud3TranslateY = cloud3Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const sunRotate = sunAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.animationContainer}>
        {/* Sun */}
        <Animated.View
          style={[
            styles.sun,
            {
              transform: [
                { rotate: sunRotate },
                { scale: pulseAnim },
              ],
            },
          ]}>
          <Text style={styles.sunEmoji}>☀️</Text>
        </Animated.View>

        {/* Clouds */}
        <Animated.View
          style={[
            styles.cloud,
            styles.cloud1,
            {
              transform: [{ translateY: cloud1TranslateY }],
            },
          ]}>
          <Text style={styles.cloudEmoji}>☁️</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.cloud,
            styles.cloud2,
            {
              transform: [{ translateY: cloud2TranslateY }],
            },
          ]}>
          <Text style={styles.cloudEmoji}>☁️</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.cloud,
            styles.cloud3,
            {
              transform: [{ translateY: cloud3TranslateY }],
            },
          ]}>
          <Text style={styles.cloudEmoji}>☁️</Text>
        </Animated.View>
      </View>

      <Text style={[styles.message, { color: theme.colors.text }]}>
        {message}
      </Text>
      <Text style={[styles.subMessage, { color: theme.colors.textSecondary }]}>
        Please wait...
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  animationContainer: {
    width: 200,
    height: 200,
    position: 'relative',
    marginBottom: 40,
  },
  sun: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -30,
    marginTop: -30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sunEmoji: {
    fontSize: 50,
  },
  cloud: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cloud1: {
    top: 20,
    left: 10,
  },
  cloud2: {
    top: 60,
    right: 20,
  },
  cloud3: {
    bottom: 30,
    left: 50,
  },
  cloudEmoji: {
    fontSize: 40,
    opacity: 0.8,
  },
  message: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  subMessage: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
});
