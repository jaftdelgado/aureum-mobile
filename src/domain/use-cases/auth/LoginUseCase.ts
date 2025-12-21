import type { AuthRepository } from "@domain/repositories/AuthRepository";
import type { LoggedInUser } from "@domain/entities/LoggedInUser";
import type { ProfileRepository } from "@domain/repositories/ProfileRepository";

export class LoginUseCase {
  private authRepo: AuthRepository;
  private profileRepo: ProfileRepository;

  constructor(authRepo: AuthRepository, profileRepo: ProfileRepository) {
    this.authRepo = authRepo;
    this.profileRepo = profileRepo;
  }

  async execute(email: string, password: string): Promise<LoggedInUser> {
    const baseUser = await this.authRepo.login(email, password);

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
      console.warn("Login exitoso, pero falló carga de perfil", error);
    }

    return baseUser;
  }
}
