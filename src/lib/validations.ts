import { z } from "zod";

export const SignupSchema = z.object({
  name: z.string().min(2, "Name minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  role: z.enum(["user", "pemilik"]).optional().default("user"),
});

export const SigninSchema = z.object({
  emailOrName: z.string().min(1, "Email atau nama harus diisi"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});
