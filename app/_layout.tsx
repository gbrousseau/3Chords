import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SplashScreen } from 'expo-router';
import { StripeProvider } from '@stripe/stripe-react-native';
import { AuthProvider } from './context/AuthContext';
import { STRIPE_PUBLISHABLE_KEY, initializeStripe } from './utils/stripe';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Platform } from 'react-native';
import { useAppFonts } from './utils/fonts';

// Initialize Reanimated
if (Platform.OS !== 'web') {
  require('react-native-reanimated').setUpDevelopmentMode(true);
}

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsError, setFontsError] = useState(false);
  const fontsLoaded = useAppFonts();

  useEffect(() => {
    if (fontsLoaded || fontsError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontsError]);

  useEffect(() => {
    initializeStripe();
  }, []);

  // If fonts failed to load, we'll still render the app with system fonts
  if (!fontsLoaded && !fontsError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(onboarding)" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
          </Stack>
          <StatusBar style="light" />
        </StripeProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}