import React from 'react';
import { TextInput, View, Text as RNText } from 'react-native';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { TextField } from '@core/ui/TextField';
import { useTheme } from '@app/providers/ThemeProvider';

jest.mock('@app/providers/ThemeProvider', () => ({
  useTheme: jest.fn(),
}));

jest.mock('@core/ui/Text', () => {
  const { Text } = require('react-native');
  return {
    Text: ({ children, ...props }: any) => <Text {...props}>{children}</Text>,
  };
});

describe('TextField Component', () => {
  const mockOnChangeText = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useTheme as jest.Mock).mockReturnValue({ isDark: false });
  });

  it('should render correctly with label and placeholder', () => {
    render(
      <TextField 
        label="Username" 
        placeholder="Enter your name" 
        testID="text-field"
      />
    );

    expect(screen.getByText('Username')).toBeTruthy();
    expect(screen.getByPlaceholderText('Enter your name')).toBeTruthy();
  });

  it('should handle text input changes', () => {
    render(
      <TextField 
        placeholder="Type here" 
        onChangeText={mockOnChangeText} 
      />
    );

    const input = screen.getByPlaceholderText('Type here');
    fireEvent.changeText(input, 'Hello World');

    expect(mockOnChangeText).toHaveBeenCalledWith('Hello World');
  });

  it('should render helper text when provided', () => {
    render(<TextField helperText="This is a hint" />);
    expect(screen.getByText('This is a hint')).toBeTruthy();
  });

  describe('Error Handling', () => {
    it('should display error text when errorText is provided', () => {
      render(<TextField errorText="Invalid input" />);
      expect(screen.getByText('Invalid input')).toBeTruthy();
    });

    it('should prioritize errorText over helperText', () => {
      render(
        <TextField 
          helperText="Helper" 
          errorText="Error Message" 
        />
      );

      expect(screen.getByText('Error Message')).toBeTruthy();
      expect(screen.queryByText('Helper')).toBeNull();
    });

    it('should apply error styles when error={true}', () => {
      render(<TextField error placeholder="Error Input" />);

      const textInput = screen.UNSAFE_getByType(TextInput);

      const inputContainer = textInput.parent; 
      
      expect(inputContainer?.props.className).toContain('border-error');
    });
  });

  describe('Disabled State', () => {
    it('should disable the input and apply styles', () => {
      render(<TextField disabled placeholder="Disabled Input" />);

      const textInputComponent = screen.UNSAFE_getByType(TextInput);

      expect(textInputComponent.props.editable).toBe(false);

      const inputContainer = textInputComponent.parent;
      expect(inputContainer?.props.className).toContain('opacity-50');
    });
  });

  describe('Slots (Left & Right)', () => {
    it('should render left and right elements', () => {
      const LeftIcon = <RNText>⬅️</RNText>;
      const RightIcon = <RNText>➡️</RNText>;

      render(<TextField left={LeftIcon} right={RightIcon} />);

      expect(screen.getByText('⬅️')).toBeTruthy();
      expect(screen.getByText('➡️')).toBeTruthy();
    });
  });

  describe('Theming', () => {
    it('should use correct placeholder color for Light Mode', () => {
      (useTheme as jest.Mock).mockReturnValue({ isDark: false });

      render(<TextField placeholder="Light Mode" />);

      const input = screen.UNSAFE_getByType(TextInput);
      expect(input.props.placeholderTextColor).toBe('#9CA3AF');
    });

    it('should use correct placeholder color for Dark Mode', () => {
      (useTheme as jest.Mock).mockReturnValue({ isDark: true });

      render(<TextField placeholder="Dark Mode" />);

      const input = screen.UNSAFE_getByType(TextInput);
      expect(input.props.placeholderTextColor).toBe('#6B7280');
    });
  });
});