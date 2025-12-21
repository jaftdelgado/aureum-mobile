import type { AuthRepository } from "../../repositories/AuthRepository";
import type { SocialUser } from "../../entities/SocialUser";

export class GetSocialUserUseCase {
  private readonly authRepository;
  constructor(authRepository: AuthRepository) {
    this.authRepository=authRepository;
  }

  async execute():Promise<SocialUser | null> {
    return await this.authRepository.getPendingSocialUser();
  }
}