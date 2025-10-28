export interface Account {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  created_at?: string;
  updated_at?: string;
}
