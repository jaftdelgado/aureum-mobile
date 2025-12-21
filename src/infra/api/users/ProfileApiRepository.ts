import { client } from "../http/client"; 
import type { ProfileRepository } from "../../../domain/repositories/ProfileRepository";
import type { UserProfile } from "../../../domain/entities/UserProfile";
import type { RegisterData } from "../../../domain/entities/RegisterData";
import type { TeamMember } from "../../../domain/entities/TeamMember";
import { mapDTOToUserProfile } from "./profile.mappers";
import type { UserProfileDTO } from "./profile.dto";

export class ProfileApiRepository implements ProfileRepository {
  
  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const response = await client.get<UserProfileDTO>(`/users/${userId}`);
      return mapDTOToUserProfile(response.data);
    } catch (error: any) {
      if (error.response?.status === 404 || error.message?.includes("404")) {
        return null;
      }
      console.warn("Error fetching profile:", error);
      return null;
    }
  }

  async getPublicProfile(userId: string): Promise<TeamMember | null> {
    try {
      const response = await client.get<any>(`/users/profiles/${userId}`);
      
      return {
        id: response.data.auth_user_id || response.data.id, // Usamos el ID disponible
        name: response.data.full_name,                      // <--- Aquí estaba el error (fullName -> name)
        email: response.data.email || "",                   // Campo requerido por tu interfaz
        role: response.data.role,                           // "student" | "professor"
        avatarUrl: response.data.profile_pic_id,
      } as TeamMember;
    } catch (error) {
      console.warn(`Public profile not found for ${userId}`);
      return null;
    }
  }

  async checkProfileExists(authId: string): Promise<boolean> {
    try {
      await client.get(`/users/${authId}`);
      return true;
    } catch (error: any) {
      return false;
    }
  }

  async createProfile(userId: string, data: RegisterData): Promise<void> {
    const payload = {
      auth_user_id: userId,
      username: data.username,
      full_name: `${data.firstName} ${data.lastName}`,
      bio: "",
      role: data.accountType,
      profile_pic_id: null 
    };
    await client.post("/users", payload);
  }

  async updateProfile(authId: string, data: { bio?: string }): Promise<void> {
    await client.put(`/users/${authId}`, data);
  }

  async uploadAvatar(authId: string, imageFile: any): Promise<void> {
    const formData = new FormData();
    formData.append("file", {
      uri: imageFile.uri,
      name: imageFile.fileName || "avatar.jpg",
      type: imageFile.type || "image/jpeg",
    } as any); 

    await client.post(`/users/${authId}/avatar`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async deleteAccount(authId: string): Promise<void> {
     await client.delete(`/users/${authId}`);
  }
}