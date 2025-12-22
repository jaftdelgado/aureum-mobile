import type { StudentDto, TeamDTO } from "@infra/api/teams/team.dto";
import type { Team } from "@domain/entities/Team";
import { ENV } from "@app/config/env";
import type { TeamMember } from "@domain/entities/TeamMember";

export interface TeamMemberDomain {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: "student" | "professor"; 
}

export const mapTeamDTOToEntity = (dto: TeamDTO): Team => {
  const imageUrl = dto.team_pic 
    ? `${ENV.API_GATEWAY_URL}/api/courses/${dto.public_id}/image`
    : undefined;

  return {
    publicId: dto.public_id,
    professorId: dto.professor_id,
    name: dto.name,
    description: dto.description ?? undefined,
    teamPic: imageUrl, 
    accessCode: dto.access_code,
    createdAt: new Date(dto.created_at),
  };
};

export const mapStudentDtoToDomain = (dto: StudentDto): TeamMember => {
  return {
    id: dto.id,
    name: dto.full_name || dto.email, 
    email: dto.email,
    avatarUrl: dto.avatar_url,
    role: "student",
  };
};