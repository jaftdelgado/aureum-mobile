import type { ProfileRepository } from "@domain/repositories/ProfileRepository";

export class DeleteAccountUseCase {
  private readonly profileRepository;
  constructor(profileRepository: ProfileRepository) {
    this.profileRepository=profileRepository;
  }

  async execute(userId: string): Promise<void> {
    await this.profileRepository.deleteAccount(userId);
  }
}