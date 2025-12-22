import { httpClient } from '../http/client'; 
import { Team } from '../../../domain/entities/Team';
import { TeamDTO } from './team.dto'; 
import { mapTeamDTOToEntity } from './team.mappers'; 

export class TeamsApiRepository {
  
  async getProfessorTeams(userId: string): Promise<Team[]> {
    const response = await httpClient.get<TeamDTO[]>(`/api/courses/professor/${userId}`);
    return response.map(mapTeamDTOToEntity);
  }

  async getStudentTeams(userId: string): Promise<Team[]> {
    const response = await httpClient.get<TeamDTO[]>(`/api/courses/student/${userId}`);
    return response.map(mapTeamDTOToEntity);
  }

  async createTeam(data: { name: string; code: string; owner_id: string }): Promise<Team> {
    const response = await httpClient.post<TeamDTO>('/api/teams', data);
    return mapTeamDTOToEntity(response);
  }
}