import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Animated, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, FontSize, Spacing} from '../../theme';

const SplashScreen: React.FC = () => {
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {toValue: 1, useNativeDriver: true}),
      Animated.timing(opacity, {toValue: 1, duration: 800, useNativeDriver: true}),
    ]).start();
  }, [scale, opacity]);

  return (
    <LinearGradient
      colors={[Colors.primaryDark, Colors.primary, Colors.primaryLight]}
      style={styles.container}>
      <Animated.View style={[styles.content, {transform: [{scale}], opacity}]}>
        <View style={styles.iconContainer}>
          <Image
            source={require('../../assets/images/ooru_mitra_logo_2.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>OoruMitra</Text>
        <Text style={styles.tagline}>Services, Workers & Products Near You</Text>
        <View style={styles.dotsContainer}>
          {[0, 1, 2].map(i => (
            <View key={i} style={[styles.dot, {opacity: 0.6 + i * 0.2}]} />
          ))}
        </View>
      </Animated.View>
      <Text style={styles.version}>Version 1.0</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  content: {alignItems: 'center', paddingHorizontal: Spacing.xxl},
  iconContainer: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.xl,
    overflow: 'hidden',
  },
  logo: {width: 88, height: 88},
  title: {
    fontSize: FontSize.display, fontWeight: 'bold',
    color: Colors.textOnPrimary, letterSpacing: 2, marginBottom: Spacing.sm,
  },
  tagline: {
    fontSize: FontSize.base, color: 'rgba(255,255,255,0.85)',
    textAlign: 'center', lineHeight: 22,
  },
  dotsContainer: {flexDirection: 'row', marginTop: Spacing.xxxl, gap: 8},
  dot: {width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.textOnPrimary},
  version: {position: 'absolute', bottom: 32, color: 'rgba(255,255,255,0.6)', fontSize: FontSize.sm},
});

export default SplashScreen;
