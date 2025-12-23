import { NavigatorScreenParams } from '@react-navigation/native';

export type AssetsStackParamList = {
  Assets: undefined;
};

export type SelectedTeamStackParamList = {
  SelectedTeam: { teamId?: string; teamName?: string } | undefined;
  AssetsRoot: NavigatorScreenParams<AssetsStackParamList>;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type TeamsStackParamList = {
  TeamsList: undefined;
  CreateTeam: undefined;
  JoinTeam: undefined;
  SelectedTeam: NavigatorScreenParams<SelectedTeamStackParamList>;
};

export type TabParamList = {
  Home: undefined;
  Teams: NavigatorScreenParams<TeamsStackParamList>; 
  Lessons: undefined;
  Settings: undefined;
};

export type AppStackParamList = {
  MainTabs: NavigatorScreenParams<any>;
  Profile: undefined;
  EditProfile: undefined;
  Details: { id: string };
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppStackParamList>;
  CompleteRegistration: { isGoogleFlow: boolean };
};