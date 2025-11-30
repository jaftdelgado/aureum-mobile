// src/app/navigation/AppNavigator.tsx
import React, { useEffect, useState, useRef } from 'react';
import { View, ActivityIndicator} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '@app/providers/AuthProvider';
import { getProfileByAuthId } from '@features/auth/api/authApi';
import AuthStack from '@app/navigation/AuthStack';
import AppStack from '@app/navigation/AppStack';
import { GoogleRegisterScreen } from '@features/auth/screens/GoogleRegisterScreen';

export type RootStackParamList = {
  AuthStack: undefined;
  AppStack: undefined;
  RegisterProfile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { user, loading } = useAuth();
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const checkedUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    const checkProfile = async () => {
      if (!user?.id) {
        setHasProfile(null);
        checkedUserIdRef.current = null;
        return;
      }

      if (user.id === checkedUserIdRef.current && hasProfile !== null) return;

      checkedUserIdRef.current = user.id;

      try {
        await getProfileByAuthId(user.id);
        console.log("Perfil encontrado.");
        setHasProfile(true);
      } catch {
        console.warn("Perfil no encontrado (Usuario nuevo de Google).");
        setHasProfile(false);
      }
    };

    if (!loading) checkProfile();
  }, [user, loading, hasProfile]);

  if (loading || (user && hasProfile === null)) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="AuthStack" component={AuthStack} />
        ) : hasProfile === false ? (
          <Stack.Screen name="RegisterProfile">
            {() => <GoogleRegisterScreen onProfileCreated={() => setHasProfile(true)} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="AppStack" component={AppStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
