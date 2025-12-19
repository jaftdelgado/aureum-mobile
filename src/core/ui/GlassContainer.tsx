import React from 'react';
import { View, StyleSheet, ViewStyle, Platform, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@app/providers/ThemeProvider';

interface GlassContainerProps {
  children: React.ReactNode;
  intensity?: number;
  style?: StyleProp<ViewStyle>;
  tint?: 'light' | 'dark' | 'default' | 'extraLight';
}

export const GlassContainer: React.FC<GlassContainerProps> = ({
  children,
  intensity = 50,
  style,
  tint,
}) => {
  const { theme, isDark } = useTheme();

  const activeTint = tint ?? (isDark ? 'dark' : 'light');

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: Platform.OS === 'android' ? theme.glassTint : 'transparent',
        },
        style,
      ]}>
      <BlurView intensity={intensity} tint={activeTint} style={StyleSheet.absoluteFill} />

      <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.glassTint }]} />

      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
