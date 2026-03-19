"use client";
import BackButton from "../assets/back-button.png";
import Link from "next/link";
import { signup } from "@/app/login/actions";
import { useState } from "react";
import { motion } from "framer-motion";
import { useActionState } from 'react';

export default function Signup() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [lastname, setLastname] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [state, formAction, isPending] = useActionState(signup, null);

    const checkPassword = (e: React.FormEvent<HTMLFormElement>) => {
        if (confirmPassword !== password) {
            e.preventDefault(); // stops form from submitting
            setError("Passwords do not match");
        } else {
            setError("");
        }
    };

    return (
        <div className="overflow-hidden">
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-3">
                <motion.div
                    className="w-full max-w-md"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="bg-white rounded-[40px] shadow-sm px-12 py-3 flex flex-col">
                        <Link href="/landing">
                            <img src={BackButton.src} alt="Back" className="size-10 hover:shadow-lg" />
                        </Link>
                        <div className="flex items-center flex-col">
                            <div className="w-20 h-20 bg-[#4A86A8] rounded-2xl flex items-center justify-center mb-2 text-white font-bold text-xs">
                                LOGO
                            </div>
                            <h1 className="text-3xl font-bold mb-5 text-black">Sign up</h1>
                        </div>
                        <form action={formAction} onSubmit={checkPassword} className="w-full space-y-4">
                            <div className="flex flex-row gap-2">
                                <div>
                                    <label className="text-gray-600 font-semibold ml-1">First Name</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3 text-gray-400 opacity-10">👤</span>
                                        <input name="firstName" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A86A8]/20 text-black"></input>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-gray-600 font-semibold ml-1">Last Name</label>
                                    <div className="relative">
                                        <span className="absolute pl-4 pt-3 text-gray-400 opacity-13">🏢</span>
                                        <input name="lastName" type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A86A8]/20 text-black"></input>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="text-gray-600 font-semibold ml-1">Email</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3 text-gray-400 opacity-50">✉</span>
                                    <input name="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A86A8]/20 text-black"></input>
                                </div>
                            </div>
                            <div>
                                <label className="text-gray-600 font-semibold ml-1">Password</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3 text-gray-400 opacity-20">🔒︎</span>
                                    <input name="initialPassword" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-[#4A86A8]/20 text-black" />
                                </div>
                            </div>
                            <div>
                                <label className="text-gray-600 font-semibold ml-1">Confirm Password</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3 text-gray-400 opacity-20">🔒︎</span>
                                    <input name="password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={`w-full border ${error ? 'border-red-500' : 'border-gray-300'} rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-[#4A86A8]/20 text-black`} />
                                    {error && (
                                        <p className="text-red-500 text-xs font-semibold mt-1 ml-1 animate-pulse">
                                            {error}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <button type="submit" className=" active:scale-95 w-full bg-[#4A86A8] hover:bg-[#3d6e8a] text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-[#4A86A8]/30 mt-6">
                                    Create Account
                                </button>
                            </div>
                        </form>
                        <div className="flex flex-row justify-center gap-2 text-sm mt-4">
                            <span className="text-gray-400">Already have an account?</span>
                            <Link href="/login">
                                <button className="text-blue-500 font-bold hover:underline">Sign in</button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}