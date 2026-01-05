import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

export const AddIcon: React.FC<SvgProps> = (props) => {
  const { width = 24, height = 24, stroke = 'currentColor', strokeWidth = 2, ...rest } = props;

  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...rest}>
      <Path
        d="M6 12h6m0 0h6m-6 0v6m0-6V6"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
