import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Dimensions, StatusBar } from 'react-native';
import { Sprout } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onAnimationComplete }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const loaderAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(loaderAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient
        colors={['#1b5e20', '#2e7d32', '#4caf50']}
        style={styles.background}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.iconContainer}>
            <Sprout color="#fff" size={80} strokeWidth={1.5} />
          </View>
          <Text style={styles.title}>SOIL.AI</Text>
          <Text style={styles.subtitle}>Cultivating Intelligence</Text>
          
          <View style={styles.loaderContainer}>
            <View style={styles.loaderBarBase}>
              <Animated.View 
                style={[
                  styles.loaderBarFill,
                  {
                    width: loaderAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%']
                    })
                  }
                ]} 
              />
            </View>
          </View>
        </Animated.View>
        
        <Animated.Text style={[styles.version, { opacity: fadeAnim }]}>
          v1.0.0
        </Animated.Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 140,
    height: 140,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#e8f5e9',
    marginTop: 8,
    fontWeight: '500',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  loaderContainer: {
    marginTop: 40,
    width: 200,
    height: 4,
  },
  loaderBarBase: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loaderBarFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  version: {
    position: 'absolute',
    bottom: 40,
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontWeight: '600',
  }
});
