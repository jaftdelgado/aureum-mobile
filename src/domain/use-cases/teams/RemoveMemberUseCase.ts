import type { TeamsRepository } from "../../repositories/TeamsRepository";

export class RemoveMemberUseCase {
private readonly teamsRepository;
  constructor(teamsRepository: TeamsRepository) {
    this.teamsRepository=teamsRepository;
  }

  async execute(teamId: string, userId: string): Promise<void> {
    if (!teamId || !userId) {
      throw new Error("Team ID and User ID are required");
    }
    await this.teamsRepository.removeMember(teamId, userId);
  }
}