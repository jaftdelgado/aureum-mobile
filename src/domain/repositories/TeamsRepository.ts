import type { Team } from "@domain/entities/Team";
import type { TeamMember } from "@domain/entities/TeamMember";

export interface CreateTeamParams {
  professorId: string;
  name: string;
  description: string;
  image: any | null;
}

export interface TeamsRepository {
  getTeamsByProfessor(professorId: string): Promise<Team[]>;
  getTeamsByStudent(studentId: string): Promise<Team[]>;
  joinTeam(accessCode: string, studentId: string): Promise<void>;
  getTeamStudents(teamId: string): Promise<TeamMember[]>;
  removeMember(teamId: string, userId: string): Promise<void>;
  createTeam(params: CreateTeamParams): Promise<void>;
}