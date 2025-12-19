import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

export const ChevronLeft: React.FC<SvgProps> = (props) => {
  const { width = 24, height = 24, stroke = '#262626', strokeWidth = 1.6, ...rest } = props;

  return (
    <Svg width={width} height={height} viewBox="0 0 12 12" fill="none" {...rest}>
      <Path
        d="M7.354 2.146a.5.5 0 0 1 0 .708L4.207 6l3.147 3.146a.5.5 0 1 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
