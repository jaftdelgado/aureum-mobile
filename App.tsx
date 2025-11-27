import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
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
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
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
  }, [user, hasProfile]);

  if (loading || checkingProfile) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-4 text-gray-500">Verificando perfil...</Text>
      </View>
    );
  }

  if (!user) {
    if (authView === 'register') {
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
              <View className="w-full max-w-md mx-auto bg-white p-6 rounded-xl shadow-sm">
                <SignUpForm 
                  isGoogleFlow={false} 
                  onSuccess={() => console.log("Registro completado")}
                  onBack={() => setAuthView('login')} 
                />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      );
    }
    return (
      <LoginScreen 
        onNavigateToRegister={() => setAuthView('register')} 
      />
    );
  }

  if (hasProfile === false) {
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
            <View className="w-full max-w-md mx-auto bg-white p-6 rounded-xl shadow-sm">
              <SignUpForm 
                  isGoogleFlow={true} 
                  onSuccess={() => setHasProfile(true)} 
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
          <AppContent /> 
          <StatusBar style="auto" />
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
