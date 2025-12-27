import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

export const AddIcon: React.FC<SvgProps> = (props) => {
  const { width = 24, height = 24, stroke = '#171717', strokeWidth = 1.5, ...rest } = props;

  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...rest}>
      <Path
        d="M4 12H20M12 20V4"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
