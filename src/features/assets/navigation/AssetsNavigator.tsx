import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AssetsScreen from '@features/assets/screens/AssetsScreen';

export type AssetsStackParamList = {
  Assets: undefined;
};

const Stack = createNativeStackNavigator<AssetsStackParamList>();

export function AssetsNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Assets" component={AssetsScreen} />
    </Stack.Navigator>
  );
}
