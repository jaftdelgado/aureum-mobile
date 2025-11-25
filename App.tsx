import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { AppProvider } from '@app/providers/AppProvider';
import { DynamicDock } from 'src/app/dock/DynamicDock';

import { TextField } from '@core/ui/TextField';
import './global.css';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <SafeAreaView style={{ flex: 1, padding: 16 }}>
            <TextField
              label="Nombre"
              placeholder="Ingresa tu nombre"
              size="md"
              variant="default"
              rounded="xl"
              helperText="Este campo es requerido"
              left={<></>}
            />

            <DynamicDock />
          </SafeAreaView>

          <StatusBar style="auto" />
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
