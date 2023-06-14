import {Image, ImageSourcePropType} from 'react-native';
import React from 'react';

interface CustomIconProps {
  source: ImageSourcePropType;
  size?: number;
}

const CustomIcon: React.FC<CustomIconProps> = ({source, size}) => {
  return <Image source={source} style={[{width: size, height: size}]} />;
};

export default CustomIcon;
