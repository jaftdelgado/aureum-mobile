import type { AuthRepository } from "../../repositories/AuthRepository";
import type { ProfileRepository } from "../../repositories/ProfileRepository";
import type { LoggedInUser } from "../../entities/LoggedInUser";

export class GetSessionUseCase {
  constructor(
    private authRepository: AuthRepository,
    private profileRepository: ProfileRepository 
  ) {}

  async execute(): Promise<LoggedInUser | null> {
    // 1. Obtenemos el usuario básico de Supabase (Email, ID)
    const user = await this.authRepository.getSession();
    
    if (!user) {
      return null;
    }

    // 2. Intentamos buscar su perfil extendido en nuestra BD (Username, Role, Bio)
    try {
      const profile = await this.profileRepository.getProfile(user.id);
      
      if (profile) {
        // 3. Si existe, mezclamos los datos
        return {
          ...user,
          username: profile.username,
          fullName: profile.fullName,
          bio: profile.bio,
          role: profile.role,
          avatarUrl: profile.avatarUrl || user.avatarUrl, // Priorizamos el del perfil
        };
      }
    } catch (error) {
      // Si falla obtener el perfil (ej. error 404), devolvemos el usuario básico
      // para que la app sepa que está autenticado pero sin perfil (y lo mande a registrarse)
      console.log("Perfil no encontrado o error:", error);
    }

    return user;
  }
}