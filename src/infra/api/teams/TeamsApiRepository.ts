import { httpClient } from '../http/client'; 
import { Team } from '../../../domain/entities/Team';
import { TeamMember } from '../../../domain/entities/TeamMember';
import { TeamsRepository } from '../../../domain/repositories/TeamsRepository'; 
import { TeamDTO, CreateTeamRequestDTO, JoinTeamRequestDTO } from './team.dto';
import { mapTeamDTOToEntity } from './team.mappers'; 

export class TeamsApiRepository implements TeamsRepository {
  
  async getProfessorTeams(userId: string): Promise<Team[]> {
    const response = await httpClient.get<TeamDTO[]>(`/api/courses/professor/${userId}`);
    return response.map(mapTeamDTOToEntity);
  }

  async getStudentTeams(userId: string): Promise<Team[]> {
    const response = await httpClient.get<TeamDTO[]>(`/api/courses/student/${userId}`);
    return response.map(mapTeamDTOToEntity);
  }

  async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    const response = await httpClient.get<any[]>(`/api/teams/${teamId}/members`);
    return response; 
  }

  async createTeam(request: CreateTeamRequestDTO): Promise<Team> {
    const formData = new FormData();
    formData.append('professor_id', request.professor_id); 
    formData.append('name', request.name);
    if (request.description) formData.append('description', request.description);

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
    const response = await httpClient.post<TeamDTO>('/api/teams/join', request);
    return mapTeamDTOToEntity(response);
  }

  async removeMember(teamId: string, userId: string): Promise<void> {
    await httpClient.delete(`/api/teams/${teamId}/members/${userId}`);
  }

  async getTeamAvatar(teamId: string): Promise<Blob | null> {
    try {
      return await httpClient.getBlob(`/api/courses/${teamId}/image`);
    } catch (error) {
      return null;
    }
  }
}