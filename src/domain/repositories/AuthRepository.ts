import type { RegisterData } from "@domain/entities/RegisterData";
import type { SocialUser } from "../entities/SocialUser";
import type { LoggedInUser } from "@domain/entities/LoggedInUser";

export interface AuthRepository {
  login(email: string, password: string): Promise<LoggedInUser>;
  logout(): Promise<void>;
  getSession(): Promise<LoggedInUser | null>;
  setSession(accessToken: string, refreshToken: string): Promise<void>;
  register(data: RegisterData): Promise<string>;
  checkSessionAlive(): Promise<boolean>;
  getPendingSocialUser(): Promise<SocialUser | null>;
  loginWithGoogle(): Promise<void>;
  onAuthStateChange(callback: (user: LoggedInUser | null) => void): () => void;
  deleteAuthUser(): Promise<void>;
}
