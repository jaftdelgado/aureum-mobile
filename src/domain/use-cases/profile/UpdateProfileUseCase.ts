import { ProfileRepository } from "../../repositories/ProfileRepository";
import { ReactNativeFile } from "../../../infra/types/http-types";

export interface UpdateProfileParams {
  userId: string;
  firstName: string;
  lastName: string;
  bio: string;
  image?: { uri: string; fileName?: string; mimeType?: string };
}

export class ImageUploadError extends Error {
  constructor() {
    super("PROFILE_UPDATED_BUT_IMAGE_FAILED");
    this.name = "ImageUploadError";
  }
}

export class UpdateProfileUseCase {
  constructor(private profileRepository: ProfileRepository) {}

  async execute(params: UpdateProfileParams): Promise<void> {
    const { userId, firstName, lastName, bio, image } = params;

    const fullName = `${firstName} ${lastName}`.replace(/\s+/g, ' ').trim();
    
    await this.profileRepository.updateProfile(userId, {
      bio: bio?.trim(),
      full_name: fullName, 
    });

    if (image) {
      try {
        const file: ReactNativeFile = {
          uri: image.uri,
          name: image.fileName || `avatar_${userId}.jpg`,
          type: image.mimeType || 'image/jpeg',
        };
        await this.profileRepository.uploadAvatar(userId, file);
      } catch (error) {
        console.error("Fallo al subir avatar:", error);
        throw new ImageUploadError();
      }
    }
  }
}