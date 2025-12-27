import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MarketScreen from '@features/market/screens/MarketScreen';

export type MarketStackParamList = {
  Market: undefined;
};

const Stack = createNativeStackNavigator<MarketStackParamList>();

export function MarketNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Market" component={MarketScreen} />
    </Stack.Navigator>
  );
}
