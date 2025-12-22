import { httpClient } from '../http/client'; 
import { Team } from '../../../domain/entities/Team';
import { TeamDTO, CreateTeamRequestDTO, JoinTeamRequestDTO } from './team.dto'; 
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

  async createTeam(request: CreateTeamRequestDTO): Promise<Team> {
    const formData = new FormData();
    
    formData.append('professor_id', request.professor_id); 
    formData.append('name', request.name);
    
    if (request.description) {
      formData.append('description', request.description);
    }

    if (request.image) {

      formData.append('file', {
        uri: request.image.uri,
        type: request.image.type,
        name: request.image.name,
      } as any); 
    }

    const response = await httpClient.post<TeamDTO>('/api/teams', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    return mapTeamDTOToEntity(response);
  }

  async joinTeam(request: JoinTeamRequestDTO): Promise<Team> {
    const response = await httpClient.post<TeamDTO>('/api/teams/join', { 
      code: request.code,
      userId: request.userId 
    });
    return mapTeamDTOToEntity(response);
  }
}