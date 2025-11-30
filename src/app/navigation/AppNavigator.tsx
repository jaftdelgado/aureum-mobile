import React from 'react';
import { View, ActivityIndicator} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '@app/providers/AuthProvider';
import AuthStack from '@app/navigation/AuthStack';
import AppStack from '@app/navigation/AppStack';
import { Text } from '@core/ui/Text';
import { GoogleRegisterScreen } from '@features/auth/screens/GoogleRegisterScreen';
import { useProfileCheck } from '@features/auth/hooks/useProfileCheck'; 
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

export type RootStackParamList = {
  AuthStack: undefined;
  AppStack: undefined;
  RegisterProfile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { t } = useTranslation('app');
  const { user, loading: loadingAuth, refetchProfile } = useAuth();

  const { hasProfile, checkingProfile, setHasProfile } = useProfileCheck(user, loadingAuth);
  if (loadingAuth || checkingProfile || (user && hasProfile === null)) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-4 text-gray-500">
            {t("navigation.checkingProfile")}
        </Text>
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