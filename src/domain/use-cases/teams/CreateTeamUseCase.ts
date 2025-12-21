import type { TeamsRepository, CreateTeamParams } from "../../repositories/TeamsRepository";

export class CreateTeamUseCase {
  private readonly teamsRepository: TeamsRepository;
  
  constructor(teamsRepository: TeamsRepository) {
    this.teamsRepository = teamsRepository;
  }

  async execute(params: CreateTeamParams): Promise<void> {
    await this.teamsRepository.createTeam(params);
  }
}