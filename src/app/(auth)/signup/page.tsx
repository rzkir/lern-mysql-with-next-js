"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, User, Quote } from 'lucide-react';

import { useAuth } from '@/utils/context/AuthContext';

export default function SignupPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const {
        signupName,
        signupEmail,
        signupPassword,
        signupFieldErrors,
        signupLoading,
        setSignupName,
        setSignupEmail,
        setSignupPassword,
        handleSignupSubmit,
    } = useAuth();

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

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
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

                        {/* Sign Up Button */}
                        <button
                            type="submit"
                            disabled={signupLoading}
                            className="w-full bg-teal-700 hover:bg-teal-800 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {signupLoading ? "Creating Account..." : "Sign Up"}
                        </button>
                    </form>

                    {/* OR Separator */}
                    <div className="flex items-center my-6">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <span className="px-4 text-sm text-gray-500">OR</span>
                        <div className="flex-1 border-t border-gray-300"></div>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="space-y-3">
                        <button
                            type="button"
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            <span className="text-gray-700 font-medium">Continue with Google</span>
                        </button>
                        <button
                            type="button"
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                            </svg>
                            <span className="text-gray-700 font-medium">Continue with Apple</span>
                        </button>
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
