import { supabase } from '../supabase'; 
import type { AuthRepository } from '../../../domain/repositories/AuthRepository';
import type { LoggedInUser } from '../../../domain/entities/LoggedInUser';
import type { SocialUser } from '../../../domain/entities/SocialUser';
import type { RegisterData } from '../../../domain/entities/RegisterData';
import { mapUserDTOToLoggedInUser, mapSessionToUser } from './auth.mappers';
import * as Linking from 'expo-linking';

export class AuthApiRepository implements AuthRepository {

  async login(email: string, password: string): Promise<LoggedInUser> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    if (!data.user) throw new Error("No se pudo iniciar sesión");

    return mapSessionToUser(data.user)
  }

  async logout(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);
    } catch (error) {
      console.warn("Error al cerrar sesión", error);
    }
  }

  async getSession(): Promise<LoggedInUser | null> {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    if (!user) return null;

    return mapSessionToUser(user)
  }

  async register(data: RegisterData): Promise<string> { 
    if (!data.isGoogle) {
      if (!data.password) throw new Error("Password requerido");
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (error) throw new Error(error.message);
      if (!authData.user) throw new Error("Error al crear usuario");
      return authData.user.id;
    } else {
      const { data: sessionData } = await supabase.auth.getUser();
      if (!sessionData.user) throw new Error("No hay sesión activa");
      return sessionData.user.id;
    }
  }

  async checkSessionAlive(): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  async getPendingSocialUser(): Promise<SocialUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const email = user.email || "";
      const fullName = user.user_metadata?.full_name || user.user_metadata?.name || "";
      const nameParts = fullName.split(" ").filter(Boolean);
      
      return { 
        email, 
        firstName: nameParts[0] || "", 
        lastName: nameParts.slice(1).join(" ") || "" 
      };
    } catch (error) {
      return null;
    }
  }

  onAuthStateChange(callback: (user: LoggedInUser | null) => void): () => void {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') return;
      if (session?.user) {
        callback(mapSessionToUser(session.user));
      } else {
        callback(null);
      }
    });
    return () => subscription.unsubscribe();
  }

  async setSession(accessToken: string, refreshToken: string): Promise<void> {
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    });
    if (error) throw new Error(error.message);
  }

  async deleteAuthUser(): Promise<void> {
    const { error } = await supabase.rpc('delete_own_user');
    if (error) throw new Error("No se pudo eliminar el usuario");
    await this.logout();
  }

  async signInWithIdToken(token: string): Promise<void> {
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token: token,
  });

  if (error) throw error;
  
}
}