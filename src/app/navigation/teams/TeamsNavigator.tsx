import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SelectedTeamNavigator } from '@app/navigation/teams/SelectedTeamNavigator';
import { TeamsScreen } from '@features/teams/screens/TeamsScreen';

export type TeamsStackParamList = {
  TeamsList: undefined;
  AllTeams: undefined;
  NewTeam: undefined;
  SelectedTeamRoot: { teamId: string };
};

const Stack = createNativeStackNavigator<TeamsStackParamList>();

export function TeamsNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}
    initialRouteName="TeamsList">
      
      {/* Nivel 1 */}
      <Stack.Screen name="TeamsList" component={TeamsScreen} />
      <Stack.Screen name="SelectedTeamRoot" component={SelectedTeamNavigator} />
    </Stack.Navigator>
  );
}
