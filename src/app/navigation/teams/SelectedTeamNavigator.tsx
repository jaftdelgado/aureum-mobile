import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SelectedTeamScreen from '@features/teams/screens/SelectedTeamScreen';

export type SelectedTeamStackParamList = {
  SelectedTeam: { teamId?: string } | undefined;
};

const Stack = createNativeStackNavigator<SelectedTeamStackParamList>();

export function SelectedTeamNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SelectedTeam" component={SelectedTeamScreen} />
    </Stack.Navigator>
  );
}
