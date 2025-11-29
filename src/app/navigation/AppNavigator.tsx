// src/app/navigation/AppNavigator.tsx
import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '@app/providers/AuthProvider';
import { getProfileByAuthId } from '@features/auth/api/authApi';
import AuthStack from '@app/navigation/AuthStack';
import AppStack from '@app/navigation/AppStack';

export type RootStackParamList = {
  AuthStack: undefined;
  AppStack: undefined;
  RegisterProfile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { user, loading } = useAuth();
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [checkingProfile, setCheckingProfile] = useState(false);

  useEffect(() => {
    const checkProfile = async () => {
      if (user?.id) {
        setCheckingProfile(true);
        try {
          await getProfileByAuthId(user.id);
          setHasProfile(true);
        } catch {
          setHasProfile(false);
        } finally {
          setCheckingProfile(false);
        }
      } else {
        setHasProfile(null);
      }
    };

    if (!loading) checkProfile();
  }, [user]);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="AuthStack" component={AuthStack} />
        ) : hasProfile === false ? (
          <Stack.Screen name="RegisterProfile" component={AuthStack} />
        ) : (
          <Stack.Screen name="AppStack" component={AppStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
