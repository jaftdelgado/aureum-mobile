// src/domain/entities/LoggedInUser.ts
export interface LoggedInUser {
  id: string;
  email: string;
  createdAt: string;
  username?: string;
  fullName?: string;
  role?: "student" | "professor";
  avatarUrl?: string;
  bio?: string;
}
