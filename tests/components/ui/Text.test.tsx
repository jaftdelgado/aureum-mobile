import React from 'react';
import { Text as RNText } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { Text } from '@core/ui/Text';
import { useTheme } from '@app/providers/ThemeProvider';

jest.mock('@app/providers/ThemeProvider', () => ({
  useTheme: jest.fn(),
}));

const getFlattenedStyle = (style: any) => {
  if (!style) return {};
  return Array.isArray(style) ? Object.assign({}, ...style) : style;
};

describe('Text Component', () => {
  const mockTheme = {
    primaryText: '#000000',
    secondaryText: '#666666',
    success: '#00ff00',
    warning: '#ffa500',
    error: '#ff0000',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useTheme as jest.Mock).mockReturnValue({ theme: mockTheme });
  });

  it('should render children correctly', () => {
    render(<Text>Hello World</Text>);
    expect(screen.getByText('Hello World')).toBeTruthy();
  });

  describe('Color Mapping Logic', () => {
    it('should use "default" color (primaryText) if no color prop is provided', () => {
      const { toJSON } = render(<Text>Default Color</Text>);
      
      const tree = toJSON();
      // @ts-ignore
      const style = getFlattenedStyle(tree.props.style);

      expect(style).toEqual(expect.objectContaining({ color: mockTheme.primaryText }));
    });

    it('should map "secondary" color correctly', () => {
      const { toJSON } = render(<Text color="secondary">Secondary</Text>);
      
      const tree = toJSON();
      // @ts-ignore
      const style = getFlattenedStyle(tree.props.style);

      expect(style).toEqual(expect.objectContaining({ color: mockTheme.secondaryText }));
    });

    it('should map "error" color correctly', () => {
      const { toJSON } = render(<Text color="error">Error</Text>);
      
      const tree = toJSON();
      // @ts-ignore
      const style = getFlattenedStyle(tree.props.style);

      expect(style).toEqual(expect.objectContaining({ color: mockTheme.error }));
    });

  });

  describe('Variants (CVA Classes)', () => {

    it('should apply correct typography classes', () => {
      const { toJSON } = render(<Text type="title1">Title</Text>);
      
      const tree = toJSON();
      // @ts-ignore
      const className = tree.props.className;

      expect(className).toContain('text-title1');
    });

    it('should apply correct weight classes', () => {
      const { toJSON } = render(<Text weight="bold">Bold Text</Text>);
      
      const tree = toJSON();
      // @ts-ignore
      const className = tree.props.className;

      expect(className).toContain('font-bold');
    });

    it('should apply correct align classes', () => {
      const { toJSON } = render(<Text align="center">Centered</Text>);
      
      const tree = toJSON();
      // @ts-ignore
      const className = tree.props.className;

      expect(className).toContain('text-center');
    });
  });

  describe('Overrides & Customization', () => {
    it('should accept custom className', () => {
      const { toJSON } = render(<Text className="mt-4 opacity-50">Custom</Text>);
      
      const tree = toJSON();
      // @ts-ignore
      const className = tree.props.className;

      expect(className).toContain('mt-4');
      expect(className).toContain('opacity-50');
    });

    it('should allow overriding color via style prop', () => {
      const { toJSON } = render(
        <Text color="error" style={{ color: 'blue' }}>
          Override
        </Text>
      );
      
      const tree = toJSON();
      // @ts-ignore
      const style = getFlattenedStyle(tree.props.style);

      expect(style).toEqual(expect.objectContaining({ color: 'blue' }));
    });

    it('should pass standard TextProps like numberOfLines', () => {
      render(<Text numberOfLines={2}>Long text</Text>);
      
      const textComponent = screen.UNSAFE_getByType(RNText);
      expect(textComponent.props.numberOfLines).toBe(2);
    });
  });
});