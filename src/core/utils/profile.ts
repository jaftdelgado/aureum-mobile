import { UserProfile } from '../../domain/entities/UserProfile';

const GATEWAY_URL = process.env.EXPO_PUBLIC_API_GATEWAY_URL; 

export const getAvatarUrl = (profile: UserProfile | null): string | null => {
  if (!profile?.avatarUrl) return null;
  
  const baseUrl = `${GATEWAY_URL}/api/users/profiles/${profile.avatarUrl}/avatar`;
  const finalUrl = `${baseUrl}?id=${profile.avatarUrl}`;
  
  console.log("📷 Generando URL de Avatar:", finalUrl);
  
  return finalUrl;
};

export const getInitials = (name: string = ""): string => {
  return name ? name.charAt(0).toUpperCase() : "?";
};