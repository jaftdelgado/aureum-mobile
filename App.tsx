import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';

import { AppProvider } from '@app/providers/AppProvider';
<<<<<<< HEAD
import { useAuth } from '@app/providers/AuthProvider';
import TabBar from 'src/app/navigation/components/TabBar';
import { AssetsListScreen } from '@features/assets/screens/AssetsListScreen';
import { LoginScreen } from '@features/auth/screens/LoginScreen'; 
=======
import { DynamicDock } from 'src/app/dock/DynamicDock';

import { TextField } from '@core/ui/TextField';
>>>>>>> c75afaf3ef0af4bc279d9d4dfd0b9d2625cb8d06
import './global.css';

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AssetsListScreen />
      <TabBar />
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <AppContent /> {/* Movemos el contenido aquí adentro */}
          <StatusBar style="auto" />
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
