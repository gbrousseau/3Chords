import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface FallbackIconProps {
  name: string;
  size?: number;
  color?: string;
}

export const FallbackIcon: React.FC<FallbackIconProps> = ({ 
  name, 
  size = 24, 
  color = '#000' 
}) => {
  // Use first letter of icon name as fallback
  const letter = name.charAt(0).toUpperCase();

  return (
    <View style={[
      styles.container, 
      { 
        width: size, 
        height: size, 
        borderRadius: size / 2,
        backgroundColor: color + '20' // Add 20% opacity
      }
    ]}>
      <Text style={[
        styles.text, 
        { 
          color, 
          fontSize: size * 0.5 
        }
      ]}>
        {letter}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
  },
});

export default FallbackIcon; 