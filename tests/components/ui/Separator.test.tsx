import React from 'react';
import { render } from '@testing-library/react-native';
import { Separator } from '@core/ui/Separator';
import { useTheme } from '@app/providers/ThemeProvider';

jest.mock('@app/providers/ThemeProvider', () => ({
  useTheme: jest.fn(),
}));

const getFlattenedStyle = (style: any) => {
  if (!style) return {};
  return Array.isArray(style) ? Object.assign({}, ...style) : style;
};

describe('Separator Component', () => {
  const mockTheme = {
    border: '#cccccc', 
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useTheme as jest.Mock).mockReturnValue({ theme: mockTheme });
  });

  it('should apply the correct background color from theme', () => {
    const { toJSON } = render(<Separator />);

    const tree = toJSON();
    // @ts-ignore
    const style = getFlattenedStyle(tree.props.style);

    expect(style).toEqual(
      expect.objectContaining({
        backgroundColor: mockTheme.border,
      })
    );
  });

  it('should include base tailwind classes (h-[1px] w-full)', () => {
    const { toJSON } = render(<Separator />);
    
    const tree = toJSON();
    // @ts-ignore
    const className = tree.props.className;

    expect(className).toContain('h-[1px]');
    expect(className).toContain('w-full');
  });

  it('should accept and append custom className', () => {
    const { toJSON } = render(<Separator className="my-4 opacity-50" />);

    const tree = toJSON();
    // @ts-ignore
    const className = tree.props.className;
    expect(className).toContain('my-4');
    expect(className).toContain('opacity-50');
  });
});