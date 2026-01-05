import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MarketScreen from '@features/market/screens/MarketScreen';
import MarketSettingsScreen from '@features/market/screens/MarketSettingsScreen';

export type MarketStackParamList = {
  Market: { teamId: string };
  MarketSettings: undefined;
};

const Stack = createNativeStackNavigator<MarketStackParamList>();

export function MarketNavigator({ route }: any) {
  const { teamId } = route.params || {};

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Market"
        component={MarketScreen}
        initialParams={{ teamId }}
      />
      <Stack.Screen
        name="MarketSettings"
        component={MarketSettingsScreen}
      />
    </Stack.Navigator>
  );
}
