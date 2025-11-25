import * as React from 'react';
import type { ReactElement, ReactNode, FC } from 'react';
import type { SvgProps } from 'react-native-svg';
import tailwindConfig from '../../../tailwind.config.js';

interface IconWrapperProps {
  className?: string; // el nombre de la clase Tailwind
  children: ReactNode;
}

export const IconWrapper: FC<IconWrapperProps> = ({ className, children }) => {
  // Mapear la clase a la variable CSS (fallback seguro)
  const colors = tailwindConfig?.theme?.extend?.colors as Record<string, string>;
  const color = (className && colors?.[className]) ?? '#171717';

  return (
    <>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          const svgChild = child as ReactElement<SvgProps>;
          return React.cloneElement(svgChild, {
            ...svgChild.props,
            stroke: color,
            fill: svgChild.props.fill === 'none' ? 'none' : color,
          });
        }
        return child;
      })}
    </>
  );
};
