"use client";
import Link from "next/link";
import BackButton from "../assets/back-button.png";
import { login } from "@/app/login/actions";
import { signInWithGoogle } from "@/app/login/actions";
import { useState } from "react";
import { motion } from "framer-motion";
import { useActionState } from 'react';


export default function Login() {
    const [state, formAction, isPending] = useActionState(login, null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        console.log("Email:", email);
        console.log("Password:", password);
    }
    return (
        <div className="overflow-hidden">
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-3">
                <motion.div
                    className="w-full max-w-md"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="bg-white rounded-[40px] shadow-sm p-12 flex flex-col">
                        <Link href="/landing">
                            <img src={BackButton.src} alt="Back" className="size-10 hover:shadow-lg" />
                        </Link>
                        <div className="flex items-center flex-col">
                            <div className="w-20 h-20 bg-gradient-to-br from-[#407EA7] to-[#2D5A78] rounded-2xl flex items-center justify-center mb-4 text-white font-bold text-xs">
                                LOGO
                            </div>

                            <h1 className="text-3xl font-bold mb-10 text-black">Sign in</h1>

                            <div className="w-full space-y-6">
                                <form action={formAction} className="w-full space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-gray-600 font-semibold ml-1">Email</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-3 text-gray-400 opacity-50">✉</span>
                                            <input name="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-[#4A86A8]/20 text-black" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-gray-600 font-semibold ml-1">Password</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-3 text-gray-400 opacity-20">🔒︎</span>
                                            <input name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-[#4A86A8]/20 text-black" />
                                            {state?.error && (
                                                <p className="text-red-500 text-xs font-semibold mt-1 ml-1 animate-pulse">
                                                    {state.error}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-gray-400 ml-1">
                                        <input type="checkbox" className="rounded" />
                                        <span>Remember me</span>
                                    </div>

                                    <button disabled={isPending} type="submit" className="w-full active:scale-95 bg-[#4A86A8] hover:bg-[#3d6e8a] text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-[#4A86A8]/30">
                                        {isPending ? 'Loading...' : 'Sign in'}
                                    </button>

                                </form>

                                <button type="button" onClick={signInWithGoogle} className="w-full active:scale-95 bg-white hover:bg-[#3d6e8a] text-red-500 font-bold py-4 rounded-xl transition-colors shadow-lg shadow-[#4A86A8]/30">
                                        Sign in with Google
                                </button>

                                <div className="flex justify-center gap-2 text-sm mt-4">
                                    <button className="text-gray-400 hover:underline">Forgot password?</button>
                                    <Link href="/signup">
                                        <button className="text-blue-500 font-bold hover:underline">Sign up</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}