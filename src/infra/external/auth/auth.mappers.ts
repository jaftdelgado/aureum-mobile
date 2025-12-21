import type { LoggedInUserDTO, UserProfileDTO } from "./auth.dto";
import type { LoggedInUser } from "../../../domain/entities/LoggedInUser"; 
import type { User } from "@supabase/supabase-js";

export const mapUserDTOToLoggedInUser = (
  dto: LoggedInUserDTO,
  profileDto?: UserProfileDTO
): LoggedInUser => ({
  id: dto.id,
  email: dto.email ?? "",
  createdAt: dto.created_at,
  username: profileDto?.username,
  fullName: profileDto?.full_name,
  bio: profileDto?.bio,
  role: profileDto?.role,
  avatarUrl: profileDto?.profile_pic_id || dto.avatar_url || undefined,
});

export const mapSessionToUser = (user: User): LoggedInUser => {
  return {
    id: user.id,
    email: user.email || "",
    createdAt: user.created_at,
    username: user.user_metadata?.username,
    fullName: user.user_metadata?.full_name || user.user_metadata?.name,
    avatarUrl: user.user_metadata?.avatar_url || user.user_metadata?.picture,
    role: user.user_metadata?.role as "student" | "professor" | undefined,
  };
};