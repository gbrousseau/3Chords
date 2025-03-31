import React, { useState } from 'react';
import * as ExpoIcons from '@expo/vector-icons';
import FallbackIcon from './FallbackIcon';

interface IconProps {
  family: keyof typeof ExpoIcons;
  name: string;
  size?: number;
  color?: string;
}

export const Icon: React.FC<IconProps> = ({ 
  family, 
  name, 
  size = 24, 
  color = '#000' 
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <FallbackIcon name={name} size={size} color={color} />;
  }

  const IconComponent = ExpoIcons[family];
  
  try {
    return (
      <IconComponent 
        name={name as any} 
        size={size} 
        color={color} 
        onError={() => setHasError(true)}
      />
    );
  } catch (error) {
    console.warn(`Failed to load ${family} icon: ${name}`, error);
    return <FallbackIcon name={name} size={size} color={color} />;
  }
};

export default Icon; 