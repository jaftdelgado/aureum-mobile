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

  async createTeam(data: { name: string; description?: string; professor_id: string; image?: { uri: string; type: string; name: string } }): Promise<Team> {
    const formData = new FormData();
    formData.append('professor_id', data.professor_id);
    formData.append('name', data.name);
    if (data.description) {
      formData.append('description', data.description);
    }

    if (data.image) {
      formData.append('file', {
        uri: data.image.uri,
        type: data.image.type,
        name: data.image.name,
      } as any);
    }
    
    const response = await httpClient.post<TeamDTO>('/api/courses', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    return mapTeamDTOToEntity(response);
  }

  async joinTeam(userId: string, code: string): Promise<Team> {
    const response = await httpClient.post<TeamDTO>('/api/memberships/join', { 
      access_code: code,
      user_id: userId 
    });
    return mapTeamDTOToEntity(response);
  }
}