import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

export const SuccessIcon: React.FC<SvgProps> = (props) => {
  const { width = 24, height = 24, stroke = 'currentColor', strokeWidth = 2, ...rest } = props;

  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...rest}>
      <Path
        d="m6 12l4.243 4.243l8.484-8.486"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
