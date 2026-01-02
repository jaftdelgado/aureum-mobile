import React from 'react';
import { View, Text as RNText } from 'react-native';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { AuthHeader } from '@features/auth/components/AuthHeader';
import { useTheme } from '@app/providers/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

jest.mock('@app/providers/ThemeProvider', () => ({
  useTheme: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(),
}));

jest.mock('@core/ui/Text', () => {
  const { Text } = require('react-native');
  return {
    Text: (props: any) => <Text {...props}>{props.children}</Text>,
  };
});

jest.mock('@features/settings/resources/svg/ThemeIcon', () => {
  const { View } = require('react-native');
  return {
    ThemeIcon: (props: any) => <View testID="moon-icon" {...props} />,
  };
});

jest.mock('@features/settings/resources/svg/SunIcon', () => {
  const { View } = require('react-native');
  return {
    SunIcon: (props: any) => <View testID="sun-icon" {...props} />,
  };
});

describe('AuthHeader Component', () => {
  const mockToggleTheme = jest.fn();
  const mockChangeLanguage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useSafeAreaInsets as jest.Mock).mockReturnValue({ top: 20 });
    
    (useTheme as jest.Mock).mockReturnValue({
      toggleTheme: mockToggleTheme,
      isDark: false, 
    });

    (useTranslation as jest.Mock).mockReturnValue({
      i18n: {
        language: 'en',
        changeLanguage: mockChangeLanguage,
      },
    });
  });

  it('should render correctly with safe area insets', () => {
    const { toJSON } = render(<AuthHeader />);
    
    const tree = toJSON();
    // @ts-ignore
    const style = tree.props.style;
    const flattenedStyle = Array.isArray(style) ? Object.assign({}, ...style) : style;

    expect(flattenedStyle).toEqual(expect.objectContaining({ paddingTop: 30 }));
  });

  describe('Theme Logic', () => {
    it('should show Moon icon (ThemeIcon) when in Light Mode', () => {
      (useTheme as jest.Mock).mockReturnValue({
        toggleTheme: mockToggleTheme,
        isDark: false,
      });

      render(<AuthHeader />);

      expect(screen.getByTestId('moon-icon')).toBeTruthy();
      expect(screen.queryByTestId('sun-icon')).toBeNull();
    });

    it('should show Sun icon when in Dark Mode', () => {
      (useTheme as jest.Mock).mockReturnValue({
        toggleTheme: mockToggleTheme,
        isDark: true,
      });

      render(<AuthHeader />);

      expect(screen.getByTestId('sun-icon')).toBeTruthy();
      expect(screen.queryByTestId('moon-icon')).toBeNull();
    });

    it('should call toggleTheme when theme button is pressed', () => {
      render(<AuthHeader />);
      
      const moonIcon = screen.getByTestId('moon-icon');
      const button = moonIcon.parent;
      
      fireEvent.press(button);
      expect(mockToggleTheme).toHaveBeenCalledTimes(1);
    });
  });

  describe('Language Logic', () => {
    it('should display current language', () => {
      render(<AuthHeader />);
      expect(screen.getByText('en')).toBeTruthy();
    });

    it('should switch from EN to ES', () => {
      (useTranslation as jest.Mock).mockReturnValue({
        i18n: {
          language: 'en',
          changeLanguage: mockChangeLanguage,
        },
      });

      render(<AuthHeader />);
      
      const langText = screen.getByText('en');
      const button = langText.parent; 

      fireEvent.press(button);

      expect(mockChangeLanguage).toHaveBeenCalledWith('es');
    });

    it('should switch from ES to EN', () => {
      (useTranslation as jest.Mock).mockReturnValue({
        i18n: {
          language: 'es',
          changeLanguage: mockChangeLanguage,
        },
      });

      render(<AuthHeader />);
      
      const langText = screen.getByText('es');
      const button = langText.parent; 

      fireEvent.press(button);

      expect(mockChangeLanguage).toHaveBeenCalledWith('en');
    });
  });
});