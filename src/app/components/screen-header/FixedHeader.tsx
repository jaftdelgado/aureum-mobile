import React from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { cn } from '@core/utils/cn';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import MaskedView from '@react-native-masked-view/masked-view';

import { useTheme } from '@app/providers/ThemeProvider';
import { IconButton } from '@core/ui/IconButton';
import { ChevronLeft } from '@resources/svg/general/ChevronLeft';
import { Text } from '@core/ui/Text';

const AnimatedText = Animated.createAnimatedComponent(Text);

const HEADER_HEIGHT = 44;

type FixedHeaderProps = {
  title: string;
  scrollY: Animated.Value;
  right?: React.ReactNode;
  onBack?: () => void;
  className?: string;
};

export default function FixedHeader({
  title,
  scrollY,
  right,
  onBack,
  className,
}: FixedHeaderProps) {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();

  const smallTitleOpacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const smallTitleTranslateY = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [10, 0],
    extrapolate: 'clamp',
  });

  return (
    <View
      className={cn('absolute left-0 right-0 top-0', className)}
      style={{
        height: HEADER_HEIGHT + insets.top,
        zIndex: 10,
        paddingTop: insets.top,
      }}>
      <MaskedView
        style={StyleSheet.absoluteFillObject}
        maskElement={
          <LinearGradient
            colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,0)']}
            locations={[0, 0.6, 1]}
            style={StyleSheet.absoluteFillObject}
          />
        }>
        <BlurView
          intensity={40}
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: theme.bg }]} />
      </MaskedView>

      <View className="flex-row items-center justify-center px-4" style={{ height: HEADER_HEIGHT }}>
        {onBack && (
          <View className="absolute left-4">
            <IconButton
              icon={ChevronLeft}
              onPress={onBack}
              variant="thirdy"
              size="md"
              className="rounded-full"
            />
          </View>
        )}

        {/* Título animado usando tu componente Text */}
        <AnimatedText
          type="headline"
          weight="semibold"
          numberOfLines={1}
          style={{
            opacity: smallTitleOpacity,
            transform: [{ translateY: smallTitleTranslateY }],
          }}>
          {title}
        </AnimatedText>

        {right && <View className="absolute right-4">{right}</View>}
      </View>
    </View>
  );
}
