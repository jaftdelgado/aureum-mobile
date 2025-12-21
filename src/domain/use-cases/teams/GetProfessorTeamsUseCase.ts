import type { TeamsRepository } from "@domain/repositories/TeamsRepository";
import type { Team } from "@domain/entities/Team";

export class GetProfessorTeamsUseCase {
  private teamsRepository: TeamsRepository;

  constructor(teamsRepository: TeamsRepository) {
    this.teamsRepository = teamsRepository;
  }

  async execute(professorId: string): Promise<Team[]> {
    return this.teamsRepository.getTeamsByProfessor(professorId);
  }
}
