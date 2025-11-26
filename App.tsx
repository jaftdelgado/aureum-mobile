import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { AppProvider } from '@app/providers/AppProvider';
import { useAuth } from '@app/providers/AuthProvider';
import { AssetsListScreen } from '@features/assets/screens/AssetsListScreen';
import { LoginScreen } from '@features/auth/screens/LoginScreen'; 
import { TabBarProvider } from '@app/providers/TabBarProvider';
import './src/core/i18n'; 
import './global.css';
import { DynamicDock } from '@app/dock/DynamicDock';
import { supabase } from '@infra/external/supabase';
import { useEffect } from 'react';

const AppContent = () => {
  const { user, loading, signOut } = useAuth();

  //Descomentar para pruebas(Borrar sesion al iniciar la app)
  /*useEffect(() => {
    supabase.auth.signOut(); 
  }, []);*/
  
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
    <TabBarProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <AssetsListScreen />
        <DynamicDock />
      </SafeAreaView>
    </TabBarProvider>
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
