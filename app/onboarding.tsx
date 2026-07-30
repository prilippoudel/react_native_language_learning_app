import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { height: windowHeight } = useWindowDimensions();

  const handleGetStarted = () => {
    router.replace('/');
  };

  const isSmallScreen = windowHeight < 700;

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.contentWrapper}>
          {/* Top Section: Header & Text */}
          <View style={styles.topSection}>
            <View style={styles.header}>
              <Image
                source={require('../assets/images/moscot-logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
              <Text style={styles.appName}>muolingo</Text>
            </View>

            <View style={styles.textContainer}>
              <Text style={[styles.title, isSmallScreen && styles.titleSmall]}>
                Your AI language{'\n'}
                <Text style={styles.titleHighlight}>teacher.</Text>
              </Text>
              <Text style={[styles.subtitle, isSmallScreen && styles.subtitleSmall]}>
                Real conversations, personalized{'\n'}lessons, anytime, anywhere.
              </Text>
            </View>
          </View>

          {/* Middle Section: Mascot & Speech Bubbles */}
          <View style={styles.middleSection}>
            <View
              style={[
                styles.illustrationContainer,
                isSmallScreen && styles.illustrationContainerSmall,
              ]}
            >
              <Image
                source={require('../assets/images/mascot-welcome.png')}
                style={[
                  styles.mascotImage,
                  isSmallScreen && styles.mascotImageSmall,
                ]}
                resizeMode="contain"
              />

              <View
                style={[
                  styles.bubble,
                  styles.bubbleHello,
                  isSmallScreen && styles.bubbleHelloSmall,
                ]}
              >
                <Text style={styles.bubbleHelloText}>Hello!</Text>
                <View style={styles.bubbleHelloTail} />
              </View>

              <View
                style={[
                  styles.bubble,
                  styles.bubbleHola,
                  isSmallScreen && styles.bubbleHolaSmall,
                ]}
              >
                <Text style={styles.bubbleHolaText}>¡Hola!</Text>
                <View style={styles.bubbleHolaTail} />
              </View>

              <View
                style={[
                  styles.bubble,
                  styles.bubbleNiHao,
                  isSmallScreen && styles.bubbleNiHaoSmall,
                ]}
              >
                <Text style={styles.bubbleNiHaoText}>你好!</Text>
                <View style={styles.bubbleNiHaoTail} />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom CTA Button */}
      <View
        style={[
          styles.bottomContainer,
          { paddingBottom: Math.max(insets.bottom + 32, 54) },
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleGetStarted}
        >
          <Text style={styles.buttonText}>Get Started</Text>
          <Text style={styles.buttonIcon}>›</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topSection: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    marginBottom: 48,
  },
  logoImage: {
    width: 38,
    height: 38,
  },
  appName: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 26,
    color: '#0D132B',
    marginLeft: 8,
    letterSpacing: -0.5,
  },
  textContainer: {
    paddingHorizontal: 28,
    marginTop: 16,
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 34,
    lineHeight: 42,
    color: '#0D132B',
    letterSpacing: -0.5,
  },
  titleSmall: {
    fontSize: 28,
    lineHeight: 36,
  },
  titleHighlight: {
    color: '#6C4EF5',
  },
  subtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    lineHeight: 26,
    color: '#64748B',
    marginTop: 12,
  },
  subtitleSmall: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: 8,
  },
  middleSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  illustrationContainer: {
    width: 370,
    height: 370,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  illustrationContainerSmall: {
    width: 300,
    height: 300,
  },
  mascotImage: {
    width: 310,
    height: 310,
  },
  mascotImageSmall: {
    width: 250,
    height: 250,
  },

  // Base Bubble styling
  bubble: {
    position: 'absolute',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  // Bubble 1: Hello!
  bubbleHello: {
    top: 25,
    left: 12,
    backgroundColor: '#EDF5FF',
  },
  bubbleHelloSmall: {
    top: 10,
    left: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bubbleHelloText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#0D132B',
  },
  bubbleHelloTail: {
    position: 'absolute',
    bottom: -5,
    right: 18,
    width: 10,
    height: 10,
    backgroundColor: '#EDF5FF',
    transform: [{ rotate: '45deg' }],
  },

  // Bubble 2: ¡Hola!
  bubbleHola: {
    top: 8,
    right: 22,
    backgroundColor: '#F3E8FF',
  },
  bubbleHolaSmall: {
    top: 0,
    right: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bubbleHolaText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#6C4EF5',
  },
  bubbleHolaTail: {
    position: 'absolute',
    bottom: -5,
    left: 18,
    width: 10,
    height: 10,
    backgroundColor: '#F3E8FF',
    transform: [{ rotate: '45deg' }],
  },

  // Bubble 3: 你好!
  bubbleNiHao: {
    top: 155,
    right: 5,
    backgroundColor: '#FFF0ED',
  },
  bubbleNiHaoSmall: {
    top: 110,
    right: 0,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bubbleNiHaoText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#EF4444',
  },
  bubbleNiHaoTail: {
    position: 'absolute',
    left: -5,
    top: 14,
    width: 10,
    height: 10,
    backgroundColor: '#FFF0ED',
    transform: [{ rotate: '45deg' }],
  },

  // Bottom CTA Button
  bottomContainer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
  },
  button: {
    backgroundColor: '#6C4EF5',
    height: 56,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#6C4EF5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  buttonIcon: {
    position: 'absolute',
    right: 22,
    color: '#FFFFFF',
    fontSize: 28,
    fontFamily: 'Poppins_600SemiBold',
    lineHeight: 30,
  },
});
