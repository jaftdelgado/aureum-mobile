import type { TeamsRepository } from "../../repositories/TeamsRepository";
import type { TeamMember } from "@domain/entities/TeamMember";

export class GetTeamMembersUseCase {
  private readonly teamsRepository;
  constructor(teamsRepository: TeamsRepository) {
    this.teamsRepository=teamsRepository;
  }

  async execute(teamId: string): Promise<TeamMember[]> {
    return await this.teamsRepository.getTeamStudents(teamId);
  }
}