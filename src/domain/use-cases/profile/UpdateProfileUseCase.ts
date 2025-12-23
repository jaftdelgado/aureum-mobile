import { ProfileRepository } from "../../repositories/ProfileRepository";
import { ReactNativeFile } from "../../../infra/types/http-types";

export interface UpdateProfileParams {
  userId: string;
  firstName: string;
  lastName: string;
  bio: string;
  image?: { uri: string; fileName?: string; mimeType?: string };
}

export class UpdateProfileUseCase {
  constructor(private profileRepository: ProfileRepository) {}

  async execute(params: UpdateProfileParams): Promise<void> {
    const { userId, firstName, lastName, bio, image } = params;

    const fullName = `${firstName} ${lastName}`.trim();
    
    await this.profileRepository.updateProfile(userId, {
      bio: bio,
      full_name: fullName, 
    });

    if (image) {
      const file: ReactNativeFile = {
        uri: image.uri,
        name: image.fileName || `avatar_${userId}.jpg`,
        type: image.mimeType || 'image/jpeg',
      };
      await this.profileRepository.uploadAvatar(userId, file);
    }
  }
}