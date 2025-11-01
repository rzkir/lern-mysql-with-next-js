export interface Account {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user" | "pemilik";
  status: boolean;
  is_verified: boolean;
  created_at?: string;
  updated_at?: string;
}
