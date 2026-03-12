"use client";
import Link from "next/link";
import BackButton from "../assets/back-button.png";
import { useState } from "react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        console.log("Email:", email);
        console.log("Password:", password);
    }
    return (
        <div className="overflow-hidden">
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-3">
                <div className="bg-white w-full max-w-md rounded-[40px] shadow-sm p-12 flex flex-col">
                    <Link href="/landing">
                        <img src={BackButton.src} alt="Back" className="size-10 hover:shadow-lg" />
                    </Link>
                    <div className="flex items-center flex-col">
                        <div className="w-20 h-20 bg-gradient-to-br from-[#407EA7] to-[#2D5A78] rounded-2xl flex items-center justify-center mb-4 text-white font-bold text-xs">
                            LOGO
                        </div>

                        <h1 className="text-3xl font-bold mb-10 text-black">Sign in</h1>

                        <div className="w-full space-y-6">
                            <div className="space-y-2">
                                <label className="text-gray-600 font-semibold ml-1">Email</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3 text-gray-400 opacity-50">✉</span>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-[#4A86A8]/20 text-black" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-gray-600 font-semibold ml-1">Password</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3 text-gray-400 opacity-20">🔒︎</span>
                                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-[#4A86A8]/20 text-black" />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-gray-400 ml-1">
                                <input type="checkbox" className="rounded" />
                                <span>Remember me</span>
                            </div>

                            <Link href="/dashboard">
                                <button onClick={handleLogin} className="w-full active:scale-95 bg-[#4A86A8] hover:bg-[#3d6e8a] text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-[#4A86A8]/30">
                                    Verbalize →
                                </button>
                            </Link>

                            <div className="flex justify-center gap-2 text-sm mt-4">
                                <button className="text-gray-400 hover:underline">Forgot password?</button>
                                <Link href="/signup">
                                    <button className="text-blue-500 font-bold hover:underline">Sign up</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}