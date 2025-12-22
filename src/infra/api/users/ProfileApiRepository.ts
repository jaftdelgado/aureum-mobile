import { httpClient as client } from "../http/client"; 
import type { ProfileRepository } from "../../../domain/repositories/ProfileRepository";
import type { UserProfile } from "../../../domain/entities/UserProfile";
import type { RegisterData } from "../../../domain/entities/RegisterData";
import type { TeamMember } from "../../../domain/entities/TeamMember";
import { mapDTOToUserProfile } from "./profile.mappers";
import type { UserProfileDTO } from "./profile.dto";
import { blobToBase64 } from "@core/utils/fileUtils";

export class ProfileApiRepository implements ProfileRepository {
  
  async getProfile(authId: string): Promise<UserProfile | null> {
    try {
      const dto = await client.get<UserProfileDTO>(`/api/users/profiles/${authId}`);
      if (!dto) return null;
      let avatarBase64: string | undefined = undefined;

      if (dto.profile_pic_id) {
        try {
          const blob = await client.getBlob(`/api/users/profiles/${authId}/avatar`);
          
          avatarBase64 = await blobToBase64(blob);
        } catch (imageError) {
          console.warn("No se pudo descargar avatar:", imageError);
        }
      }

      const userProfile = mapDTOToUserProfile(dto);
      
      return {
        ...userProfile,
        avatarUrl: avatarBase64 
      };

    } catch (error) {
      console.error(`Error fetching profile for ${authId}`, error);
      return null;
    }
  }

  async getPublicProfile(userId: string): Promise<TeamMember | null> {
    try {
      const response = await client.get<any>(`/api/users/profiles/${userId}`);
      
      return {
        id: response.data.auth_user_id || response.data.id, 
        name: response.data.full_name,                     
        email: response.data.email || "",                  
        role: response.data.role,                          
        avatarUrl: response.data.profile_pic_id,
      } as TeamMember;
    } catch (error) {
      console.warn(`Public profile not found for ${userId}`);
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
    const payload = {
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
    await client.patch(`/api/users/profiles/${authId}`, data);
  }

  async uploadAvatar(authId: string, imageFile: { uri: string; type?: string; fileName?: string | null }): Promise<void> {
    const formData = new FormData();
    
    const fileToUpload = {
      uri: imageFile.uri,
      name: imageFile.fileName || `avatar_${authId}.jpg`,
      type: imageFile.type || 'image/jpeg',
    } as any;

    formData.append('file', fileToUpload);

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