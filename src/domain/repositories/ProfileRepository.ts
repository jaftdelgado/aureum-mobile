import type { RegisterData } from "../entities/RegisterData";
import type { TeamMember } from "../entities/TeamMember";
import type { UserProfile } from "../entities/UserProfile";

export interface ProfileRepository {
  getPublicProfile(userId: string): Promise<TeamMember | null>;
  getProfile(userId: string): Promise<UserProfile | null>;
  checkProfileExists(authId: string): Promise<boolean>;
  updateProfile(authId: string, data: { bio?: string, full_name?:string }): Promise<void>;
  uploadAvatar(authId: string, imageFile: any): Promise<void>; 
  deleteAccount(authId: string): Promise<void>;
  createProfile(userId: string, data: RegisterData): Promise<void>;
}