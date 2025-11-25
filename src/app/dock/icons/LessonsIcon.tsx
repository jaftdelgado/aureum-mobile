import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface LessonsIconProps {
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
}

export const LessonsIcon: React.FC<LessonsIconProps> = ({
  width = 24,
  height = 24,
  color = '#171717',
  strokeWidth = 1.6,
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15.5 7h-7m3.999 4h-4M20 22H6a2 2 0 0 1-2-2m0 0a2 2 0 0 1 2-2h14V6c0-1.886 0-2.828-.586-3.414S17.886 2 16 2h-6c-2.828 0-4.243 0-5.121.879C4 3.757 4 5.172 4 8z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M19.5 18s-1 .763-1 2s1 2 1 2"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
