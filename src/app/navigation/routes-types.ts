import { NavigatorScreenParams } from '@react-navigation/native';

export type TeamsStackParamList = {
  TeamsList: undefined;
  SelectedTeam: { teamId: string; teamName: string };
  JoinTeam: undefined;
  CreateTeam: undefined;
};

export type TabParamList = {
  Home: undefined;
  Teams: NavigatorScreenParams<TeamsStackParamList>; // Conectamos el sub-stack
  Lessons: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Auth: undefined; 
  MainTabs: NavigatorScreenParams<TabParamList>;
  Profile: undefined;
  EditProfile: undefined;
};