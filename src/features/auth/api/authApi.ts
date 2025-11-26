import { client } from '../../../infra/api/http/client'; 

export interface CreateProfilePayload {
  auth_user_id: string;
  username: string;
  full_name: string;
  role: "student" | "professor";
}

export const getProfileByAuthId = async (authId: string) => {
  const response = await client.get(`/api/users/profiles/${authId}`);
  return response.data;
};

export const createProfile = async (payload: CreateProfilePayload) => {
  const response = await client.post('/api/users/profiles', payload);
  return response.data;
};