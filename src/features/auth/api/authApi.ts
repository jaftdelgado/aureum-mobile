import { client, AUTH_LOGOUT_EVENT } from '../../../infra/api/http/client'; 
import { Platform, DeviceEventEmitter } from 'react-native';
import { supabase } from '../../../infra/external/supabase';

export interface CreateProfilePayload {
  auth_user_id: string;
  username: string;
  full_name: string;
  role: "student" | "professor";
}

export interface UpdateProfilePayload {
  full_name?: string;
  bio?: string | null;
}

export const updateProfile = async (authId: string, payload: UpdateProfilePayload) => {
  const response = await client.patch(`/api/users/profiles/${authId}`, payload);
  return response.data;
};

export const uploadAvatar = async (authId: string, imageUri: string) => {
  const formData = new FormData();
  
  const fileName = imageUri.split('/').pop() || 'avatar.jpg';
  
  const match = /\.(\w+)$/.exec(fileName);
  const type = match ? `image/${match[1]}` : 'image/jpeg';

  if (Platform.OS === 'web') {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    formData.append('file', blob, fileName);
  } else {
    const uri = Platform.OS === 'android' && !imageUri.startsWith('file://') 
      ? `file://${imageUri}` 
      : imageUri;

    formData.append('file', {
      uri: uri,
      name: fileName,
      type: type,
    } as any);
  }

  const GATEWAY_URL = process.env.EXPO_PUBLIC_API_GATEWAY_URL;
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;

  if (!token) throw new Error("No hay sesión para subir la imagen");

  console.log("Subiendo avatar...", { uri: imageUri, type, name: fileName });

  const response = await fetch(`${GATEWAY_URL}/api/users/profiles/${authId}/avatar`, {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      console.warn('Token vencido durante upload. Cerrando sesión...');
      DeviceEventEmitter.emit(AUTH_LOGOUT_EVENT);
      throw new Error("Sesión expirada");
    }
    const errorText = await response.text();
    console.error("Error subiendo imagen:", errorText);
    throw new Error(`Error ${response.status}: No se pudo subir la imagen`);
  }

  return await response.json();
};

export const getProfileByAuthId = async (authId: string) => {
  const response = await client.get(`/api/users/profiles/${authId}`);
  return response.data;
};

export const createProfile = async (payload: CreateProfilePayload) => {
  const response = await client.post('/api/users/profiles', payload);
  return response.data;
};

export const deleteUserProfile = async (authId: string) => {
  await client.delete(`/api/users/profiles/${authId}`);
};