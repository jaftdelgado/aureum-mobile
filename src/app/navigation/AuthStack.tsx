import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '@features/auth/screens/LoginScreen';
import { SignUpForm } from '@features/auth/components/SignUpForm';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login">
        {(props) => (
          <LoginScreen
            {...props}
            onNavigateToRegister={() => props.navigation.replace('Register')}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Register">
        {(props) => (
          <SignUpForm {...props} onSuccess={() => props.navigation.replace('AppStack')} />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default AuthStack;
