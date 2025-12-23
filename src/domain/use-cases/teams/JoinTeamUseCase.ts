import { TeamsRepository } from "../../repositories/TeamsRepository";
import { Team } from "../../entities/Team";

export class JoinTeamUseCase {
  constructor(private teamsRepository: TeamsRepository) {}

  async execute(userId: string, code: string): Promise<Team> {
    return this.teamsRepository.joinTeam({ userId, code });
  }
}