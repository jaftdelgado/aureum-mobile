import React from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SignUpForm } from '../components/SignUpForm';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList, RootStackParamList } from '../../../app/navigation/routes-types'; 

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'> | NativeStackScreenProps<RootStackParamList, 'CompleteRegistration'>;

// 1. Agregamos 'route' a los argumentos
export const RegisterScreen: React.FC<Props> = ({ navigation, route }) => {
  const isGoogleFlow = (route.params as any)?.isGoogleFlow ?? false;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          className="px-4"
          keyboardShouldPersistTaps="handled"
        >
          <View className="w-full max-w-md mx-auto">
            <SignUpForm
                isGoogleFlow={isGoogleFlow} 
                onSuccess={() => console.log("Registro/Completado exitoso")}
                onBack={() => {
                  if (isGoogleFlow) {
                    (navigation as any).navigate('Auth', { screen: 'Login' });
                  } else {
                    (navigation as any).replace('Login');
                  }
                }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};