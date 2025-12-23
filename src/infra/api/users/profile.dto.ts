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
  email?: string; 
}

export interface CreateProfileRequestDTO {
  auth_user_id: string;
  username: string;
  full_name: string;
  bio: string;
  role: string;
  profile_pic_id: string | null;
}

export interface UpdateProfileRequestDTO {
  username?: string;
  full_name?: string;
  bio?: string;
  profile_pic_id?: string;
}