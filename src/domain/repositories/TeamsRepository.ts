import { Team } from "../entities/Team";
import { TeamMember } from "../entities/TeamMember";
import { CreateTeamRequestDTO, JoinTeamRequestDTO } from "../../infra/api/teams/team.dto";

export interface TeamsRepository {
  getProfessorTeams(userId: string): Promise<Team[]>;
  getStudentTeams(userId: string): Promise<Team[]>;
  getTeamMembers(teamId: string): Promise<TeamMember[]>; 
  createTeam(request: CreateTeamRequestDTO): Promise<Team>;
  joinTeam(request: JoinTeamRequestDTO): Promise<Team>;
  removeMember(teamId: string, userId: string): Promise<void>;
  getTeamAvatar(teamId: string): Promise<Blob | null>;
}