import React, { Children, Fragment, cloneElement, isValidElement } from 'react';
import { View, ViewProps, StyleProp, ViewStyle, StyleSheet } from 'react-native';
import { cn } from '@core/utils/cn';
import { useTheme } from '@app/providers/ThemeProvider';
import { GlassContainer } from '@core/ui/GlassContainer';

export const VerticalSeparator = ({ className }: { className?: string }) => {
  const { theme } = useTheme();
  return (
    <View
      style={{ backgroundColor: theme.border }}
      className={cn('h-1/2 w-[1px] self-center', className)}
    />
  );
};

interface ButtonGroupProps extends ViewProps {
  children: React.ReactNode;
  showSeparators?: boolean;
  isGlass?: boolean;
}

interface ContainedButtonProps {
  className?: string;
  style?: StyleProp<ViewStyle>;
  variant?: string;
  rounded?: string;
  size?: string;
}

export const ButtonGroup = ({
  children,
  className,
  showSeparators = true,
  isGlass = true,
  ...props
}: ButtonGroupProps) => {
  const { theme } = useTheme();
  const arrayChildren = Children.toArray(children).filter(Boolean);

  const renderContent = () => (
    <View className="flex-row items-center justify-center">
      {arrayChildren.map((child, index) => {
        const isFirst = index === 0;
        const isLast = index === arrayChildren.length - 1;

        if (!isValidElement<ContainedButtonProps>(child)) return child;

        const modifiedChild = cloneElement(child, {
          variant: 'ghost',
          className: cn(
            child.props.className,
            'w-auto border-0',
            !isFirst && 'rounded-l-none',
            !isLast && 'rounded-r-none'
          ),
          style: [
            child.props.style,
            {
              borderWidth: 0,
              shadowOpacity: 0,
              elevation: 0,
              backgroundColor: 'transparent',
            },
          ],
          rounded: 'none',
        });

        return (
          <Fragment key={index}>
            <View className="items-center justify-center">{modifiedChild}</View>
            {!isLast && showSeparators && <VerticalSeparator />}
          </Fragment>
        );
      })}
    </View>
  );

  return (
    <View
      style={{
        borderColor: theme.border,
        borderWidth: 1,
        borderRadius: 999,
        backgroundColor: isGlass ? 'transparent' : theme.bg,
      }}
      className={cn('flex-row items-center justify-center overflow-hidden', className)}
      {...props}>
      {isGlass ? (
        <GlassContainer intensity={40} style={StyleSheet.absoluteFill}>
          {renderContent()}
        </GlassContainer>
      ) : (
        renderContent()
      )}

      {isGlass && renderContent()}
    </View>
  );
};
