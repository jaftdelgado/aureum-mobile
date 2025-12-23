import { AuthRepository } from "../../repositories/AuthRepository";
import { ProfileRepository } from "../../repositories/ProfileRepository";
import { LoggedInUser } from "../../entities/LoggedInUser";

export class EnrichSessionUserUseCase {
  constructor(
    private authRepository: AuthRepository,
    private profileRepository: ProfileRepository
  ) {}

  async execute(currentUser?: LoggedInUser | null): Promise<LoggedInUser | null> {
    const user = currentUser || await this.authRepository.getSession();
    
    if (!user) return null;

    try {
      const hasProfile = await this.profileRepository.checkProfileExists(user.id);

      if (hasProfile) {
        const fullProfile = await this.profileRepository.getProfile(user.id);
        
        if (fullProfile) {
          return {
            ...user,
            username: fullProfile.username,
            role: fullProfile.role,
            fullName: fullProfile.fullName,
            avatarUrl: fullProfile.avatarUrl
          };
        }
      }
      
      return user;
      
    } catch (error) {
      console.warn("Error enriching user session:", error);
      return user; 
    }
  }
}