import React from 'react';
import { View } from 'react-native';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { IconButton } from '@core/ui/IconButton';
import { useThemeColor } from '@core/design/useThemeColor';
import { Icon } from '@core/ui/Icon';

jest.mock('@core/design/useThemeColor', () => ({
  useThemeColor: jest.fn(),
}));

jest.mock('@core/ui/Icon', () => {
  const { View } = require('react-native');
  return {
    Icon: jest.fn((props) => <View testID="mock-icon" {...props} />),
  };
});

jest.mock('@core/ui/GlassContainer', () => {
  const { View } = require('react-native');
  return {
    GlassContainer: jest.fn(({ children }) => <View testID="mock-glass">{children}</View>),
  };
});

const getFlattenedStyle = (style: any) => {
  if (!style) return {};
  return Array.isArray(style) ? Object.assign({}, ...style) : style;
};

describe('IconButton Component', () => {
  const MockSvg = () => <View />;
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useThemeColor as jest.Mock).mockImplementation((key) => `#${key}`);
  });

  it('should render correctly with default props', () => {
    render(<IconButton icon={MockSvg} onPress={mockOnPress} />);

    expect(screen.getByTestId('mock-icon')).toBeTruthy();
    expect(screen.queryByTestId('mock-glass')).toBeNull();
  });

  it('should handle onPress events', () => {
    render(<IconButton icon={MockSvg} onPress={mockOnPress} />);
    
    const icon = screen.getByTestId('mock-icon');
    const button = icon.parent; 
    
    fireEvent.press(button);
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('should apply disabled styles and pass disabled prop', () => {
    const { toJSON } = render(<IconButton icon={MockSvg} onPress={mockOnPress} disabled />);

    const tree = toJSON();
    // @ts-ignore
    const style = getFlattenedStyle(tree.props.style);

    expect(style).toEqual(
      expect.objectContaining({ opacity: 0.4 })
    );

    const button = screen.UNSAFE_getByProps({ disabled: true });
    expect(button).toBeTruthy();
    expect(button.props.disabled).toBe(true);
  });

  describe('Variants & Logic', () => {
    it('variant "primary" should apply correct colors', () => {
      const { toJSON } = render(<IconButton icon={MockSvg} variant="primary" />);

      const tree = toJSON();
      // @ts-ignore
      const style = getFlattenedStyle(tree.props.style);

      expect(style).toEqual(
        expect.objectContaining({ backgroundColor: '#primaryBtn' })
      );

      expect(Icon).toHaveBeenCalledWith(
        expect.objectContaining({ color: 'bg' }),
        undefined 
      );
    });

    it('variant "thirdy" should render inside GlassContainer', () => {
      const { toJSON } = render(<IconButton icon={MockSvg} variant="thirdy" />);

      expect(screen.getByTestId('mock-glass')).toBeTruthy();
      
      const tree = toJSON();
      // @ts-ignore
      const style = getFlattenedStyle(tree.props.style);

      expect(style).toEqual(
        expect.objectContaining({ 
          backgroundColor: undefined,
          borderWidth: 1
        })
      );
    });

    it('variant "secondary" should NOT render GlassContainer', () => {
      render(<IconButton icon={MockSvg} variant="secondary" />);
      expect(screen.queryByTestId('mock-glass')).toBeNull();
    });
  });

  describe('Size Logic', () => {
    it('should map size "xs" to icon size 14', () => {
      render(<IconButton icon={MockSvg} size="xs" />);

      expect(Icon).toHaveBeenCalledWith(
        expect.objectContaining({ size: 14 }),
        undefined
      );
    });

    it('should map size "md" (default) to icon size 22', () => {
      render(<IconButton icon={MockSvg} size="md" />);

      expect(Icon).toHaveBeenCalledWith(
        expect.objectContaining({ size: 22 }),
        undefined
      );
    });

    it('should map size "xl" to icon size 18', () => {
      render(<IconButton icon={MockSvg} size="xl" />);

      expect(Icon).toHaveBeenCalledWith(
        expect.objectContaining({ size: 18 }),
        undefined
      );
    });
  });
});