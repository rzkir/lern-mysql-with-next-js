'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Account } from '@/types/accounts';

interface AuthContextType {
    user: Account | null;
    loading: boolean;
    signin: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    signout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<Account | null>(null);
    const [loading, setLoading] = useState(true);

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

    const signin = async (email: string, password: string) => {
        const res = await fetch('/api/auth/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
            throw new Error(data.error || 'Login failed');
        }
        setUser(data.data);
    };

    const signup = async (name: string, email: string, password: string) => {
        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
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

    return (
        <AuthContext.Provider value={{ user, loading, signin, signup, signout }}>
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

