export interface LoggedInUserDTO {
  id: string;
  email?: string | null;
  created_at: string;
  avatar_url?: string | null;
}

export interface UserProfileDTO {
  id: string; 
  auth_user_id: string;
  username: string;
  full_name: string;
  bio?: string;
  role: "student" | "professor";
  profile_pic_id?: string | null;
  created_at?: string;
}