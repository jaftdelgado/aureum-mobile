import React from 'react';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';

import { useAuth } from '../providers/AuthProvider';
import { useTheme } from '../providers/ThemeProvider';
import { RootStackParamList, AppStackParamList } from './routes-types';

import { AuthStack } from './AuthStack';
import { BottomTabNavigator } from './BottomTabNavigator';
import { RegisterScreen } from '../../features/auth/screens/RegisterScreen';

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
  const { theme } = useTheme();

  return (
    <AppStack.Navigator 
      screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: theme.bg } 
      }}
    >
      <AppStack.Screen name="MainTabs" component={BottomTabNavigator} />
    </AppStack.Navigator>
  );
};

const LoadingScreen = () => {
  const { theme, isDark } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.bg, justifyContent: 'center', alignItems: 'center' }}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'} 
        backgroundColor={theme.bg} 
      />
      <ActivityIndicator size="large" color={theme.primary} />
    </View>
  );
};

export const AppNavigator = () => {
  const { user, isLoading } = useAuth();
  const { theme, isDark } = useTheme();

  const BaseTheme = isDark ? DarkTheme : DefaultTheme;

  const navigationTheme = {
    ...BaseTheme, 
    colors: {
      ...BaseTheme.colors, 
      primary: theme.primary,
      background: theme.bg, 
      card: theme.card, 
      text: theme.text,
      border: theme.border,
      notification: theme.error,
    },
  };

  if (isLoading) return <LoadingScreen />; 

  return (
    <>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'} 
        backgroundColor={theme.bg} 
      />

      <View style={{ flex: 1, backgroundColor: theme.bg }}> 
        <NavigationContainer linking={linking as any} theme={navigationTheme}>
          <RootStack.Navigator 
            screenOptions={{ 
              headerShown: false,
              contentStyle: { backgroundColor: theme.bg },
              animation: 'fade', 
            }}
          >
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
      </View>
    </>
  );
};