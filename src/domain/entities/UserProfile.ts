export interface UserProfile {
  profile_id: number;
  auth_user_id: string;
  username: string;
  full_name: string;
  bio?: string | null;
  role: 'student' | 'professor';
  profile_pic_id?: string | null;
  created_at?: string;
  updated_at?: string;
}