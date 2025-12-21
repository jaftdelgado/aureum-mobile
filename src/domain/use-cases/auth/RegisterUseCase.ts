import type { RegisterData } from "@domain/entities/RegisterData";
import type { AuthRepository } from "../../repositories/AuthRepository"; 
import type { ProfileRepository } from "@domain/repositories/ProfileRepository";

export class RegisterUseCase {
  private readonly authRepo;
  private profileRepo: ProfileRepository;
  constructor(authRepository: AuthRepository, profileRepo: ProfileRepository) {
    this.authRepo=authRepository;
    this.profileRepo=profileRepo;
  }

  async execute(data: RegisterData): Promise<void> {
    const userId = await this.authRepo.register(data);

    try {
      await this.profileRepo.createProfile(userId, data);
      
    } catch (error) {
      console.error("Fallo al crear perfil. Iniciando rollback...");
      try {
        await this.authRepo.deleteAuthUser();
        console.log("Rollback exitoso: Usuario de Auth eliminado.");
      } catch (rollbackError) {
        console.error("Fallo catastrófico: El usuario quedó huérfano en Auth", rollbackError);
      }
      throw error; 
    }
  }
}