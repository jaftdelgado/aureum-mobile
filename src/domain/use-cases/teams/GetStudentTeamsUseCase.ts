import type { TeamsRepository } from "@domain/repositories/TeamsRepository";
import type { Team } from "@domain/entities/Team";

export class GetStudentTeamsUseCase {
  private teamsRepository: TeamsRepository;

  constructor(teamsRepository: TeamsRepository) {
    this.teamsRepository = teamsRepository;
  }

  async execute(studentId: string): Promise<Team[]> {
    return this.teamsRepository.getTeamsByStudent(studentId);
  }
}
