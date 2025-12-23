import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from '@app/providers/AppProvider';
import { AppNavigator } from '@app/navigation/AppNavigator'; // Import con llaves
import { useInitialConnection } from '@app/hooks/useInitialConnection'; // Nuevo hook
import '@app/i18n/i18n';
import './global.css';

export default function App() {
  useInitialConnection();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <AppNavigator />
          <StatusBar style="auto" />
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}