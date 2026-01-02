import React from 'react';
import { View, Platform } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { GlassContainer } from '@core/ui/GlassContainer';
import { useTheme } from '@app/providers/ThemeProvider';

jest.mock('@app/providers/ThemeProvider', () => ({
  useTheme: jest.fn(),
}));

jest.mock('expo-blur', () => {
  const { View } = require('react-native');
  return {
    BlurView: jest.fn((props) => <View testID="mock-blur-view" {...props} />),
  };
});

describe('GlassContainer Component', () => {
  const mockTheme = {
    glassTint: 'rgba(255, 255, 255, 0.1)',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    (useTheme as jest.Mock).mockReturnValue({
      theme: mockTheme,
      isDark: false,
    });
    
    Platform.OS = 'ios';
  });

  it('should render children correctly', () => {
    render(
      <GlassContainer>
        <View testID="child-view" />
      </GlassContainer>
    );

    expect(screen.getByTestId('child-view')).toBeTruthy();
  });

  describe('Theme & Tint Logic', () => {
    it('should use "light" tint by default when isDark is false', () => {
      (useTheme as jest.Mock).mockReturnValue({ theme: mockTheme, isDark: false });

      render(
        <GlassContainer>
          <View />
        </GlassContainer>
      );

      const blurView = screen.getByTestId('mock-blur-view');
      expect(blurView.props.tint).toBe('light');
    });

    it('should use "dark" tint when isDark is true', () => {
      (useTheme as jest.Mock).mockReturnValue({ theme: mockTheme, isDark: true });

      render(
        <GlassContainer>
          <View />
        </GlassContainer>
      );

      const blurView = screen.getByTestId('mock-blur-view');
      expect(blurView.props.tint).toBe('dark');
    });

    it('should override theme tint if explicit tint prop is provided', () => {
      (useTheme as jest.Mock).mockReturnValue({ theme: mockTheme, isDark: true });

      render(
        <GlassContainer tint="extraLight">
          <View />
        </GlassContainer>
      );

      const blurView = screen.getByTestId('mock-blur-view');
      expect(blurView.props.tint).toBe('extraLight');
    });

    it('should pass intensity prop to BlurView (default 50)', () => {
      render(
        <GlassContainer intensity={80}>
          <View />
        </GlassContainer>
      );

      const blurView = screen.getByTestId('mock-blur-view');
      expect(blurView.props.intensity).toBe(80);
    });
  });

  describe('Platform Specific Behavior', () => {
    it('should have transparent background on iOS', () => {
      Platform.OS = 'ios';

      const { toJSON } = render(
        <GlassContainer>
          <View />
        </GlassContainer>
      );

      const tree = toJSON();
      // @ts-ignore
      const style = tree.props.style;
      const flattenedStyle = Array.isArray(style) ? Object.assign({}, ...style) : style;

      expect(flattenedStyle).toEqual(
        expect.objectContaining({ backgroundColor: 'transparent' })
      );
    });

    it('should have theme glassTint background on Android', () => {
      Platform.OS = 'android';

      const { toJSON } = render(
        <GlassContainer>
          <View />
        </GlassContainer>
      );

      const tree = toJSON();
      // @ts-ignore
      const style = tree.props.style;
      const flattenedStyle = Array.isArray(style) ? Object.assign({}, ...style) : style;

      expect(flattenedStyle).toEqual(
        expect.objectContaining({ backgroundColor: mockTheme.glassTint })
      );
    });
  });
});