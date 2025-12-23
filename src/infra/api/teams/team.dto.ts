import { ReactNativeFile } from '../../types/http-types';

export interface TeamMembershipDto {
  membershipid: number;
  publicid: string; 
  teamid: string;
  userid: string;
  joinedat: string;
}

export interface TeamDTO {
  public_id: string;
  professor_id: string | null;
  name: string;
  description?: string | null;
  team_pic?: string | null;
  access_code: string;
  created_at: string;
}

export interface StudentDto {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
}

export interface CreateTeamRequestDTO {
  name: string;
  description?: string;
  professor_id: string;
  image?: ReactNativeFile;
}

export interface JoinTeamRequestDTO {
  code: string;
  userId: string;
}