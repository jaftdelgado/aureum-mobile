import React, { FC, ReactNode, Children, isValidElement, cloneElement, ReactElement } from 'react';
import { View, ViewProps } from 'react-native';
import { cn } from '@core/utils/cn';
import { ListOption, ListOptionProps } from '@core/ui/ListOption';
import { useTheme } from '@app/providers/ThemeProvider';
import { Text } from '@core/ui/Text';

interface ListContainerProps extends ViewProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export const ListContainer: FC<ListContainerProps> = ({
  children,
  title,
  description,
  className,
  style,
  ...props
}) => {
  const { theme } = useTheme();
  const childrenArray = Children.toArray(children).filter(Boolean);

  const clonedChildren = childrenArray.map((child, index) => {
    if (isValidElement<ListOptionProps>(child) && child.type === ListOption) {
      return cloneElement<ListOptionProps>(child as ReactElement<ListOptionProps>, {
        isLast: index === childrenArray.length - 1,
      });
    }
    return child;
  });

  return (
    <View className={cn('gap-2', className)}>
      {title && (
        <View className="px-4">
          <Text type="footnote" weight="medium" className="mb-1 uppercase">
            {title}
          </Text>
        </View>
      )}

      <View
        {...props}
        className="overflow-hidden rounded-2xl border"
        style={[
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
          style,
        ]}>
        {clonedChildren}
      </View>

      {description && (
        <View className="px-4">
          <Text type="caption1" color="secondary" className="mt-1">
            {description}
          </Text>
        </View>
      )}
    </View>
  );
};
