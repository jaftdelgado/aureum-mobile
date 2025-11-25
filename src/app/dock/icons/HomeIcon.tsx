import React from 'react';
import { Path, Svg } from 'react-native-svg';
import tailwindConfig from '../../../../tailwind.config.js'; // Ajusta la ruta

interface HomeIconProps {
  width?: number;
  height?: number;
  color?: string; // Puede ser nombre de Tailwind o hex
  strokeWidth?: number;
}

export const HomeIcon: React.FC<HomeIconProps> = ({
  width = 24,
  height = 24,
  color = 'primary', // Valor por defecto
  strokeWidth = 1.6,
}) => {
  // Resolvemos el color usando encadenamiento opcional y fallback
  const resolvedColor =
    (tailwindConfig?.theme?.extend?.colors as Record<string, string>)?.[color] ??
    color ??
    '#171717';

  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 11.99v2.51c0 3.3 0 4.95 1.025 5.975S6.7 21.5 10 21.5h4c3.3 0 4.95 0 5.975-1.025S21 17.8 21 14.5v-2.51c0-1.682 0-2.522-.356-3.25s-1.02-1.244-2.346-2.276l-2-1.555C14.233 3.303 13.2 2.5 12 2.5s-2.233.803-4.298 2.409l-2 1.555C4.375 7.496 3.712 8.012 3.356 8.74S3 10.308 3 11.99Z"
        stroke={resolvedColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15 17c-.8.622-1.85 1-3 1s-2.2-.378-3-1"
        stroke={resolvedColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
