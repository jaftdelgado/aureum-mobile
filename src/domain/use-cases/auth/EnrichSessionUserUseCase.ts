import type { LoggedInUser } from "@domain/entities/LoggedInUser";
import type { ProfileRepository } from "@domain/repositories/ProfileRepository";

export class EnrichSessionUserUseCase {
  private readonly profileRepository;
  constructor(profileRepository: ProfileRepository) {
    this.profileRepository=profileRepository;
  }

  async execute(baseUser: LoggedInUser): Promise<LoggedInUser> {
    try {
      const profile = await this.profileRepository.getPublicProfile(baseUser.id);

      if (profile) {
        return {
          ...baseUser,
          fullName: profile.name,
          username: profile.name,
          avatarUrl: profile.avatarUrl,
          role: profile.role as "student" | "professor",
        };
      }
    } catch (error) {
      console.warn("Could not enrich user profile:", error);
    }
    
    return baseUser;
  }
}