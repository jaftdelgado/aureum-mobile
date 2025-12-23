import { AuthRepository } from "../../repositories/AuthRepository";
import { ProfileRepository } from "../../repositories/ProfileRepository";
import { LoggedInUser } from "../../entities/LoggedInUser";

export class EnrichSessionUserUseCase {
  constructor(
    private authRepository: AuthRepository,
    private profileRepository: ProfileRepository
  ) {}

  async execute(authUser?: LoggedInUser): Promise<LoggedInUser | null> {
    let user: LoggedInUser | null | undefined = authUser;

    if (!user) {
      user = await this.authRepository.getSession();
    }

    if (!user) return null;

    try {
      const profile = await this.profileRepository.getProfile(user.id);
      
      if (profile) {
        return {
          ...user,
          username: profile.username,
          role: profile.role,
          fullName: profile.fullName,
          avatarUrl: profile.avatarUrl,
          bio: profile.bio,
        };
      }
    } catch (error) {
      console.log("Perfil no encontrado o error, devolviendo usuario base:", error);
    }

    return user; 
  }
}