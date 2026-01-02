import React from 'react';
import { View } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { Icon } from '@core/ui/Icon';
import { useThemeColor } from '@core/design/useThemeColor';

jest.mock('@core/design/useThemeColor', () => ({
  useThemeColor: jest.fn(),
}));

describe('Icon Component', () => {
  const MockSvgComponent = jest.fn((props) => <View testID="mock-svg" {...props} />);

  beforeEach(() => {
    jest.clearAllMocks();
    
    (useThemeColor as jest.Mock).mockImplementation((key) => {
      const colors: Record<string, string> = {
        primaryText: '#000000',
        primary: '#BLUE',
        error: '#RED',
      };
      return colors[key] || '#TRANSPARENT';
    });
  });

  it('should render the passed component', () => {
    render(<Icon component={MockSvgComponent} />);
    
    expect(screen.getByTestId('mock-svg')).toBeTruthy();
  });

  it('should use default props (size=24, strokeWidth=1.6, color=primaryText)', () => {
    render(<Icon component={MockSvgComponent} />);

    expect(MockSvgComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        width: 24,
        height: 24,
        strokeWidth: 1.6,
        stroke: '#000000',
        fill: 'none',
      }),
      undefined
    );

    expect(useThemeColor).toHaveBeenCalledWith('primaryText');
  });

  it('should apply custom size', () => {
    render(<Icon component={MockSvgComponent} size={48} />);

    expect(MockSvgComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        width: 48,
        height: 48,
      }),
      undefined
    );
  });

  it('should apply custom strokeWidth', () => {
    render(<Icon component={MockSvgComponent} strokeWidth={2.5} />);

    expect(MockSvgComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        strokeWidth: 2.5,
      }),
      undefined
    );
  });

  it('should resolve and apply custom color', () => {
    render(<Icon component={MockSvgComponent} color="error" />);

    expect(useThemeColor).toHaveBeenCalledWith('error');

    expect(MockSvgComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        stroke: '#RED',
      }),
      undefined
    );
  });
});