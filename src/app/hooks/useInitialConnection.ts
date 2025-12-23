import { useEffect } from 'react';
import { Alert, BackHandler, Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

export const useInitialConnection = () => {
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
      }
    };

    checkInitialConnection();
  }, []);
};