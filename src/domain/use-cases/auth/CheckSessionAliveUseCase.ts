import type { AuthRepository } from "../../repositories/AuthRepository";

export class CheckSessionAliveUseCase {
  private readonly authRepository;
  constructor(authRepository: AuthRepository) {
    this.authRepository=authRepository;
  }

  async execute(): Promise<boolean> {
    return await this.authRepository.checkSessionAlive();
  }
}