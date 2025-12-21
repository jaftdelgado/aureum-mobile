import type { UserProfileDTO } from "./profile.dto";
import type { UserProfile } from "../../../domain/entities/UserProfile"; 

export const mapDTOToUserProfile = (dto: UserProfileDTO): UserProfile => ({
  id: dto.id,
  authUserId: dto.auth_user_id,
  username: dto.username,
  fullName: dto.full_name,
  bio: dto.bio,
  role: dto.role,
  avatarUrl: dto.profile_pic_id ?? undefined,
  createdAt: dto.created_at ? new Date(dto.created_at) : undefined,
});