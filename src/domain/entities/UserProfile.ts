export interface UserProfile {
  id: string;
  authUserId: string;
  username: string;
  fullName: string;
  bio?: string;
  role: "student" | "professor";
  avatarUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}