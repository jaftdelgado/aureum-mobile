import React from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { GoogleSignIn } from '@features/auth/components/GoogleSignIn';
import { useGoogleSignIn } from '@features/auth/hooks/useGoogleSignIn';
import { useTheme } from '@app/providers/ThemeProvider';

jest.mock('@features/auth/hooks/useGoogleSignIn', () => ({
  useGoogleSignIn: jest.fn(),
}));

jest.mock('@app/providers/ThemeProvider', () => ({
  useTheme: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('@resources/svg/GoogleLogo', () => {
  const { View } = require('react-native');
  return {
    GoogleLogo: () => <View testID="google-logo" />,
  };
});

jest.mock('@core/ui/Text', () => {
  const { Text } = require('react-native');
  return {
    Text: ({ children, ...props }: any) => <Text {...props}>{children}</Text>,
  };
});

const getFlattenedStyle = (style: any) => {
  if (!style) return {};
  return Array.isArray(style) ? Object.assign({}, ...style) : style;
};

describe('GoogleSignIn Component', () => {
  const mockHandleLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useGoogleSignIn as jest.Mock).mockReturnValue({
      handleGoogleLogin: mockHandleLogin,
      loading: false,
    });

    (useTheme as jest.Mock).mockReturnValue({
      isDark: false,
    });
  });

  it('should render correctly in idle state', () => {
    render(<GoogleSignIn />);

    expect(screen.getByTestId('google-logo')).toBeTruthy();
    expect(screen.getByText('signin.google')).toBeTruthy();
    expect(screen.UNSAFE_queryByType(ActivityIndicator)).toBeNull();
  });

  it('should call handleGoogleLogin when pressed', () => {
    render(<GoogleSignIn />);

    const button = screen.UNSAFE_getByType(TouchableOpacity);
    fireEvent.press(button);

    expect(mockHandleLogin).toHaveBeenCalledTimes(1);
  });

  describe('Loading State', () => {
    beforeEach(() => {
      (useGoogleSignIn as jest.Mock).mockReturnValue({
        handleGoogleLogin: mockHandleLogin,
        loading: true, 
      });
    });

    it('should show ActivityIndicator and hide content', () => {
      render(<GoogleSignIn />);

      expect(screen.UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
      expect(screen.queryByTestId('google-logo')).toBeNull();
      expect(screen.queryByText('signin.google')).toBeNull();
    });

    it('should disable the button when loading', () => {
      render(<GoogleSignIn />);

      const button = screen.UNSAFE_getByType(TouchableOpacity);
      expect(button.props.disabled).toBe(true);
    });

    it('should apply opacity style when loading', () => {
      const { toJSON } = render(<GoogleSignIn />);
      
      const tree = toJSON();
      // @ts-ignore
      const style = getFlattenedStyle(tree.props.style);

      expect(style).toEqual(expect.objectContaining({ opacity: 0.5 }));
    });
  });

  describe('Theming', () => {
    it('should use black spinner in Light Mode', () => {
      (useTheme as jest.Mock).mockReturnValue({ isDark: false });
      (useGoogleSignIn as jest.Mock).mockReturnValue({ loading: true });

      render(<GoogleSignIn />);

      const spinner = screen.UNSAFE_getByType(ActivityIndicator);
      expect(spinner.props.color).toBe('#000000');
    });

    it('should use white spinner in Dark Mode', () => {
      (useTheme as jest.Mock).mockReturnValue({ isDark: true });
      (useGoogleSignIn as jest.Mock).mockReturnValue({ loading: true });

      render(<GoogleSignIn />);

      const spinner = screen.UNSAFE_getByType(ActivityIndicator);
      expect(spinner.props.color).toBe('#FFFFFF');
    });
  });
});