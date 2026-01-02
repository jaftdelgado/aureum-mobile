import React from 'react';
import { View } from 'react-native';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { Button } from '@core/ui/Button';

jest.mock('@app/providers/ThemeProvider', () => ({
  useTheme: jest.fn(() => ({
    theme: {
      primaryBtn: '#007AFF',
      secondaryBtn: '#E5E5EA',
      bg: '#FFFFFF',
      primaryText: '#000000',
      border: '#C7C7CC',
    },
  })),
}));

describe('Button Component', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the title correctly', () => {
    render(<Button title="Click Me" onPress={mockOnPress} />);
    expect(screen.getByText('Click Me')).toBeTruthy();
  });

  it('should call onPress when clicked', () => {
    render(<Button title="Press" onPress={mockOnPress} />);
    const button = screen.getByText('Press');
    
    fireEvent.press(button);
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('should not call onPress when disabled', () => {
    render(<Button title="Disabled" onPress={mockOnPress} disabled />);
    const button = screen.getByText('Disabled');

    fireEvent.press(button);
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('should render loading state correctly', () => {
    render(<Button title="Loading" onPress={mockOnPress} loading />);

    expect(screen.queryByText('Loading')).toBeNull();
    
    const spinner = screen.UNSAFE_getByType(require('react-native').ActivityIndicator);
    expect(spinner).toBeTruthy();
  });

  it('should pass disabled prop when loading', () => {
    render(<Button title="Loading" onPress={mockOnPress} loading />);

    const disabledElement = screen.UNSAFE_getByProps({ disabled: true });
    expect(disabledElement).toBeTruthy();
  });

  it('should render left icon when provided', () => {
    const TestIcon = <View testID="test-icon" />;
    render(<Button title="With Icon" leftIcon={TestIcon} />);
    
    expect(screen.getByTestId('test-icon')).toBeTruthy();
    expect(screen.getByText('With Icon')).toBeTruthy();
  });

  it('should apply primary variant styles correctly', () => {
    const { getByText } = render(<Button title="Primary" variant="primary" />);
    
    const textComponent = getByText('Primary');
    const style = textComponent.props.style;
    
    const flattenedStyle = Array.isArray(style) ? Object.assign({}, ...style) : style;

    expect(flattenedStyle).toEqual(
      expect.objectContaining({ color: '#FFFFFF' })
    );
  });

  it('should apply outline variant styles correctly', () => {
    const { getByText } = render(<Button title="Outline" variant="outline" />);
    
    const textComponent = getByText('Outline');
    const style = textComponent.props.style;

    const flattenedStyle = Array.isArray(style) ? Object.assign({}, ...style) : style;

    expect(flattenedStyle).toEqual(
      expect.objectContaining({ color: '#000000' })
    );
  });

  it('should apply custom styles via style prop', () => {

    const { toJSON } = render(<Button title="Custom" style={{ marginTop: 20 }} />);
    
    const tree = toJSON();
    // @ts-ignore
    const rootStyle = tree.props.style;
    const flattenedRootStyle = Array.isArray(rootStyle) ? Object.assign({}, ...rootStyle) : rootStyle;

    expect(flattenedRootStyle).toEqual(
      expect.objectContaining({ marginTop: 20 })
    );
  });
});