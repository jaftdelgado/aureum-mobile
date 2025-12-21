import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from '@app/providers/AppProvider';
import AppNavigator from '@app/navigation/AppNavigator';
import '@app/i18n/i18n';
import './global.css';
import NetInfo from '@react-native-community/netinfo';
import { Alert, BackHandler, Platform } from 'react-native';

export default function App() {
  useEffect(() => {
    const checkInitialConnection = async () => {
      const state = await NetInfo.fetch();
      
      if (state.isConnected === false) {
        Alert.alert(
          "Sin Conexión",
          "Se requiere conexión a internet para usar Aureum. La aplicación se cerrará.",
          [
            { 
              text: "Entendido", 
              onPress: () => closeApp() 
            }
          ],
          { cancelable: false }
        );

        setTimeout(() => {
          closeApp();
        }, 3000);
      }
    };

    const closeApp = () => {
      if (Platform.OS === 'android') {
        BackHandler.exitApp();
      } else {
      }
    };

    checkInitialConnection();
  }, []);
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
