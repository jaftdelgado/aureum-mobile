import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TransactionsScreen from '@features/transactions/screens/TransactionsScreen';

export type MovementsStackParamList = {
  Transactions: undefined;
};

const Stack = createNativeStackNavigator<MovementsStackParamList>();

export function TransactionsNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Transactions" component={TransactionsScreen} />
    </Stack.Navigator>
  );
}
