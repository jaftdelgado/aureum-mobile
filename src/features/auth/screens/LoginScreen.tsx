import React from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoginForm } from '../components/LoginForm';

import { useAppNavigation } from '../../../app/hooks/useAppNavigation';

export const LoginScreen = () => {
  const navigation = useAppNavigation();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          className="px-4"
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full max-w-md mx-auto">
            <LoginForm onShowRegister={() => navigation.navigate('Auth', { screen: 'Register' })} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};