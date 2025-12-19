import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

// Providers y Hooks
import { useAuth } from '@app/providers/AuthProvider';
import { useTheme } from '@app/providers/ThemeProvider';
import { useProfileCheck } from '@features/auth/hooks/useProfileCheck';

// Navegación y Pantallas
import AuthStack from '@app/navigation/AuthStack';
import AppStack from '@app/navigation/AppStack';
import { GoogleRegisterScreen } from '@features/auth/screens/GoogleRegisterScreen';

// UI Components
import { Text } from '@core/ui/Text';

export type RootStackParamList = {
  AuthStack: undefined;
  AppStack: undefined;
  RegisterProfile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { t } = useTranslation('app');
  const { theme, isDark } = useTheme();
  const { user, loading: loadingAuth, refetchProfile } = useAuth();

  const { hasProfile, checkingProfile, setHasProfile } = useProfileCheck(user, loadingAuth);

  const customNavigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      primary: theme.primary,
      background: theme.bg,
      card: theme.card,
      text: theme.text,
      border: theme.border,
      notification: theme.error,
    },
  };

  if (loadingAuth || checkingProfile || (user && hasProfile === null)) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.bg,
        }}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ color: theme.secondaryText }} className="mt-4">
          {t('navigation.checkingProfile')}
        </Text>
      </View>
    );
  }

  return (
    <NavigationContainer theme={customNavigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="AuthStack" component={AuthStack} />
        ) : hasProfile === false ? (
          <Stack.Screen name="RegisterProfile">
            {() => (
              <GoogleRegisterScreen
                onProfileCreated={async () => {
                  await refetchProfile();
                  setHasProfile(true);
                }}
              />
            )}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="AppStack" component={AppStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
