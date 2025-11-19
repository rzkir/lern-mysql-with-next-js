import { z } from "zod";

export const SignupSchema = z.object({
  name: z.string().min(2, "Name minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  phone: z
    .string()
    .min(8, "Nomor telepon minimal 8 digit")
    .max(20, "Nomor telepon maksimal 20 digit")
    .regex(/^\+?\d[\d\s-]{6,}$/i, "Nomor telepon tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  role: z.enum(["user", "pemilik"]).optional().default("user"),
});

export const SigninSchema = z.object({
  emailOrName: z.string().min(1, "Email atau nama harus diisi"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});
