export interface RegisterData {
  email: string;
  password?: string;
  username: string;
  firstName: string;
  lastName: string;
  accountType: "student" | "teacher";
  isGoogle?: boolean;
}