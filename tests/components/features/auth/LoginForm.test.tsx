import React from 'react';
import { View, TouchableOpacity, Text as RNText } from 'react-native';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { LoginForm } from '@features/auth/components/LoginForm';
import { useLoginForm } from '@features/auth/hooks/useLoginForm';
import { useTheme } from '@app/providers/ThemeProvider';

jest.mock('@features/auth/hooks/useLoginForm', () => ({
  useLoginForm: jest.fn(),
}));

jest.mock('@app/providers/ThemeProvider', () => ({
  useTheme: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('@core/ui/TextField', () => {
  const { View, TextInput } = require('react-native');
  return {
    TextField: jest.fn((props) => (
      <View testID="mock-textfield-container">
        <TextInput 
           testID={props.label === 'signin.password' ? 'password-input' : 'email-input'}
           {...props} 
        />
      </View>
    )),
  };
});

jest.mock('@core/ui/Button', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return {
    Button: jest.fn(({ onPress, title, loading, disabled, variant }) => {
      const testID = variant === 'link' ? 'create-account-button' : 'login-button';
      return (
        <TouchableOpacity 
          testID={testID} 
          onPress={onPress} 
          disabled={disabled || loading}
        >
          <Text>{title}</Text>
        </TouchableOpacity>
      );
    }),
  };
});

jest.mock('@core/ui/Text', () => {
  const { Text } = require('react-native');
  return {
    Text: (props: any) => <Text {...props}>{props.children}</Text>,
  };
});

jest.mock('@features/auth/components/GoogleSignIn', () => {
  const { View } = require('react-native');
  return {
    GoogleSignIn: () => <View testID="google-signin-mock" />,
  };
});

jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    Ionicons: (props: any) => <View testID="icon-eye" {...props} />,
  };
});

jest.mock('@core/ui/Separator', () => {
  const { View } = require('react-native');
  return {
    Separator: () => <View />,
  };
});

describe('LoginForm Component', () => {
  const mockOnShowRegister = jest.fn();
  const mockHandleChange = jest.fn();
  const mockHandleSubmit = jest.fn();

  const defaultHookState = {
    formData: { email: '', password: '' },
    handleChange: mockHandleChange,
    loading: false,
    errors: {},
    errorMsg: null,
    handleSubmit: mockHandleSubmit,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useTheme as jest.Mock).mockReturnValue({ isDark: false });
    (useLoginForm as jest.Mock).mockReturnValue(defaultHookState);
  });

  it('should render form elements correctly', () => {
    render(<LoginForm onShowRegister={mockOnShowRegister} />);

    expect(screen.getByText('signin.title')).toBeTruthy();
    expect(screen.getByTestId('email-input')).toBeTruthy();
    expect(screen.getByTestId('password-input')).toBeTruthy();
    expect(screen.getByTestId('login-button')).toBeTruthy();
    expect(screen.getByTestId('google-signin-mock')).toBeTruthy();
    expect(screen.getByText('signin.createAccount')).toBeTruthy();
  });

  it('should call handleChange when typing in fields', () => {
    render(<LoginForm onShowRegister={mockOnShowRegister} />);

    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');

    fireEvent.changeText(emailInput, 'test@example.com');
    expect(mockHandleChange).toHaveBeenCalledWith('email', 'test@example.com');

    fireEvent.changeText(passwordInput, 'secret123');
    expect(mockHandleChange).toHaveBeenCalledWith('password', 'secret123');
  });

  it('should call handleSubmit when login button is pressed', () => {
    render(<LoginForm onShowRegister={mockOnShowRegister} />);

    const loginBtn = screen.getByTestId('login-button');
    fireEvent.press(loginBtn);

    expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
  });

  it('should toggle password visibility', () => {
    render(<LoginForm onShowRegister={mockOnShowRegister} />);

    const passwordInput = screen.getByTestId('password-input');
    expect(passwordInput.props.secureTextEntry).toBe(true);

    const icon = screen.getByTestId('icon-eye');
    const toggleButton = icon.parent; 

    fireEvent.press(toggleButton);
    
    expect(screen.getByTestId('password-input').props.secureTextEntry).toBe(false);

    fireEvent.press(toggleButton);
    expect(screen.getByTestId('password-input').props.secureTextEntry).toBe(true);
  });

  it('should display global error message when present', () => {
    (useLoginForm as jest.Mock).mockReturnValue({
      ...defaultHookState,
      errorMsg: 'Invalid credentials',
    });

    render(<LoginForm onShowRegister={mockOnShowRegister} />);

    expect(screen.getByText('Invalid credentials')).toBeTruthy();
  });

  it('should pass field errors to TextField', () => {
    (useLoginForm as jest.Mock).mockReturnValue({
      ...defaultHookState,
      errors: {
        email: { message: 'invalid_email' },
      },
    });

    render(<LoginForm onShowRegister={mockOnShowRegister} />);

    const emailInput = screen.getByTestId('email-input');
    
    expect(emailInput.props.error).toBe(true);
    expect(emailInput.props.errorText).toBe('invalid_email');
  });

  it('should disable inputs and button when loading', () => {
    (useLoginForm as jest.Mock).mockReturnValue({
      ...defaultHookState,
      loading: true,
    });

    render(<LoginForm onShowRegister={mockOnShowRegister} />);

    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const loginButton = screen.getByTestId('login-button');

    expect(emailInput.props.disabled).toBe(true);
    expect(passwordInput.props.disabled).toBe(true);

    expect(loginButton.props.accessibilityState).toEqual(
      expect.objectContaining({ disabled: true })
    );
  });

  it('should call onShowRegister when create account is pressed', () => {
    render(<LoginForm onShowRegister={mockOnShowRegister} />);

    const createAccountButton = screen.getByTestId('create-account-button');

    fireEvent.press(createAccountButton);
    expect(mockOnShowRegister).toHaveBeenCalledTimes(1);
  });
});