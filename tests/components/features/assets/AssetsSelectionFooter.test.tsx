import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AssetsSelectionFooter } from '@features/assets/components/AssetsSelectionFooter';

jest.mock('@core/ui/Button', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return {
    Button: ({ title, onPress, isLoading, disabled, testID }: any) => (
      <TouchableOpacity
        testID={testID || 'mock-button'}
        onPress={onPress}
        disabled={disabled || isLoading}
        accessibilityState={{ busy: isLoading, disabled: disabled }}>
        <Text>{title}</Text>
      </TouchableOpacity>
    ),
  };
});

const mockTheme = {
  bg: '#ffffff',
  border: '#e5e5e5',
};

jest.mock('@app/providers/ThemeProvider', () => ({
  useTheme: () => ({
    theme: mockTheme,
  }),
}));

describe('AssetsSelectionFooter', () => {
  const defaultProps = {
    title: 'Guardar',
    onPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the button with the correct title', () => {
    const { getByText } = render(<AssetsSelectionFooter {...defaultProps} />);
    expect(getByText('Guardar')).toBeTruthy();
  });

  it('should call onPress when button is pressed', () => {
    const { getByTestId } = render(<AssetsSelectionFooter {...defaultProps} />);
    const button = getByTestId('mock-button');
    fireEvent.press(button);
    expect(defaultProps.onPress).toHaveBeenCalledTimes(1);
  });

  it('should pass isLoading prop correctly to the Button', () => {
    const { getByTestId } = render(<AssetsSelectionFooter {...defaultProps} isLoading={true} />);
    const button = getByTestId('mock-button');
    expect(button.props.accessibilityState.busy).toBe(true);
  });

  it('should pass disabled prop correctly to the Button', () => {
    const { getByTestId } = render(<AssetsSelectionFooter {...defaultProps} disabled={true} />);
    const button = getByTestId('mock-button');
    expect(button.props.accessibilityState.disabled).toBe(true);
  });

  it('should apply theme styles to the container (root element)', () => {
    const { toJSON } = render(<AssetsSelectionFooter {...defaultProps} />);

    const root = toJSON() as any;
    const style = root.props.style;
    const flattenedStyle = Array.isArray(style) ? Object.assign({}, ...style) : style;

    expect(flattenedStyle).toEqual(
      expect.objectContaining({
        backgroundColor: mockTheme.bg,
        borderColor: mockTheme.border,
      })
    );
  });
});
