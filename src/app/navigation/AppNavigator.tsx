import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@app/providers/AuthProvider';
import { useTheme } from '@app/providers/ThemeProvider';

import AuthStack from '@app/navigation/AuthStack';
import { RootStackParamList } from './routes-types';
import { Text } from '@core/ui/Text';
import { BottomTabNavigator } from './BottomTabNavigator';
import { ProfileScreen } from '@features/settings/screens/ProfileScreen';
import { EditProfileScreen } from '@features/settings/screens/EditProfileScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { t } = useTranslation('app');
  const { theme } = useTheme();
  
  const { user, isLoading } = useAuth(); 


  if (isLoading) {
    return (
      <View
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.bg }}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ color: theme.secondaryText }} className="mt-4">
          {t('navigation.checkingProfile')}
        </Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;