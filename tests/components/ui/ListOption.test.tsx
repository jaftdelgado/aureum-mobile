import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { ListOption } from '@core/ui/ListOption';
import { IconContainer } from '@core/ui/IconContainer';
import { useThemeColor } from '@core/design/useThemeColor';

jest.mock('@core/design/useThemeColor', () => ({
  useThemeColor: jest.fn(),
}));

jest.mock('@core/ui/Icon', () => {
  const { View } = require('react-native');
  return {
    Icon: jest.fn((props) => <View testID="mock-chevron" {...props} />),
  };
});

jest.mock('@core/ui/IconContainer', () => {
  const { View } = require('react-native');
  return {
    IconContainer: jest.fn((props) => <View testID="mock-icon-container" {...props} />),
  };
});

jest.mock('@core/ui/Text', () => {
  const { Text } = require('react-native');
  return {
    Text: (props: any) => <Text {...props}>{props.children}</Text>,
  };
});

const MockSvg = () => <View />;

const getFlattenedStyle = (style: any) => {
  if (!style) return {};
  return Array.isArray(style) ? Object.assign({}, ...style) : style;
};

describe('ListOption Component', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useThemeColor as jest.Mock).mockReturnValue('#border-color');
  });

  describe('Text Rendering', () => {
    it('should render string text correctly', () => {
      render(<ListOption text="Hello Option" />);
      expect(screen.getByText('Hello Option')).toBeTruthy();
    });

    it('should render ReactNode text correctly', () => {
      const CustomText = <View testID="custom-text" />;
      render(<ListOption text={CustomText} />);
      expect(screen.getByTestId('custom-text')).toBeTruthy();
    });
  });

  describe('Icon Rendering Logic', () => {
    it('should render empty placeholder if no icon provided', () => {
      render(<ListOption text="Test" containerSize={40} />);

      expect(screen.UNSAFE_queryByType(Image)).toBeNull();
      expect(screen.queryByTestId('mock-icon-container')).toBeNull();
    });

    it('should render Image if icon is a string (URL)', () => {
      const imageUrl = 'https://example.com/pic.png';
      render(<ListOption text="Test" icon={imageUrl} />);

      const image = screen.UNSAFE_getByType(Image);
      expect(image.props.source).toEqual({ uri: imageUrl });
      expect(image.props.resizeMode).toBe('cover');
    });

    it('should render React Element if icon is a valid element', () => {
      const CustomIcon = <View testID="custom-icon-element" />;
      render(<ListOption text="Test" icon={CustomIcon} />);

      expect(screen.getByTestId('custom-icon-element')).toBeTruthy();
      expect(screen.queryByTestId('mock-icon-container')).toBeNull();
    });

    it('should render IconContainer if icon is an SVG component/function', () => {
      render(
        <ListOption 
          text="Test" 
          icon={MockSvg} 
          iconVariant="blue" 
          iconSize={20} 
          containerSize={50} 
        />
      );

      expect(screen.getByTestId('mock-icon-container')).toBeTruthy();
      
      expect(IconContainer).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: MockSvg,
          variant: 'blue',
          size: 50,
          iconSize: 20
        }),
        undefined 
      );
    });
  });

  describe('Styling & Layout', () => {
    it('should show border bottom by default (isLast=false)', () => {
      const { toJSON } = render(<ListOption text="Test" />);
      
      const tree = toJSON();
      // @ts-ignore
      const style = getFlattenedStyle(tree.props.style);

      expect(style).toEqual(expect.objectContaining({
        borderBottomWidth: 1,
        borderBottomColor: '#border-color'
      }));
    });

    it('should remove border bottom when isLast=true', () => {
      const { toJSON } = render(<ListOption text="Test" isLast />);
      
      const tree = toJSON();
      // @ts-ignore
      const style = getFlattenedStyle(tree.props.style);

      expect(style.borderBottomWidth).toBeUndefined();
    });
  });

  describe('Chevron & Interaction', () => {
    it('should render chevron by default', () => {
      render(<ListOption text="Test" />);
      expect(screen.getByTestId('mock-chevron')).toBeTruthy();
    });

    it('should hide chevron when showChevron=false', () => {
      render(<ListOption text="Test" showChevron={false} />);
      expect(screen.queryByTestId('mock-chevron')).toBeNull();
    });

    it('should handle onPress', () => {
      render(<ListOption text="Press Me" onPress={mockOnPress} />);
      
      const touchable = screen.UNSAFE_getByType(TouchableOpacity);

      fireEvent.press(touchable);
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });
  });
});