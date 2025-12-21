import type { AuthRepository } from "@domain/repositories/AuthRepository";
import type { LoggedInUser } from "@domain/entities/LoggedInUser";
import type { ProfileRepository } from "@domain/repositories/ProfileRepository";

export class GetSessionUseCase {
  private authRepo: AuthRepository;
  private profileRepo: ProfileRepository;

  constructor(authRepo: AuthRepository, profileRepo: ProfileRepository) {
    this.authRepo = authRepo;
    this.profileRepo = profileRepo;
  }

  async execute(): Promise<LoggedInUser | null> {
    const baseUser = await this.authRepo.getSession();
    if (!baseUser) return null;

    try {
      const profile = await this.profileRepo.getProfile(baseUser.id);
      if (profile) {
        return {
          ...baseUser,
          username: profile.username,
          fullName: profile.full_name,
          bio: profile.bio,
          role: profile.role,
          avatarUrl: profile.profile_pic_id ?? baseUser.avatarUrl
        };
      }
    } catch (error) {
      console.warn("Error cargando perfil de sesión", error);
    }
    
    return baseUser;
  }
}
