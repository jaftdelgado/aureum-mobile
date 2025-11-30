import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { cn } from '@core/utils/cn';
import { ImageView } from '@core/ui/ImageView';
import { Text } from '@core/ui/Text';
import { cva, type VariantProps } from 'class-variance-authority';
import { useNavigation } from '@react-navigation/native';
import type { TeamsStackParamList } from '@app/navigation/teams/TeamsNavigator';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// --- Styles ---
const cardStyles = cva('rounded-2xl overflow-hidden bg-card', {
  variants: {
    size: {
      sm: 'w-40',
      md: 'w-52',
      lg: 'w-64',
      full: 'w-full',
    },
  },
  defaultVariants: {
    size: 'sm',
  },
});

interface LastVisitedTeamCardProps extends VariantProps<typeof cardStyles> {
  image: string;
  name: string;
  onPress?: () => void;
  className?: string;
}

export function LastVisitedTeamCard({
  image,
  name,
  size,
  className,
  onPress,
}: LastVisitedTeamCardProps) {
  const navigation = useNavigation<NativeStackNavigationProp<TeamsStackParamList>>();

  const handlePress = () => {
    if (onPress) return onPress();

    // Navega sin parametros por ahora
    navigation.navigate('SelectedTeamRoot' as never);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handlePress}
      className={cn(cardStyles({ size }), className)}>
      <ImageView source={{ uri: image }} ratio="fourThree" className="rounded-none" />

      <View className="gap-1 p-3">
        <Text type="headline" weight="semibold">
          {name}
        </Text>
        <Text type="subhead" color="secondary">
          Last visited team
        </Text>
      </View>
    </TouchableOpacity>
  );
}
