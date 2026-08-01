import '../global.css';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { Stack, useRouter, useSegments } from 'expo-router';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { ClerkProvider, useAuth } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { useLanguageStore } from '@/store/useLanguageStore';

import { useColorScheme } from '@/components/useColorScheme';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error('Add your Clerk Publishable Key to the .env file');
}

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
  });

  // Prevent auto hiding splash screen safely when layout mounts
  useEffect(() => {
    SplashScreen.preventAutoHideAsync().catch(() => {
      /* ignore splash screen preventAutoHide error in web/reloads */
    });
  }, []);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync().catch(() => {
        /* ignore splash screen hide error */
      });
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function AuthProtection() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const selectedLanguage = useLanguageStore((state) => state.selectedLanguage);
  const hasHydrated = useLanguageStore((state) => state.hasHydrated);

  useEffect(() => {
    if (!isLoaded || !hasHydrated) return;

    const inAuthGroup =
      segments[0] === 'signin' ||
      segments[0] === 'signup' ||
      segments[0] === 'onboarding';

    const inLanguageSelection = segments[0] === 'language-selection';

    if (!isSignedIn && !inAuthGroup) {
      router.replace('/onboarding');
    } else if (isSignedIn) {
      if (!selectedLanguage && !inLanguageSelection) {
        router.replace('/language-selection');
      } else if (selectedLanguage && (inAuthGroup || (inLanguageSelection && segments.length === 1))) {
        // If coming from onboarding/signin/signup or initial load without prior stack, route to home tabs
        if (inAuthGroup) {
          router.replace('/(tabs)');
        }
      }
    }
  }, [isLoaded, isSignedIn, selectedLanguage, hasHydrated, segments]);

  return null;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <SafeAreaProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <AuthProtection />
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="language-selection" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="signup" options={{ headerShown: false }} />
            <Stack.Screen name="signin" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </Stack>
        </ThemeProvider>
      </SafeAreaProvider>
    </ClerkProvider>
  );
}
