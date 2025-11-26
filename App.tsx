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
import { useEffect, useState } from 'react';
import { getProfileByAuthId } from '@features/auth/api/authApi';
import { SignUpForm } from '@features/auth/components/SignUpForm';
import { Text } from '@core/ui/Text'; 

const AppContent = () => {
  const { user, loading, signOut } = useAuth();
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [checkingProfile, setCheckingProfile] = useState(false);

  //Descomentar para pruebas(Borrar sesion al iniciar la app)
  /*useEffect(() => {
    supabase.auth.signOut(); 
  }, []);*/
  
  useEffect(() => {
    const check = async () => {
      if (user?.id) {
        setCheckingProfile(true);
        try {
          await getProfileByAuthId(user.id);
          setHasProfile(true);
        } catch (e) {
          setHasProfile(false); 
        } finally {
          setCheckingProfile(false);
        }
      } else {
        setHasProfile(null);
      }
    };
    
    if (!loading) check();
  }, [user, loading]);

  if (loading || checkingProfile) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-4 text-gray-500">Verificando perfil...</Text>
      </View>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  if (hasProfile === false) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center px-4">
        <SignUpForm 
            isGoogleFlow={true} 
            onSuccess={() => setHasProfile(true)} 
        />
      </SafeAreaView>
    );
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
