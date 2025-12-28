import { NavigatorScreenParams } from '@react-navigation/native';
import { UserProfile } from '../../domain/entities/UserProfile';
import { Team } from '@domain/entities/Team';

export type SettingsStackParamList = {
  SettingsRoot: undefined; 
  Profile: undefined;
  EditProfile: { profile: UserProfile };    
};

export type AssetsStackParamList = {
  Assets: undefined;
};

export type SelectedTeamStackParamList = {
  SelectedTeam: { team: Team };
  AssetsRoot: NavigatorScreenParams<AssetsStackParamList>;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type TeamsStackParamList = {
  Teams: undefined;
  SelectedTeamRoot: {
    team: Team;
  };
  JoinTeam: undefined;
  CreateTeam: undefined;
  Members: { teamId: string; teamName: string };
};

export type TabParamList = {
  Home: undefined;
  Teams: NavigatorScreenParams<TeamsStackParamList>; 
  Lessons: undefined;
  Settings: NavigatorScreenParams<SettingsStackParamList>;
};

export type AppStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList>;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppStackParamList>;
  CompleteRegistration: { isGoogleFlow: boolean };
};