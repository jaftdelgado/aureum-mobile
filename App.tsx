import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { AppProvider } from '@app/providers/AppProvider';
import TabBar from 'src/app/navigation/components/TabBar';
import { AssetsListScreen } from '@features/assets/screens/AssetsListScreen';

import './global.css';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <SafeAreaView style={{ flex: 1 }}>
            <AssetsListScreen />
            <TabBar />
          </SafeAreaView>

          <StatusBar style="auto" />
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
