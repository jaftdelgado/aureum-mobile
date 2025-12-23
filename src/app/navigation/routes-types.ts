import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type TeamsStackParamList = {
  TeamsList: undefined;
  CreateTeam: undefined;
  JoinTeam: undefined;
  SelectedTeam: { teamId: string; teamName: string };
};

export type TabParamList = {
  Home: undefined;
  Teams: NavigatorScreenParams<TeamsStackParamList>; 
  Lessons: undefined;
  Settings: undefined;
};

export type AppStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList>;
  Profile: undefined;
  EditProfile: undefined;
  Details: { id: string };
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppStackParamList>;
};