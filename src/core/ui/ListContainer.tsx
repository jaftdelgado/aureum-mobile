import React, { ReactNode, Children, isValidElement, cloneElement, ReactElement } from 'react';
import { View, ViewProps } from 'react-native';
import { cn } from '@core/utils/cn';
import { ListOption, ListOptionProps } from '@core/ui/ListOption';
import { useTheme } from '@app/providers/ThemeProvider';

interface ListContainerProps extends ViewProps {
  children: ReactNode;
  className?: string;
}

export const ListContainer: React.FC<ListContainerProps> = ({
  children,
  className,
  style,
  ...props
}) => {
  const { theme } = useTheme();
  const childrenArray = Children.toArray(children);

  const clonedChildren = childrenArray.map((child, index) => {
    if (isValidElement<ListOptionProps>(child) && child.type === ListOption) {
      return cloneElement<ListOptionProps>(child as ReactElement<ListOptionProps>, {
        isLast: index === childrenArray.length - 1,
      });
    }
    return child;
  });

  return (
    <View
      {...props}
      className={cn('overflow-hidden rounded-2xl border', className)}
      style={[
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
        style,
      ]}>
      {clonedChildren}
    </View>
  );
};
