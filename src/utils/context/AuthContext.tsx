'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import { Account } from '@/types/accounts';

import { z } from 'zod';

import { toast } from 'sonner';

const SigninSchema = z.object({
    emailOrName: z.string().min(1, 'Email atau nama harus diisi'),
    password: z.string().min(6, 'Password minimal 6 karakter'),
});

const SignupSchemaBase = z.object({
    name: z.string().min(2, 'Nama minimal 2 karakter'),
    email: z.string().email('Email tidak valid'),
    phone: z
        .string()
        .min(8, 'Nomor telepon minimal 8 digit')
        .max(20, 'Nomor telepon maksimal 20 digit')
        .regex(/^\+?\d[\d\s-]{6,}$/i, 'Nomor telepon tidak valid'),
    password: z.string().min(6, 'Password minimal 6 karakter'),
    confirmPassword: z.string().min(6, 'Konfirmasi password minimal 6 karakter'),
    role: z.enum(["user", "pemilik"]).optional().default("user"),
});

type SignupForm = { password: string; confirmPassword: string };

const SignupSchema = SignupSchemaBase.refine((data: SignupForm) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Konfirmasi password tidak cocok',
});

interface AuthContextType {
    user: Account | null;
    loading: boolean;
    // Signin form state
    signinEmailOrName: string;
    signinPassword: string;
    signinFieldErrors: { emailOrName?: string; password?: string };
    signinLoading: boolean;
    setSigninEmailOrName: (value: string) => void;
    setSigninPassword: (value: string) => void;
    handleSigninSubmit: (e?: React.FormEvent) => Promise<boolean>;
    // Signup form state
    signupName: string;
    signupEmail: string;
    signupPassword: string;
    signupConfirmPassword: string;
    signupPhone: string;
    signupFieldErrors: { name?: string; email?: string; phone?: string; password?: string; confirmPassword?: string };
    signupLoading: boolean;
    signupRole: string;
    setSignupRole: (value: string) => void;
    setSignupName: (value: string) => void;
    setSignupEmail: (value: string) => void;
    setSignupPassword: (value: string) => void;
    setSignupConfirmPassword: (value: string) => void;
    setSignupPhone: (value: string) => void;
    handleSignupSubmit: (e?: React.FormEvent) => Promise<boolean>;
    // Auth methods
    signin: (emailOrName: string, password: string) => Promise<void>;
    signup: (name: string, email: string, phone: string, password: string, role: string) => Promise<void>;
    signout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<Account | null>(null);
    const [loading, setLoading] = useState(true);

    // Signin form state
    const [signinEmailOrName, setSigninEmailOrName] = useState("");
    const [signinPassword, setSigninPassword] = useState("");
    const [signinFieldErrors, setSigninFieldErrors] = useState<{ emailOrName?: string; password?: string }>({});
    const [signinLoading, setSigninLoading] = useState(false);

    // Signup form state
    const [signupName, setSignupName] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
    const [signupPhone, setSignupPhone] = useState("");
    const [signupFieldErrors, setSignupFieldErrors] = useState<{ name?: string; email?: string; phone?: string; password?: string; confirmPassword?: string }>({});
    const [signupLoading, setSignupLoading] = useState(false);
    const [signupRole, setSignupRole] = useState("user");

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                if (data.success) {
                    setUser(data.data);
                }
            }
        } catch (error) {
            console.error('Auth check error:', error);
        } finally {
            setLoading(false);
        }
    };

    const signin = async (emailOrName: string, password: string) => {
        const res = await fetch('/api/auth/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emailOrName, password }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
            throw new Error(data.error || 'Login failed');
        }
        setUser(data.data);
    };

    const signup = async (name: string, email: string, phone: string, password: string, role: string) => {
        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, password, role }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
            throw new Error(data.error || 'Signup failed');
        }
        setUser(data.data);
    };

    const signout = async () => {
        await fetch('/api/auth/signout', { method: 'POST' });
        setUser(null);
    };

    const handleSigninSubmit = async (e?: React.FormEvent) => {
        if (e) {
            e.preventDefault();
        }
        setSigninFieldErrors({});
        setSigninLoading(true);
        try {
            const parsed = SigninSchema.safeParse({ emailOrName: signinEmailOrName, password: signinPassword });
            if (!parsed.success) {
                const errs: { emailOrName?: string; password?: string } = {};
                for (const issue of parsed.error.issues) {
                    const path = issue.path.join('.') as 'emailOrName' | 'password';
                    errs[path] = issue.message;
                }
                setSigninFieldErrors(errs);
                toast.error("Mohon perbaiki kesalahan pada form");
                return false;
            }
            await signin(parsed.data.emailOrName, parsed.data.password);
            toast.success("Login berhasil");
            // Reset form on success
            setSigninEmailOrName("");
            setSigninPassword("");
            setSigninFieldErrors({});
            return true;
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Login gagal";
            toast.error(message);
            return false;
        } finally {
            setSigninLoading(false);
        }
    };

    const handleSignupSubmit = async (e?: React.FormEvent) => {
        if (e) {
            e.preventDefault();
        }
        setSignupFieldErrors({});
        setSignupLoading(true);
        try {
            const parsed = SignupSchema.safeParse({ name: signupName, email: signupEmail, phone: signupPhone, password: signupPassword, confirmPassword: signupConfirmPassword, role: signupRole });
            if (!parsed.success) {
                const errs: { name?: string; email?: string; phone?: string; password?: string; confirmPassword?: string } = {};
                for (const issue of parsed.error.issues) {
                    const path = issue.path.join('.') as 'name' | 'email' | 'phone' | 'password' | 'confirmPassword';
                    errs[path] = issue.message;
                }
                setSignupFieldErrors(errs);
                toast.error("Mohon perbaiki kesalahan pada form");
                return false;
            }
            await signup(parsed.data.name, parsed.data.email, parsed.data.phone, parsed.data.password, parsed.data.role);
            toast.success("Registrasi berhasil");
            // Reset form on success
            setSignupName("");
            setSignupEmail("");
            setSignupPassword("");
            setSignupConfirmPassword("");
            setSignupPhone("");
            setSignupFieldErrors({});
            return true;
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Registrasi gagal";
            toast.error(message);
            return false;
        } finally {
            setSignupLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            signinEmailOrName,
            signinPassword,
            signinFieldErrors,
            signinLoading,
            setSigninEmailOrName,
            setSigninPassword,
            handleSigninSubmit,
            signupName,
            signupEmail,
            signupPassword,
            signupConfirmPassword,
            signupPhone,
            signupFieldErrors,
            signupLoading,
            signupRole,
            setSignupRole,
            setSignupName,
            setSignupEmail,
            setSignupPassword,
            setSignupConfirmPassword,
            setSignupPhone,
            handleSignupSubmit,
            signin,
            signup,
            signout
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

