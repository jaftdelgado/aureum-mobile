import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TeamsScreen from '@features/teams/screens/TeamsScreen';
import { SelectedTeamNavigator } from '@app/navigation/teams/SelectedTeamNavigator';

export type TeamsStackParamList = {
  Teams: undefined;
  AllTeams: undefined;
  NewTeam: undefined;
  SelectedTeamRoot: { teamId: string };
};

const Stack = createNativeStackNavigator<TeamsStackParamList>();

export function TeamsNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Nivel 1 */}
      <Stack.Screen name="Teams" component={TeamsScreen} />

      {/* Nivel 2 */}
      {/* Nivel 3 */}
      <Stack.Screen name="SelectedTeamRoot" component={SelectedTeamNavigator} />
    </Stack.Navigator>
  );
}
