import type { AuthRepository } from "../../repositories/AuthRepository";
import type { ProfileRepository } from "../../repositories/ProfileRepository";
import type { LoggedInUser } from "../../entities/LoggedInUser";

export class GetSessionUseCase {
  constructor(
    private authRepository: AuthRepository,
    private profileRepository: ProfileRepository 
  ) {}

  async execute(): Promise<LoggedInUser | null> {
    const user = await this.authRepository.getSession();
    
    if (!user) {
      return null;
    }

    try {
      const profile = await this.profileRepository.getProfile(user.id);
      
      if (profile) {
        return {
          ...user,
          username: profile.username,
          fullName: profile.fullName,
          bio: profile.bio,
          role: profile.role,
          avatarUrl: profile.avatarUrl || user.avatarUrl, 
        };
      }
    } catch (error) {
      console.log("Perfil no encontrado o error:", error);
    }

    return user;
  }
}