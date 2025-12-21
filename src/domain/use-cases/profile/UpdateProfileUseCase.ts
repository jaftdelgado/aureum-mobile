import type { ProfileRepository } from "../../repositories/ProfileRepository";

export class UpdateProfileUseCase {
  private readonly profileRepository: ProfileRepository;

  constructor(profileRepository: ProfileRepository) {
    this.profileRepository = profileRepository;
  }

  async execute(
    userId: string, 
    currentBio: string | undefined, 
    newBio: string, 
    newImage: any | null
  ): Promise<void> {
    
    if (newBio !== currentBio) {
      await this.profileRepository.updateProfile(userId, { bio: newBio });
    }

    if (newImage) {
      await this.profileRepository.uploadAvatar(userId, newImage);
    }
  }
}