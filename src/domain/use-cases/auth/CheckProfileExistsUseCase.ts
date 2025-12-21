import type { ProfileRepository } from "../../repositories/ProfileRepository";

export class CheckProfileExistsUseCase {
  private readonly profileRepository;
  constructor(profileRepository: ProfileRepository) {
    this.profileRepository=profileRepository;
  }

  async execute(authId: string): Promise<boolean> {
    return await this.profileRepository.checkProfileExists(authId);
  }
}