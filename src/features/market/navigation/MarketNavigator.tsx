import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MarketScreen from '@features/market/screens/MarketScreen';

export type MarketStackParamList = {
  Market: { teamId: string };
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
    </Stack.Navigator>
  );
}
