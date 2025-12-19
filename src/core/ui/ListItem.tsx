import React, { ReactNode } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { cn } from '@core/utils/cn';
import { useTheme } from '@app/providers/ThemeProvider';
import { Text } from '@core/ui/Text'; // Tu componente Text personalizado

type SwipeAction = {
  label: string;
  onPress: () => void;
  color?: string;
  textColor?: string;
  width?: number;
};

interface ListItemProps {
  children: ReactNode;
  onPress?: () => void;
  swipeLeftActions?: SwipeAction[];
  swipeRightActions?: SwipeAction[];
  className?: string;
}

export const ListItem = ({
  children,
  onPress,
  swipeLeftActions,
  swipeRightActions,
  className,
}: ListItemProps) => {
  const { theme, isDark } = useTheme();

  const renderActions = (actions?: SwipeAction[]) => {
    if (!actions || actions.length === 0) return undefined;

    return (
      <View style={styles.actionsContainer}>
        {actions.map((action, idx) => (
          <Pressable
            key={idx}
            onPress={action.onPress}
            style={{
              width: action.width ?? 80,
              backgroundColor: action.color ?? (isDark ? theme.secondaryBtn : theme.secondary),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {/* Usamos tu componente Text con peso semibold para las acciones */}
            <Text weight="semibold" style={{ color: action.textColor ?? theme.white }}>
              {action.label}
            </Text>
          </Pressable>
        ))}
      </View>
    );
  };

  return (
    <Swipeable
      overshootLeft={false}
      overshootRight={false}
      renderLeftActions={() => renderActions(swipeLeftActions)}
      renderRightActions={() => renderActions(swipeRightActions)}
      enabled={(swipeLeftActions?.length ?? 0) > 0 || (swipeRightActions?.length ?? 0) > 0}
      // Opcional: Color de fondo del contenedor del swipe para evitar saltos de color
      containerStyle={{ backgroundColor: theme.bg }}>
      <Pressable
        onPress={onPress}
        // Usamos style para el color de borde y el efecto active dinámico
        style={({ pressed }) => [
          {
            backgroundColor: pressed
              ? isDark
                ? '#1f2937'
                : '#f3f4f6' // Simula un active:bg dinámico
              : theme.bg,
            borderBottomColor: theme.border,
            borderBottomWidth: 1,
          },
        ]}
        className={cn('px-4 py-4', className)}>
        {children}
      </Pressable>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  actionsContainer: {
    height: '100%',
    flexDirection: 'row',
  },
});
