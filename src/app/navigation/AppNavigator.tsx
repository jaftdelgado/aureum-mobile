import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';

import { useAuth } from '../providers/AuthProvider';
import { useTheme } from '../providers/ThemeProvider'; // Ajusta la ruta a tu provider
import { RootStackParamList, AppStackParamList } from './routes-types';

import { AuthStack } from './AuthStack';
import { BottomTabNavigator } from './BottomTabNavigator';
import { RegisterScreen } from '../../features/auth/screens/RegisterScreen';
import { ProfileScreen } from '../../features/settings/screens/ProfileScreen';
import { EditProfileScreen } from '../../features/settings/screens/EditProfileScreen';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

const linking = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Auth: {
        screens: {
          Login: 'login',
          Register: 'register',
        },
      },
      CompleteRegistration: 'auth/complete',
      App: {
        screens: {
          MainTabs: {
            screens: {
              Home: 'home',
            },
          },
        },
      },
    },
  },
};

const AppStackScreen = () => {
  return (
    <AppStack.Navigator screenOptions={{ headerShown: false }}>
      <AppStack.Screen name="MainTabs" component={BottomTabNavigator} />

      <AppStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ presentation: 'card' }}
      />
      <AppStack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ presentation: 'modal' }}
      />
    </AppStack.Navigator>
  );
};

export const AppNavigator = () => {
  const { user, isLoading } = useAuth();
  const { theme, isDark } = useTheme();

  // Mapeo de tus colores personalizados al tema de React Navigation
  const navigationTheme = {
    ...DefaultTheme,
    dark: isDark,
    colors: {
      ...DefaultTheme.colors,
      primary: theme.primary,
      background: theme.bg, // Color de fondo global
      card: theme.card, // Fondo de barras de navegación/tabs
      text: theme.text,
      border: theme.border,
      notification: theme.error,
    },
  };

  if (isLoading) return null;

  return (
    <>
      {/* Configura la barra de estado (hora, batería) según el tema */}
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.bg} />

      <NavigationContainer linking={linking as any} theme={navigationTheme}>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          {!user ? (
            <RootStack.Screen name="Auth" component={AuthStack} />
          ) : !user.fullName || !user.username ? (
            <RootStack.Screen
              name="CompleteRegistration"
              component={RegisterScreen}
              initialParams={{ isGoogleFlow: true }}
            />
          ) : (
            <RootStack.Screen name="App" component={AppStackScreen} />
          )}
        </RootStack.Navigator>
      </NavigationContainer>
    </>
  );
};
