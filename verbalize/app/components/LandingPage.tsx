"use client";
import LandingBG from '../assets/landing-bg.jpg';
import { Cutive_Mono } from 'next/font/google';
import { Cormorant } from 'next/font/google';
import { PhoneIcon, ShieldCheckIcon, CpuChipIcon, CommandLineIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState } from 'react';
import Popup from './Transition';
import Typewriter from 'typewriter-effect';

const cutiveMono = Cutive_Mono({
    weight: '400',
});

const cormorant = Cormorant({});

export default function LandingPage() {

    return (
        <div className="overflow-hidden">
            {/* Logo - Name - Login */}
            <nav className="fixed top-0 w-full h-[50px] z-[100] flex justify-between items-center px-10 md:px-20 bg-[#F8FAFC]/90 border-b border-[#407EA7]/10">
                <div className="flex items-center gap-3">
                    <div className="size-10 bg-gradient-to-br from-[#407EA7] to-[#2D5A78] rounded-xl shadow-lg shadow-[#407EA7]/20 flex items-center justify-center text-white" />
                    <span className="text-slate-900 font-black text-2xl tracking-tight">Verbalize</span>
                </div>
                <Link href="/login">
                    <button className="px-4 py-1 rounded-[10px] bg-black text-white font-bold hover:bg-[#356a8c] hover:shadow-lg hover:shadow-[#407EA7]/30 transition-all active:scale-95">
                        Sign In
                    </button>
                </Link>
            </nav>
            {/* Landing Section - 1 */}
            <div className="w-screen h-173 bg-cover bg-center py-10 flex flex-col bg-[#F8FAFC]/95 bg-blend-overlay overflow-hidden"
                style={{ backgroundImage: `url(${LandingBG.src})` }}>

                <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAFC]/20 via-[#F8FAFC]/20 to-[#F8FAFC]" />
                {/* Description - Overview */}
                <div className="min-w-screen p-5 flex flex-row items-center justify-center px-20 z-10 gap-50">
                    <div className="text-center lg:text-left">
                        <h1 className="text-[#407EA7] text-6xl md:text-7xl font-black leading-tight tracking-tighter drop-shadow-sm">
                            Beyond the <br /> <span className="text-slate-900">syntax.</span>
                        </h1>
                        <p className="mt-8 text-xl text-slate-600 max-w-xl leading-relaxed font-medium">
                            Verbalize is a web-based automated oral defense platform where students verbally explain their code logic and design choices through voice calls
                        </p>
                        <div className="mt-10 flex flex-col gap-4 justify-center">
                            <Link href="/login">
                                <button className="w-60 ml-20 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-2xl hover:bg-[#356a8c] hover:shadow-lg hover:shadow-[#407EA7]/30 transition-all">Get Started</button>
                            </Link>
                        </div>
                    </div>
                    <div className="group mt-10">
                        <div className="flex flex-row justify-center gap-10 p-5 w-170 h-125 px-6 border-0.2 border-black bg-white 
                        shadow-[-10px_10px_15px_rgba(64,126,167,0.5)] rounded-[30px] ml-10 mt-5 group-hover:-translate-y-2 transition-all">
                            <div className="border-black rounded-[30px] max-h-65 flex flex-col p-5 py-5 shadow-xl">
                                <h1 className="text-black font-bold hover:drop-shadow-xl">{"</>"} Student code</h1>
                                <div className=" rounded-[10px] py-3 mt-3 bg-black text-black p-1 px-2 flex flex-col whitespace-pre hover:underline hover:decoration-[black]/50 font-['Cutive_Mono']">
                                    <div className="flex gap-1.5 mb-2">
                                        <div className="size-2.5 rounded-full bg-red-500" />
                                        <div className="size-2.5 rounded-full bg-yellow-500" />
                                        <div className="size-2.5 rounded-full bg-green-500" />
                                    </div>
                                    <pre className={`${cutiveMono.className} w-60 h-35 text-sm text-blue-300 leading-relaxed`}>
                                        <Typewriter
                                            onInit={(typewriter) => {
                                                typewriter
                                                    .typeString('<span style="color: #f472b6;">function</span> <span style="color: #34d399;">factorial</span>(n) {')
                                                    .typeString('<br/>  <span style="color: #fb923c;">if</span> (n <= 1) {')
                                                    .typeString('<br/>    <span style="color: #f472b6;">return</span> 1;')
                                                    .typeString('<br/>  }')
                                                    .typeString('<br/>  <span style="color: #f472b6;">return</span> n * factorial(n-1);')
                                                    .typeString('<br/>}')
                                                    .start();
                                            }}
                                            options={{
                                                delay: 20, // Speed in ms
                                                cursor: '▋'
                                            }}
                                        />
                                    </pre>
                                </div>
                            </div>
                            <div className="w-70 h-110 border-black rounded-[30px] flex flex-col p-5 shadow-xl">
                                <h1 className="text-black font-bold hover:drop-shadow-lg">{"</>"} Student explaination</h1>
                                <div className="p-4 mt-3 w-60 bg-[#407EA7]/5 border border-[#407EA7]/10 rounded-2xl italic text-slate-600 text-sm ">
                                    <div>
                                        - The function hands off work to a smaller version of itself until it hits the base case.
                                    </div>
                                    <div>
                                        - Instead of calculating everything at once, the function "hands off" the work to a smaller version of the same function.
                                    </div>
                                    <div>
                                        - Once it hits the bottom, the results "bubble back up" to combine into the final answer.
                                    </div>
                                </div>
                                <ul className="space-y-1 text-sm text-[#407EA7] mt-3 ml-2 font-bold">
                                    <li className="before:content-['✔'] before:mr-2 before:text-green-500 hover:underline hover:decoration-[#407EA7]">
                                        Knowledge verification
                                    </li>
                                    <li className="before:content-['✔'] before:mr-2 before:text-green-500 hover:underline hover:decoration-[#407EA7]">
                                        Logic Defense
                                    </li>
                                    <li className="before:content-['✔'] before:mr-2 before:text-green-500 hover:underline hover:decoration-[#407EA7]">
                                        AI Prevention
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Landing section - 2 */}
            <div className="w-screen">
                <section className="relative bg-[#F8FAFC] py-20 overflow-hidden flex items-center justify-center">
                    <div className=" max-w-600 mx-20">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                            <div className="md:col-span-2 group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#407EA7]/70 to-[#2D5A78]/90 p-5 text-white transition-all hover:shadow-2xl hover:shadow-[#407EA7]/40">
                                <div className="relative z-10 h-full flex flex-col justify-between">
                                    <div>
                                        <div className="flex flex-row gap-4 mb-4">
                                            <div className="size-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                                                <PhoneIcon className="size-7 text-white" />
                                            </div>
                                            <h3 className="text-3xl font-bold mt-1">AI Agent Oral Defense</h3>
                                        </div>
                                        <p className="text-blue-100 max-w-md">Real-time voice verification that ensures students truly master their own code.</p>
                                    </div>
                                    <div className="mt-4 flex gap-6 text-sm font-bold">
                                        <span className="flex items-center gap-2"><div className="size-2 rounded-full bg-emerald-400 animate-pulse" /> Live Analysis</span>
                                        <span className="flex items-center gap-2"><div className="size-2 rounded-full bg-emerald-400 animate-pulse" /> Instant Grading</span>
                                    </div>
                                </div>
                                <PhoneIcon className="absolute -bottom-10 -right-10 size-64 text-white/5 -rotate-12 group-hover:rotate-0 transition-all duration-700" />
                            </div>

                            <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-5 group hover:bg-emerald-100 transition-all">
                                <div className="flex flex-row gap-4 mb-4">
                                    <div className="size-10 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                        <ShieldCheckIcon className="size-7 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-emerald-900 mt-1">Code comparison</h3>
                                </div>
                                <p className="text-emerald-700/80 leading-relaxed">Make sure students don't copy codes from others.</p>
                            </div>

                            <div className="rounded-2xl bg-[#407EA7]/5 border border-[#407EA7]/10 p-5 flex items-center gap-5 hover:bg-[#407EA7]/10 transition-all">
                                <div className="size-12 bg-white rounded-xl shadow-sm flex items-center justify-center"><CpuChipIcon className="size-6 text-purple-500" /></div>
                                <div><h4 className="font-bold text-slate-800">OpenAI + Twilio</h4><p className="text-xs text-slate-500">Modern AI Agents</p></div>
                            </div>

                            <div className="rounded-2xl bg-[#407EA7]/5 border border-[#407EA7]/10 p-5 flex items-center gap-5 hover:bg-[#407EA7]/10 transition-all">
                                <div className="size-12 bg-white rounded-xl shadow-sm flex items-center justify-center"><CommandLineIcon className="size-6 text-blue-500" /></div>
                                <div><h4 className="font-bold text-slate-800">Smart questions</h4><p className="text-xs text-slate-500">Generated questions based on each student code</p></div>
                            </div>

                            <div className="rounded-2xl bg-[#407EA7]/5 border border-[#407EA7]/10 p-5 flex items-center gap-5 hover:bg-[#407EA7]/10 transition-all">
                                <div className="size-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#407EA7] font-black text-xs">UTD</div>
                                <div><h4 className="font-bold text-slate-800">UTD Supported</h4><p className="text-xs text-slate-500">Most suitable for UTD environment</p></div>
                            </div>

                        </div>
                    </div>
                </section>
                {/* Landing section - 3 */}
                <section className="bg-[#F8FAFC] py-20 px-10 md:px-20 relative overflow-hidden">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-[#407EA7] text-4xl font-bold mb-4 italic">The Moment of Truth</h2>
                            <p className="text-slate-500 text-lg">Verbalize doesn't just scan your code, it starts a conversation to ensure you own the logic.</p>
                        </div>

                        <div className="relative border-l-2 border-[#407EA7]/20 ml-4 md:ml-20 space-y-12 pb-10">

                            <div className="relative pl-8 group">
                                <div className="absolute -left-[9px] top-1 size-4 bg-white border-2 border-black rounded-full group-hover:scale-150 group-hover:bg-[black] transition-transform" />
                                <div className="bg-gray-200 p-6 rounded-2xl border border-slate-100 shadow-sm group-hover:shadow-md transition-all">
                                    <span className="text-[10px] font-bold text-[#407EA7] uppercase tracking-widest">01. Submission Received</span>
                                    <h4 className="text-black font-bold text-lg mt-1">Professors update their students' codes</h4>
                                    <p className="text-slate-500 text-sm mt-2">System parses syntax and identifies the core recursive logic for the AI Agent to challenge.</p>
                                </div>
                            </div>

                            <div className="relative pl-8 group">
                                <div className="absolute -left-[9px] top-1 size-4 bg-white border-2 border-[#407EA7] rounded-full group-hover:scale-150 group-hover:bg-[#407EA7] transition-transform" />
                                <div className="bg-[#407EA7]/30 p-6 rounded-2xl border border-orange-100 shadow-sm group-hover:shadow-md transition-all">
                                    <span className="text-[10px] font-bold text-[#407EA7] uppercase tracking-widest">02. Live AI Challenge</span>
                                    <div className="flex items-start gap-4 mt-2">
                                        <div className="size-10 rounded-full bg-[#407EA7] flex items-center justify-center text-white shrink-0">
                                            <PhoneIcon className="size-5 animate-pulse" />
                                        </div>
                                        <div className="italic text-slate-700 text-sm bg-white p-3 rounded-lg border border-orange-100 italic">
                                            "I see you used a partition function. Can you explain why you chose the last element as the pivot, and what happens if the array is already sorted?"
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative pl-8 group">
                                <div className="absolute -left-[9px] top-1 size-4 bg-white border-2 border-emerald-500 rounded-full group-hover:scale-150 group-hover:bg-emerald-500 transition-transform" />
                                <div className="bg-emerald-200/50 p-6 rounded-2xl border border-emerald-100 shadow-sm group-hover:shadow-md transition-all">
                                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">03. Integrity Confirmed</span>
                                    <h4 className="text-black font-bold text-lg mt-1">Logic Authenticated</h4>
                                    <div className="mt-3 flex gap-2">
                                        <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-full">GRADE: A</span>
                                        <span className="px-3 py-1 bg-white border border-emerald-200 text-emerald-600 text-[10px] font-bold rounded-full">94% CONCEPTUAL MATCH</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Footer */}
                <section className="bg-[#F8FAFC] py-10 px-20 relative overflow-hidden z-0">
                    <div className="border-t border-slate-100 flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm">
                        <div className="flex items-center gap-2 mb-4 md:mb-0">
                            <div className="size-6 bg-[#407EA7] rounded-md" />
                            <span className="font-bold text-slate-600">Verbalize</span>
                            <span>© 2026 UTD ACM Projects</span>
                        </div>
                        <div className="flex gap-8">
                            <a href="#" className="hover:text-[#407EA7] transition-colors">Privacy</a>
                            <a href="#" className="hover:text-[#407EA7] transition-colors">Terms</a>
                            <a href="#" className="hover:text-[#407EA7] transition-colors">Github</a>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}