import React from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { cn } from '@core/utils/cn';
import { Text } from '@core/ui/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import MaskedView from '@react-native-masked-view/masked-view';

type FixedHeaderProps = {
  title: string;
  scrollY: Animated.Value;
  right?: React.ReactNode;
  className?: string;
};

export default function FixedHeader({ title, scrollY, right, className }: FixedHeaderProps) {
  const insets = useSafeAreaInsets();

  // Opacidad del título pequeño
  const smallTitleOpacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  // Movimiento vertical del título pequeño
  const smallTitleTranslateY = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [20, 0],
    extrapolate: 'clamp',
  });

  return (
    <View
      className={cn('absolute left-0 right-0 top-0', className)}
      style={{ height: 60 + insets.top, zIndex: 1 }}>
      <MaskedView
        style={StyleSheet.absoluteFillObject}
        maskElement={
          <LinearGradient
            colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0.9)', 'rgba(255,255,255,0)']}
            locations={[0, 0.6, 1]}
            style={StyleSheet.absoluteFillObject}
          />
        }>
        <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFillObject} />
      </MaskedView>

      <View
        className="absolute left-0 right-0 justify-center px-4"
        style={{ paddingTop: insets.top, height: 90 }}>
        <Animated.Text
          className="text-center text-xl font-semibold text-black"
          style={{
            opacity: smallTitleOpacity,
            transform: [{ translateY: smallTitleTranslateY }],
          }}>
          {title}
        </Animated.Text>

        {right && <View className="absolute right-4">{right}</View>}
      </View>
    </View>
  );
}
