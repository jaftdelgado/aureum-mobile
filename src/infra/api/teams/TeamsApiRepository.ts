import { httpClient } from '../http/client'; 
import { Team } from '../../../domain/entities/Team';
import { TeamMember } from '../../../domain/entities/TeamMember';
import { TeamsRepository } from '../../../domain/repositories/TeamsRepository'; 
import { TeamDTO, CreateTeamRequestDTO, JoinTeamRequestDTO, TeamMembershipDto } from './team.dto';
import { mapTeamDTOToEntity } from './team.mappers'; 
import { ProfileApiRepository } from '../users/ProfileApiRepository'; 

export class TeamsApiRepository implements TeamsRepository {
  
  private profileRepo = new ProfileApiRepository();

  async getProfessorTeams(userId: string): Promise<Team[]> {
    const response = await httpClient.get<TeamDTO[]>(`/api/courses/professor/${userId}`);
    return response.map(mapTeamDTOToEntity);
  }

  async getStudentTeams(userId: string): Promise<Team[]> {
    const response = await httpClient.get<TeamDTO[]>(`/api/courses/student/${userId}`);
    return response.map(mapTeamDTOToEntity);
  }

  async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    try {
      const memberships = await httpClient.get<TeamMembershipDto[]>(`/api/courses/${teamId}/students`);

      const students = await Promise.all(
        memberships.map(async (membership): Promise<TeamMember | null> => {
          try {
            const profile = await this.profileRepo.getPublicProfile(membership.userid); 
            
            if (!profile) return null; 

            return {
              ...profile, 
              id: membership.userid, 
              role: 'student',
              joinedAt: membership.joinedat
            };
          } catch (innerError) {
            console.warn(`Fallo al procesar estudiante ${membership.userid}:`, innerError);
            return null;
          }
        })
      );

      return students.filter((s): s is TeamMember => s !== null);

    } catch (error) {
      console.error("Error cargando estudiantes del equipo:", error);
      return [];  
    }
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

    const response = await httpClient.post<TeamDTO>('/api/courses', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return mapTeamDTOToEntity(response);
  }

  async joinTeam(request: JoinTeamRequestDTO): Promise<Team> {
    const payload = {
      access_code: request.code,  
      user_id: request.userId   
    };
    
    const response = await httpClient.post<TeamDTO>('/api/memberships/join', payload);
    return mapTeamDTOToEntity(response);
  }

  async removeMember(teamId: string, userId: string): Promise<void> {
    await httpClient.delete(`/api/courses/${teamId}/members/${userId}`);
  }

  async getTeamAvatar(teamId: string): Promise<Blob | null> {
    try {
      return await httpClient.getBlob(`/api/courses/${teamId}/image`);
    } catch (error) {
      return null;
    }
  }
}