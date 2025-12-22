export interface Team {
  public_id: string;
  professor_id: string | null;
  name: string;
  description?: string | null;
  team_pic?: string | null; 
  access_code: string;
  created_at: string;
}
