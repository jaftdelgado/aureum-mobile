import { httpClient as client } from "../http/client"; 
import type { ProfileRepository } from "../../../domain/repositories/ProfileRepository";
import type { UserProfile } from "../../../domain/entities/UserProfile";
import type { RegisterData } from "../../../domain/entities/RegisterData";
import type { TeamMember } from "../../../domain/entities/TeamMember";
import { mapDTOToTeamMember, mapDTOToUserProfile } from "./profile.mappers";
import type { UserProfileDTO, CreateProfileRequestDTO, UpdateProfileRequestDTO } from "./profile.dto";
import { blobToBase64 } from "@core/utils/fileUtils";
import { ReactNativeFile } from "../../types/http-types";
import { HttpError } from '../http/client';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class ProfileApiRepository implements ProfileRepository {
  
  private async getAvatarWithRetry(url: string, retries = 3, backoff = 1000): Promise<string | undefined> {
    for (let i = 0; i < retries; i++) {
      try {
        const blob = await client.getBlob(url);
        const base64 = await blobToBase64(blob);
        return base64;
      } catch (error) {
        if (i === retries - 1) {
          console.warn(`[ProfileRepository] Falló la carga del avatar tras ${retries} intentos:`, url);
          return undefined; 
        }
        
        await delay(backoff);
      }
    }
    return undefined;
  }

  async getProfile(authId: string): Promise<UserProfile | null> {
    try {
      const dto = await client.get<UserProfileDTO>(`/api/users/profiles/${authId}`);
      if (!dto) return null;
      
      let avatarBase64: string | undefined = undefined;

      if (dto.profile_pic_id) {
        avatarBase64 = await this.getAvatarWithRetry(`/api/users/profiles/${authId}/avatar`);
      }

      const userProfile = mapDTOToUserProfile(dto);
      
      return {
        ...userProfile,
        avatarUrl: avatarBase64 
      };

    } catch (error: any) {
      if (error instanceof HttpError && error.status === 404) {
        return null;
      }
      console.error('[ProfileApiRepository] Error fetching profile:', error);
      throw error;
    }
  }

  async getPublicProfile(userId: string): Promise<TeamMember | null> {
    try {
      const dto = await client.get<UserProfileDTO>(`/api/users/profiles/${userId}`);
      
      let avatarBase64: string | undefined = undefined;

      if (dto.profile_pic_id) {
        avatarBase64 = await this.getAvatarWithRetry(`/api/users/profiles/${userId}/avatar`);
      }

      const member = mapDTOToTeamMember(dto);
      
      return {
        ...member,
        avatarUrl: avatarBase64 
      };
      
    } catch (error: any) {
      if (error.status === 404 || error.response?.status === 404) {
        return null;
      }
      console.warn(`Public profile error for ${userId}:`, error);
      return null;
    }
  }

  async checkProfileExists(authId: string): Promise<boolean> {
    try {
      await client.get(`/api/users/profiles/${authId}`);
      return true;
    } catch (error: any) {
      if (error.status === 404 || error.response?.status === 404) {
        return false;
      }
      throw error;
    }
  }

  async createProfile(userId: string, data: RegisterData): Promise<void> {
    const payload: CreateProfileRequestDTO = {
      auth_user_id: userId,
      username: data.username,
      full_name: `${data.firstName} ${data.lastName}`,
      bio: "",
      role: data.accountType.toLowerCase(),
      profile_pic_id: null 
    };
    await client.post(`/api/users/profiles`, payload);
  }

  async updateProfile(authId: string, data: { bio?: string; full_name?: string }): Promise<void> {
    const payload: UpdateProfileRequestDTO = data;
    await client.patch(`/api/users/profiles/${authId}`, payload);
  }

  async uploadAvatar(authId: string, imageFile: ReactNativeFile): Promise<void> {
    const formData = new FormData();
    
    const filePayload = {
      uri: imageFile.uri,
      name: imageFile.name || `avatar_${authId}.jpg`,
      type: imageFile.type || 'image/jpeg',
    };

    formData.append('file', filePayload as unknown as Blob);
    
    await client.post(`/api/users/profiles/${authId}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', 
      },
    });
  }

  async deleteAccount(authId: string): Promise<void> {
     await client.delete(`/api/users/profiles/${authId}`);
  }
}