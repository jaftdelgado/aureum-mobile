export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "student" | "professor" | "Administrador" | "Miembro";
  avatarUrl?: string;
}