import { TeamsRepository } from "../../repositories/TeamsRepository";
import { Team } from "../../entities/Team";
import { CreateTeamRequestDTO } from "../../../infra/api/teams/team.dto";

export class CreateTeamUseCase {
  constructor(private teamsRepository: TeamsRepository) {}

  async execute(request: CreateTeamRequestDTO): Promise<Team> {
    return this.teamsRepository.createTeam(request);
  }
}