import { useFonts } from 'expo-font';
import { Platform } from 'react-native';

// Define font weights for better type safety
export type FontWeight = 'regular' | 'medium' | 'semiBold' | 'bold';

// Define font types for better type safety
export type FontType = 'inter' | 'system' | 'vector';

// Safe font loading with error handling
export const useAppFonts = () => {
  try {
    const [fontsLoaded] = useFonts({
      // Google Fonts
      'Inter': require('@expo-google-fonts/inter/Inter_400Regular.ttf'),
      'Inter-Medium': require('@expo-google-fonts/inter/Inter_500Medium.ttf'),
      'Inter-SemiBold': require('@expo-google-fonts/inter/Inter_600SemiBold.ttf'),
      'Inter-Bold': require('@expo-google-fonts/inter/Inter_700Bold.ttf'),
    });
    return fontsLoaded;
  } catch (error) {
    console.warn('Font loading error:', error);
    return false;
  }
};

// Safe font family resolution with fallbacks
export const getFontFamily = (fontsLoaded: boolean, weight: FontWeight = 'regular', type: FontType = 'inter') => {
  try {
    // If fonts failed to load, use system font
    if (!fontsLoaded) {
      return 'System';
    }

    // Use system font for system type or vector icons
    if (type === 'system' || type === 'vector') {
      return 'System';
    }

    // Inter font weights
    switch (weight) {
      case 'medium':
        return 'Inter-Medium';
      case 'semiBold':
        return 'Inter-SemiBold';
      case 'bold':
        return 'Inter-Bold';
      default:
        return 'Inter';
    }
  } catch (error) {
    console.warn('Font family resolution error:', error);
    return 'System';
  }
};

// Platform-specific font family resolution with error handling
export const getPlatformFontFamily = (fontsLoaded: boolean, weight: FontWeight = 'regular', type: FontType = 'inter') => {
  try {
    const fontFamily = getFontFamily(fontsLoaded, weight, type);

    // On Android, we need to handle some special cases
    if (Platform.OS === 'android') {
      // If fonts failed to load, use system font
      if (!fontsLoaded) {
        return 'System';
      }

      // For vector icons, use the system font
      if (type === 'vector') {
        return 'System';
      }
    }

    return fontFamily;
  } catch (error) {
    console.warn('Platform font family resolution error:', error);
    return 'System';
  }
};

// Safe style creation with font fallbacks
export const createSafeStyles = (fontsLoaded: boolean, styleCreator: (fontsLoaded: boolean) => any) => {
  try {
    return styleCreator(fontsLoaded);
  } catch (error) {
    console.warn('Style creation error:', error);
    // Return a basic style object with system font
    return {
      text: {
        fontFamily: 'System',
        fontSize: 16,
        color: '#000000',
      },
    };
  }
}; 