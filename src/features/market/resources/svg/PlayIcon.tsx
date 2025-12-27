import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

export const PlayIcon: React.FC<SvgProps> = (props) => {
  const { width = 24, height = 24, stroke = '#171717', strokeWidth = 1.5, ...rest } = props;

  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" {...rest}>
      <Path
        d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
