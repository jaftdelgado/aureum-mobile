import React from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView} from 'react-native-safe-area-context';
import { LoginForm } from '../components/LoginForm';

export const LoginScreen = () => {
  const handleShowRegister = () => {
    console.log("Ir a registro");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          className="px-4"
        >
          <View className="w-full max-w-md mx-auto">
            <LoginForm onShowRegister={handleShowRegister} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};