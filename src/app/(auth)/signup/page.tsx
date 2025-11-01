"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, User, Quote } from 'lucide-react';

import { useAuth } from '@/utils/context/AuthContext';

export default function SignupPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    // Tambahkan state untuk menentukan apakah role sudah dipilih
    const [selectedRole, setSelectedRole] = useState<null | 'user' | 'pemilik'>(null);
    const {
        signupName,
        signupEmail,
        signupPassword,
        signupFieldErrors,
        signupLoading,
        setSignupRole,
        setSignupName,
        setSignupEmail,
        setSignupPassword,
        handleSignupSubmit,
    } = useAuth();

    // Jika role dipilih, otomatis set role pada context
    React.useEffect(() => {
        if (selectedRole) {
            setSignupRole(selectedRole);
        }
    }, [selectedRole, setSignupRole]);

    const handleSubmit = async (e: React.FormEvent) => {
        const success = await handleSignupSubmit(e);
        if (success) {
            router.push("/");
        }
    };

    return (
        <section className="min-h-screen flex">
            {/* Left Column - Signup Form */}
            <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center p-8 lg:p-12">
                <div className="max-w-md w-full mx-auto">
                    {/* Logo */}
                    <div className="flex items-center gap-2 mb-12">
                        <div className="w-10 h-10 bg-teal-700 rounded-lg flex items-center justify-center">
                            <span className="text-white font-mono text-lg font-bold">&#123;...&#125;</span>
                        </div>
                        <span className="text-gray-900 font-semibold text-xl">SoftQA</span>
                    </div>

                    {/* Heading */}
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                        Create Your Account
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Sign up to get started with SoftQA and streamline your QA process.
                    </p>
                    {/* Render CTA tombol jika role belum dipilih */}
                    {selectedRole === null ? (
                        <div className="flex flex-col gap-4">
                            <button
                                className="w-full bg-teal-700 hover:bg-teal-800 text-white py-3 rounded-lg font-medium text-lg transition-colors"
                                onClick={() => setSelectedRole('user')}
                            >
                                Daftar sebagai User
                            </button>
                            <button
                                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 py-3 rounded-lg font-medium text-lg transition-colors"
                                onClick={() => setSelectedRole('pemilik')}
                            >
                                Daftar sebagai Pemilik
                            </button>
                        </div>
                    ) : (
                        // ... mulai dari sini: hanya render form jika selectedRole sudah ada
                        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                            {/* Name Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        value={signupName}
                                        onChange={(e) => setSignupName(e.target.value)}
                                        required
                                        placeholder="Enter your name"
                                        className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 ${signupFieldErrors.name
                                            ? 'border-red-500'
                                            : 'border-gray-300'
                                            }`}
                                    />
                                </div>
                                {signupFieldErrors.name && (
                                    <p className="mt-1 text-xs text-red-600">{signupFieldErrors.name}</p>
                                )}
                            </div>
                            {/* Email Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        value={signupEmail}
                                        onChange={(e) => setSignupEmail(e.target.value)}
                                        required
                                        placeholder="Enter your email"
                                        className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 ${signupFieldErrors.email
                                            ? 'border-red-500'
                                            : 'border-gray-300'
                                            }`}
                                    />
                                </div>
                                {signupFieldErrors.email && (
                                    <p className="mt-1 text-xs text-red-600">{signupFieldErrors.email}</p>
                                )}
                            </div>
                            {/* Password Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={signupPassword}
                                        onChange={(e) => setSignupPassword(e.target.value)}
                                        required
                                        placeholder="Enter your password"
                                        className={`w-full pl-11 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 ${signupFieldErrors.password
                                            ? 'border-red-500'
                                            : 'border-gray-300'
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {signupFieldErrors.password && (
                                    <p className="mt-1 text-xs text-red-600">{signupFieldErrors.password}</p>
                                )}
                            </div>
                            {/* Jangan tampilkan radio role lagi, karena role sudah dipilih via selectedRole + otomatis */}
                            {/* Sign Up Button */}
                            <button
                                type="submit"
                                disabled={signupLoading}
                                className="w-full bg-teal-700 hover:bg-teal-800 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {signupLoading ? "Creating Account..." : "Sign Up"}
                            </button>
                        </form>
                    )}
                    {/* Bagian lain tetap */}
                    {/* OR Separator */}
                    <div className="flex items-center my-6">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <span className="px-4 text-sm text-gray-500">OR</span>
                        <div className="flex-1 border-t border-gray-300"></div>
                    </div>

                    {/* Sign In Link */}
                    <p className="mt-8 text-center text-sm text-gray-600">
                        Already have an Account?{" "}
                        <Link href="/signin" className="text-teal-600 hover:text-teal-700 font-medium">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Column - Promotional Content */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-700 via-teal-800 to-teal-900 p-12 flex-col justify-between text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-8 leading-tight">
                        Revolutionize QA with Smarter Automation
                    </h2>

                    {/* Testimonial */}
                    <div className="mb-12">
                        <Quote className="w-16 h-16 mb-6 opacity-80" />
                        <p className="text-lg lg:text-xl leading-relaxed mb-6">
                            &ldquo;SoftQA has completely transformed our testing process. It&apos;s reliable, efficient, and ensures our releases are always top-notch.&rdquo;
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                                <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold">
                                    MC
                                </div>
                            </div>
                            <div>
                                <p className="font-bold">Michael Carter</p>
                                <p className="text-white/80 text-sm">Software Engineer at DevCore</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Partner Logos Section */}
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-xs uppercase tracking-wider text-white/80">Join 1k Teams</span>
                        <div className="flex-1 h-px bg-white/20"></div>
                    </div>
                    <div className="grid grid-cols-4 gap-6">
                        {/* Placeholder for partner logos - using simple text for now */}
                        {['Discord', 'Mailchimp', 'Grammarly', 'Attentive', 'Hellosign', 'Intercom', 'Square', 'Dropbox'].map((name) => (
                            <div
                                key={name}
                                className="flex items-center justify-center h-12 text-white/60 text-xs font-medium border border-white/20 rounded bg-white/5 hover:bg-white/10 transition-colors"
                            >
                                {name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
