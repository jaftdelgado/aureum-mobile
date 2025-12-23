import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../providers/AuthProvider';
import { RegisterScreen } from '../../features/auth/screens/RegisterScreen';
import { RootStackParamList, AppStackParamList } from './routes-types';
import * as Linking from 'expo-linking';
import { AuthStack } from './AuthStack'; 
import { BottomTabNavigator } from './BottomTabNavigator'; 
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
          Register: 'register' 
        } 
      },
      CompleteRegistration: 'auth/complete',
      App: {
        screens: {
          MainTabs: {
            screens: {
              Home: 'home',
            }
          }
        }
      }
    }
  }
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

  if (isLoading) return null; 

  return (
    <NavigationContainer linking={linking as any}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        
        {!user ? (
          <RootStack.Screen name="Auth" component={AuthStack} />
        ) : 

        (!user.fullName || !user.username) ? (
          <RootStack.Screen 
            name="CompleteRegistration" 
            component={RegisterScreen} 
            initialParams={{ isGoogleFlow: true }} // <--- AQUÍ LE DECIMOS QUE ES GOOGLE
          />
        ) : (

          <RootStack.Screen name="App" component={AppStackScreen} />
        )}

      </RootStack.Navigator>
    </NavigationContainer>
  );
};