import React from 'react';
import { View, TouchableOpacity, Text as RNText } from 'react-native';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { SignUpForm } from '@features/auth/components/SignUpForm';
import { useSignUp } from '@features/auth/hooks/useSignUp';
import { useTheme } from '@app/providers/ThemeProvider';

jest.mock('@features/auth/hooks/useSignUp', () => ({
  useSignUp: jest.fn(),
}));

jest.mock('@app/providers/ThemeProvider', () => ({
  useTheme: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue: string) => defaultValue || key,
  }),
}));

jest.mock('react-hook-form', () => ({
  Controller: ({ render, name }: any) => {
    return render({
      field: {
        onChange: jest.fn(),
        onBlur: jest.fn(),
        value: '',
        name: name
      },
    });
  },
}));

jest.mock('@core/ui/TextField', () => {
  const { View, TextInput, Text } = require('react-native');
  return {
    TextField: jest.fn((props) => (
      <View testID={`field-${props.label}`}>
        {props.label && <Text>{props.label}</Text>}
        <TextInput 
           testID={props.secureTextEntry ? 'secure-input' : 'text-input'}
           {...props} 
        />
        {props.error && <Text testID="error-msg">{props.errorText}</Text>}
      </View>
    )),
  };
});

jest.mock('@core/ui/Button', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return {
    Button: jest.fn(({ onPress, title, variant, disabled, loading }) => (
      <TouchableOpacity 
        testID={`btn-${title || variant}`} 
        onPress={onPress} 
        disabled={disabled || loading}
      >
        <Text>{title}</Text>
      </TouchableOpacity>
    )),
  };
});

jest.mock('@core/ui/Text', () => {
  const { Text } = require('react-native');
  return {
    Text: (props: any) => <Text {...props}>{props.children}</Text>,
  };
});

jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    Ionicons: (props: any) => <View testID="icon-eye" {...props} />,
  };
});

describe('SignUpForm Component', () => {
  const mockOnSuccess = jest.fn();
  const mockOnBack = jest.fn();
  
  const mockHandleNext = jest.fn();
  const mockHandleBack = jest.fn();

  const defaultHookState = {
    step: 1,
    loading: false,
    control: {},
    errors: {},
    handleNext: mockHandleNext,
    handleBack: mockHandleBack,
    shouldHideBackButton: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useTheme as jest.Mock).mockReturnValue({ isDark: false });
    (useSignUp as jest.Mock).mockReturnValue(defaultHookState);
  });

  describe('Step 1: Personal Info', () => {
    it('should render Step 1 fields correctly', () => {
      render(<SignUpForm onSuccess={mockOnSuccess} onBack={mockOnBack} />);

      expect(screen.getByText('Crear Cuenta')).toBeTruthy();
      expect(screen.getByText('Nombre')).toBeTruthy();
      expect(screen.getByText('Apellido')).toBeTruthy();
      expect(screen.getByText('Correo')).toBeTruthy();
      expect(screen.getByText('Siguiente')).toBeTruthy();
      expect(screen.getByText('Ya tengo cuenta')).toBeTruthy();
    });

    it('should handle Google Flow correctly in Step 1', () => {
      render(<SignUpForm onSuccess={mockOnSuccess} isGoogleFlow={true} />);

      expect(screen.getByText('Terminar Registro')).toBeTruthy();
      expect(screen.getByText('Confirma tus datos para continuar')).toBeTruthy();

      const emailContainer = screen.getByTestId('field-Correo');
      // @ts-ignore
      const emailInput = emailContainer.findByType('TextInput');
      
      expect(emailInput.props.disabled).toBe(true);

      expect(screen.queryByText('Ya tengo cuenta')).toBeNull();
    });
  });

  describe('Step 2: Academic Profile', () => {
    beforeEach(() => {
      (useSignUp as jest.Mock).mockReturnValue({
        ...defaultHookState,
        step: 2, 
      });
    });

    it('should render Username and Account Type fields', () => {
      render(<SignUpForm onSuccess={mockOnSuccess} />);

      expect(screen.getByText('Usuario')).toBeTruthy();
      expect(screen.getByText('Soy...:')).toBeTruthy();
      
      expect(screen.getByText('Estudiante')).toBeTruthy();
      expect(screen.getByText('Profesor')).toBeTruthy();
    });

    it('should show "Finish" button if in Google Flow (last step)', () => {
      render(<SignUpForm onSuccess={mockOnSuccess} isGoogleFlow={true} />);
      
      expect(screen.getByText('Finalizar')).toBeTruthy();
    });

    it('should show "Next" button if in Standard Flow', () => {
      render(<SignUpForm onSuccess={mockOnSuccess} isGoogleFlow={false} />);

      expect(screen.getByText('Siguiente')).toBeTruthy();
    });
  });

  describe('Step 3: Password (Standard Only)', () => {
    beforeEach(() => {
      (useSignUp as jest.Mock).mockReturnValue({
        ...defaultHookState,
        step: 3,
      });
    });

    it('should render Password fields if not Google Flow', () => {
      render(<SignUpForm onSuccess={mockOnSuccess} isGoogleFlow={false} />);

      expect(screen.getByText('Contraseña')).toBeTruthy();
      expect(screen.getByText('Confirmar Contraseña')).toBeTruthy();
      expect(screen.getByText('Finalizar')).toBeTruthy();
    });

    it('should NOT render step 3 fields if Google Flow (theoretical safeguard)', () => {
      render(<SignUpForm onSuccess={mockOnSuccess} isGoogleFlow={true} />);
      
      expect(screen.queryByText('Contraseña')).toBeNull();
    });

    it('should toggle password visibility', () => {
      render(<SignUpForm onSuccess={mockOnSuccess} />);

      const secureInputs = screen.getAllByTestId('secure-input');
      expect(secureInputs.length).toBeGreaterThan(0);

      const eyeIcon = screen.getByTestId('icon-eye');
      fireEvent.press(eyeIcon.parent);
    });
  });

  describe('Navigation Actions', () => {
    it('should call handleNext when Next/Finish button is pressed', () => {
      render(<SignUpForm onSuccess={mockOnSuccess} />);
      
      fireEvent.press(screen.getByText('Siguiente'));
      expect(mockHandleNext).toHaveBeenCalled();
    });

    it('should call handleBack when Back button is pressed (Step > 1)', () => {
      (useSignUp as jest.Mock).mockReturnValue({
        ...defaultHookState,
        step: 2,
      });

      render(<SignUpForm onSuccess={mockOnSuccess} />);
      
      fireEvent.press(screen.getByText('Atrás'));
      expect(mockHandleBack).toHaveBeenCalled();
    });

    it('should call onBack prop when "Go to Login" is pressed (Step 1)', () => {
      render(<SignUpForm onSuccess={mockOnSuccess} onBack={mockOnBack} />);
      
      fireEvent.press(screen.getByText('Ya tengo cuenta'));
      expect(mockOnBack).toHaveBeenCalled();
    });
  });

  describe('Validation Errors', () => {
    it('should display errors provided by the hook', () => {
      (useSignUp as jest.Mock).mockReturnValue({
        ...defaultHookState,
        step: 1,
        errors: {
          firstName: { message: 'Nombre requerido' },
        },
      });

      render(<SignUpForm onSuccess={mockOnSuccess} />);

      expect(screen.getByText('Nombre requerido')).toBeTruthy();
    });
  });
});