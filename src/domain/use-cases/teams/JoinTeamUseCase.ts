import type { TeamsRepository } from "@domain/repositories/TeamsRepository";

export class JoinTeamUseCase {
  private teamsRepository: TeamsRepository

  constructor(teamsRepository: TeamsRepository) {
    this.teamsRepository = teamsRepository;
  }

  async execute(accessCode: string, studentId: string): Promise<void> {
    if (!accessCode.trim()) {
      throw new Error("El código de acceso es requerido");
    }
    if (accessCode.length < 5) {
      throw new Error("El código de acceso parece inválido (muy corto).");
    }
    return this.teamsRepository.joinTeam(accessCode, studentId);
  }
}