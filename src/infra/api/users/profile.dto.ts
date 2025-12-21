export interface UserProfileDTO {
  id: string;
  auth_user_id: string;
  username: string;
  full_name: string;
  bio?: string;
  role: "student" | "professor";
  profile_pic_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateProfileDTO {
  username?: string;
  full_name?: string;
  bio?: string;
  profile_pic_id?: string;
}