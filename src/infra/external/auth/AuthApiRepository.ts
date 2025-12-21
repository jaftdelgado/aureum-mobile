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

    return mapUserDTOToLoggedInUser({
      id: data.user.id,
      email: data.user.email,
      created_at: data.user.created_at,
      avatar_url: data.user.user_metadata?.avatar_url || null,
    }); 
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

    return mapUserDTOToLoggedInUser({
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        avatar_url: user.user_metadata?.avatar_url || null,
    });
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
    const { data } = await supabase.auth.getSession();
    return !!data.session;
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

  async loginWithGoogle(): Promise<void> {
    const redirectUrl = Linking.createURL('/auth/callback'); 
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { 
        redirectTo: redirectUrl,
        skipBrowserRedirect: true,
        queryParams: {
          prompt: 'select_account consent', 
          access_type: 'offline'
        }
      },
    });

    if (error) throw new Error(error.message);
    if (data?.url) {
      let finalUrl = data.url;
      if (!finalUrl.includes('prompt=')) {
        finalUrl += '&prompt=select_account';
      }
    
      await Linking.openURL(finalUrl);
    }
  }

  onAuthStateChange(callback: (user: LoggedInUser | null) => void): () => void {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'TOKEN_REFRESHED') return;
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
}