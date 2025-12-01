import { UserProfile } from '@domain/entities/UserProfile';
const GATEWAY_URL = process.env.EXPO_PUBLIC_API_GATEWAY_URL;

export const getAvatarUrl = (profile: UserProfile | null): string | null => {
  if (!profile?.profile_pic_id) return null;
  return `${GATEWAY_URL}/api/users/profiles/${profile.auth_user_id}/avatar`;
};

export const getInitials = (name: string = ""): string => {
  return name ? name.charAt(0).toUpperCase() : "?";
}; 