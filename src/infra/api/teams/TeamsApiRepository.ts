import { httpClient, HttpError } from '../http/client'; 
import { Team } from '../../../domain/entities/Team';
import { TeamMember } from '../../../domain/entities/TeamMember';
import { TeamsRepository } from '../../../domain/repositories/TeamsRepository'; 
import { TeamDTO, CreateTeamRequestDTO, JoinTeamRequestDTO, TeamMembershipDto } from './team.dto';
import { mapTeamDTOToEntity } from './team.mappers'; 
import { ProfileApiRepository } from '../users/ProfileApiRepository'; 

export class TeamsApiRepository implements TeamsRepository {
  
  private profileRepo = new ProfileApiRepository();

  async getProfessorTeams(userId: string): Promise<Team[]> {
    try {
      const response = await httpClient.get<TeamDTO[]>(`/api/courses/professor/${userId}`);
      return response.map(mapTeamDTOToEntity);
    } catch (error: any) {
      if (error instanceof HttpError && error.status === 404) {
        return [];
      }
      throw error;
    }
  }

  async getStudentTeams(userId: string): Promise<Team[]> {
    try {
      const response = await httpClient.get<TeamDTO[]>(`/api/courses/student/${userId}`);
      return response.map(mapTeamDTOToEntity);
    } catch (error: any) {
      if (error instanceof HttpError && error.status === 404) {
        return [];
      }
      throw error;
    }
  }

  async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    try {
      const memberships = await httpClient.get<TeamMembershipDto[]>(`/api/courses/${teamId}/students`);

      const students = await Promise.all(
        memberships.map(async (membership): Promise<TeamMember | null> => {
          try {
            const profile = await this.profileRepo.getPublicProfile(membership.userid); 
            
            if (!profile) {
                return {
                    id: membership.userid,
                    role: 'student',
                    joinedAt: membership.joinedat,
                    name: 'Usuario Desconocido', 
                    email: 'Unknown',
                    avatarUrl: undefined
                };
            } 

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

    } catch (error: any) {
      if (error instanceof HttpError && error.status === 404) {
          console.warn("Curso no encontrado al buscar miembros");
          return [];
      }
      console.error("Error cargando estudiantes del equipo:", error);
      throw error; 
    }
  }

  async createTeam(request: CreateTeamRequestDTO): Promise<Team> {
    const formData = new FormData();
    formData.append('professor_id', request.professor_id); 
    formData.append('name', request.name);
    if (request.description) formData.append('description', request.description);

    if (request.image) {
      const filePayload = {
        uri: request.image.uri,
        type: request.image.type || 'image/jpeg',
        name: request.image.name || 'cover.jpg',
      };
  
      formData.append('file', filePayload as unknown as Blob);
    }

    try {
      const response = await httpClient.post<TeamDTO>('/api/courses', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return mapTeamDTOToEntity(response);

    } catch (error: any) {
      if (error instanceof HttpError && error.status === 413) {
        throw new Error("IMAGE_TOO_LARGE_SERVER");
      }
      throw error;
    }
  }

  async joinTeam(request: JoinTeamRequestDTO): Promise<Team> {
    const payload = {
      access_code: request.code,  
      user_id: request.userId   
    };
    
    try {
      const response = await httpClient.post<TeamDTO>('/api/memberships/join', payload);
      return mapTeamDTOToEntity(response);
    } catch (error: any) {
      if (error instanceof HttpError) {
        if (error.status === 404) {
          throw new Error("TEAM_NOT_FOUND"); 
        }
        if (error.status === 409) {
          throw new Error("TEAM_ALREADY_MEMBER"); 
        }
      }
      throw error;
    }
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