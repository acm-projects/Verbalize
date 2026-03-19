"use client";
import LandingBG from '../assets/landing-bg.jpg';
import { Cutive_Mono, Cormorant } from 'next/font/google';
import { PhoneIcon, ShieldCheckIcon, CpuChipIcon, CommandLineIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { motion } from 'framer-motion'; 
import Typewriter from 'typewriter-effect';

const cutiveMono = Cutive_Mono({
    weight: '400',
    subsets: ['latin'],
});

const cormorant = Cormorant({ subsets: ['latin'] });

// Animation Variants
const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
};

const staggerContainer = {
    initial: {},
    whileInView: { transition: { staggerChildren: 0.1 } }
};

export default function LandingPage() {
    return (
        <div className="overflow-hidden selection:bg-[#407EA7] selection:text-white">
            {/* Logo - Name - Login */}
            <nav className="fixed top-0 w-full h-[50px] z-[100] flex justify-between items-center px-10 md:px-20 bg-[#F8FAFC]/90 backdrop-blur-md border-b border-[#407EA7]/10">
                <div className="flex items-center gap-3">
                    <div className="size-8 bg-gradient-to-br from-[#407EA7] to-[#2D5A78] rounded-lg shadow-lg shadow-[#407EA7]/20 flex items-center justify-center text-white" />
                    <span className="text-slate-900 font-black text-xl tracking-tight">Verbalize</span>
                </div>
                <Link href="/login">
                    <button className="px-5 py-1.5 rounded-full bg-black text-white text-sm font-bold hover:bg-[#356a8c] hover:shadow-lg hover:shadow-[#407EA7]/30 transition-all active:scale-95">
                        Sign In
                    </button>
                </Link>
            </nav>

            {/* Landing Section - 1 */}
            <div className="relative w-screen min-h-173 bg-cover bg-center py-20 flex flex-col bg-[#F8FAFC]/95 bg-blend-overlay overflow-hidden"
                style={{ backgroundImage: `url(${LandingBG.src})` }}>
                
                {/* Decorative Background Blobs */}
                <div className="absolute top-40 -right-20 size-96 bg-[#407EA7]/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-20 -left-20 size-80 bg-slate-200/50 rounded-full blur-[100px]" />

                <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAFC]/20 via-[#F8FAFC]/20 to-[#F8FAFC]" />

                <div className="p-5 flex flex-row justify-center px-20 z-10 gap-50">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center lg:text-left"
                    >
                        <h1 className="text-[#407EA7] text-2xl md:text-7xl font-black leading-tight tracking-tighter drop-shadow-sm">
                            Beyond the <br /> <span className="text-slate-900">syntax.</span>
                        </h1>
                        <p className="mt-8 text-xl text-slate-600 max-w-120 leading-relaxed font-medium">
                            Verbalize is a web-based automated oral defense platform where students verbally explain their code logic and design choices through voice calls.
                        </p>
                        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link href="/login">
                                <button className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-2xl hover:bg-[#407EA7] hover:shadow-[#407EA7]/30 transition-all transform hover:-translate-y-1">
                                    Get Started
                                </button>
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="group relative"
                    >
                        {/* Interactive UI Card */}
                        <div className="flex flex-col md:flex-row justify-center gap-6 p-6 border border-slate-200 bg-white/80 backdrop-blur-sm 
                        shadow-[-10px_10px_15px_rgba(64,126,167,0.5)] rounded-[30px] group-hover:-translate-y-2 transition-all duration-500">
                            
                            <div className="rounded-[25px] h-70 flex flex-col p-5 shadow-sm border border-slate-50 bg-white">
                                <h1 className="text-black font-bold flex items-center gap-2">
                                    <span className="text-[#407EA7]">{"</>"}</span> Student code
                                </h1>
                                <div className="rounded-[15px] py-4 mt-3 bg-black text-white p-4 flex flex-col transition-all group-hover:shadow-[0_0_20px_rgba(52,211,153,0.15)]">
                                    <div className="flex gap-1.5 mb-4">
                                        <div className="size-2.5 rounded-full bg-red-500" />
                                        <div className="size-2.5 rounded-full bg-yellow-500" />
                                        <div className="size-2.5 rounded-full bg-green-500" />
                                    </div>
                                    <pre className={`${cutiveMono.className} w-full md:w-64 h-37 text-sm text-blue-300 leading-relaxed overflow-hidden`}>
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
                                            options={{ delay: 20, cursor: '▋'}}
                                        />
                                    </pre>
                                </div>
                            </div>

                            <div className="md:w-72 border-slate-100 rounded-[25px] flex flex-col p-5 shadow-sm bg-white">
                                <h1 className="text-black font-bold">{"</>"} Explanation</h1>
                                <div className="p-4 mt-3 bg-[#407EA7]/5 border border-[#407EA7]/10 rounded-2xl italic text-slate-600 leading-relaxed">
                                    <p className="mb-2">• The function hands off work to a smaller version of itself.</p>
                                    <p className="mb-2">• Instead of calculating at once, it "hands off" work.</p>
                                    <p>• Once it hits the bottom, results "bubble back up".</p>
                                </div>
                                <ul className="space-y-2 text-sm text-[#407EA7] mt-5 font-bold">
                                    <li className="flex items-center gap-2 hover:translate-x-1 transition-transform">
                                        <span className="text-green-500">✔</span> Knowledge verification
                                    </li>
                                    <li className="flex items-center gap-2 hover:translate-x-1 transition-transform">
                                        <span className="text-green-500">✔</span> Logic Defense
                                    </li>
                                    <li className="flex items-center gap-2 hover:translate-x-1 transition-transform">
                                        <span className="text-green-500">✔</span> AI Prevention
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Landing section - 2 (Features) */}
            <section className="relative bg-[#F8FAFC] py-10 overflow-hidden">
                <motion.div 
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true }}
                    className="max-w-7xl mx-auto px-10"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <motion.div variants={fadeInUp} className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#407EA7] to-[#2D5A78] p-8 text-white transition-all hover:shadow-2xl hover:shadow-[#407EA7]/40">
                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="size-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                                            <PhoneIcon className="size-7 text-white animate-[bounce_3s_infinite]" />
                                        </div>
                                        <h3 className="text-3xl font-bold">AI Agent Oral Defense</h3>
                                    </div>
                                    <p className="text-blue-100 text-lg max-w-md">Real-time voice verification that ensures students truly master their own code.</p>
                                </div>
                                <div className="flex gap-6 text-sm font-bold">
                                    <span className="flex items-center gap-2"><div className="size-2 rounded-full bg-emerald-400 animate-pulse" /> Live Analysis</span>
                                    <span className="flex items-center gap-2"><div className="size-2 rounded-full bg-emerald-400 animate-pulse" /> Instant Grading</span>
                                </div>
                            </div>
                            <PhoneIcon className="absolute -bottom-10 -right-10 size-64 text-white/5 -rotate-12 group-hover:rotate-0 transition-all duration-700" />
                        </motion.div>

                        <motion.div variants={fadeInUp} className="rounded-3xl bg-emerald-50 border border-emerald-100 p-8 group hover:bg-emerald-100 transition-all transform hover:-translate-y-1">
                            <div className="flex flex-col gap-4">
                                <div className="size-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                    <ShieldCheckIcon className="size-7 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-emerald-900">Code comparison</h3>
                                <p className="text-emerald-700/80 leading-relaxed">Advanced similarity detection to ensure academic integrity and original logic.</p>
                            </div>
                        </motion.div>

                        {/* Smaller Feature Cards */}
                        <motion.div variants={fadeInUp} className="rounded-2xl bg-white border border-slate-100 p-5 flex items-center gap-5 hover:scale-[1.02] transition-all shadow-sm">
                            <div className="size-12 bg-[#407EA7]/10 rounded-xl flex items-center justify-center"><CpuChipIcon className="size-6 text-[#407EA7]" /></div>
                            <div><h4 className="font-bold text-slate-800">OpenAI + Twilio</h4><p className="text-xs text-slate-500">Modern AI Voice Agents</p></div>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="rounded-2xl bg-white border border-slate-100 p-5 flex items-center gap-5 hover:scale-[1.02] transition-all shadow-sm">
                            <div className="size-12 bg-[#407EA7]/10 rounded-xl flex items-center justify-center"><CommandLineIcon className="size-6 text-[#407EA7]" /></div>
                            <div><h4 className="font-bold text-slate-800">Smart questions</h4><p className="text-xs text-slate-500">Context-aware logic probes</p></div>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="rounded-2xl bg-white border border-slate-100 p-5 flex items-center gap-5 hover:scale-[1.02] transition-all shadow-sm">
                            <div className="size-12 bg-[#407EA7] rounded-xl flex items-center justify-center text-white font-black text-xs">UTD</div>
                            <div><h4 className="font-bold text-slate-800">UTD Supported</h4><p className="text-xs text-slate-500">Built for Comet education</p></div>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* Landing section - 3 (Timeline) */}
            <section className="bg-[#F8FAFC] py-24 px-10 md:px-20 relative overflow-hidden">
                <div className="max-w-4xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-[#407EA7] text-5xl font-bold mb-4 italic">The Moment of Truth</h2>
                        <p className="text-slate-500 text-lg">Verbalize starts a conversation to ensure you own the logic.</p>
                    </motion.div>

                    <div className="relative border-l-2 border-[#407EA7]/20 ml-4 md:ml-20 space-y-12 pb-10">
                        {/* Step 01 */}
                        <motion.div 
                            variants={fadeInUp}
                            initial="initial"
                            whileInView="whileInView"
                            className="relative pl-8 group"
                        >
                            <div className="absolute -left-[9px] top-1 size-4 bg-white border-2 border-slate-900 rounded-full group-hover:scale-150 group-hover:bg-slate-900 transition-transform" />
                            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm group-hover:shadow-xl transition-all">
                                <span className="text-[10px] font-bold text-[#407EA7] uppercase tracking-widest">01. Submission Received</span>
                                <h4 className="text-slate-900 font-bold text-xl mt-1">Professors upload student code</h4>
                                <p className="text-slate-500 text-sm mt-3 leading-relaxed">System parses syntax and identifies core logic for the AI Agent to challenge during the call.</p>
                            </div>
                        </motion.div>

                        {/* Step 02 */}
                        <motion.div 
                            variants={fadeInUp}
                            initial="initial"
                            whileInView="whileInView"
                            className="relative pl-8 group"
                        >
                            <div className="absolute -left-[9px] top-1 size-4 bg-white border-2 border-[#407EA7] rounded-full group-hover:scale-150 group-hover:bg-[#407EA7] transition-transform" />
                            <div className="bg-[#407EA7]/5 p-8 rounded-3xl border border-[#407EA7]/10 shadow-sm group-hover:shadow-xl transition-all">
                                <span className="text-[10px] font-bold text-[#407EA7] uppercase tracking-widest">02. Live AI Challenge</span>
                                <div className="flex items-start gap-5 mt-4">
                                    <div className="size-12 rounded-2xl bg-[#407EA7] flex items-center justify-center text-white shrink-0 shadow-lg shadow-[#407EA7]/20">
                                        <PhoneIcon className="size-6 animate-pulse" />
                                    </div>
                                    <div className="italic text-slate-700 text-sm bg-white p-4 rounded-2xl border border-[#407EA7]/10 shadow-sm relative">
                                        <div className="absolute -left-2 top-4 size-4 bg-white rotate-45 border-l border-b border-[#407EA7]/10" />
                                        "I see you used a partition function. Can you explain why you chose the last element as the pivot?"
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Step 03 */}
                        <motion.div 
                            variants={fadeInUp}
                            initial="initial"
                            whileInView="whileInView"
                            className="relative pl-8 group"
                        >
                            <div className="absolute -left-[9px] top-1 size-4 bg-white border-2 border-emerald-500 rounded-full group-hover:scale-150 group-hover:bg-emerald-500 transition-transform" />
                            <div className="bg-emerald-50/50 p-8 rounded-3xl border border-emerald-100 shadow-sm group-hover:shadow-xl transition-all">
                                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">03. Integrity Confirmed</span>
                                <h4 className="text-slate-900 font-bold text-xl mt-1">Logic Authenticated</h4>
                                <div className="mt-4 flex gap-3">
                                    <span className="px-4 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-full">GRADE: A</span>
                                    <span className="px-4 py-1.5 bg-white border border-emerald-200 text-emerald-600 text-xs font-bold rounded-full">94% CONCEPTUAL MATCH</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white py-5 px-20 border-t border-slate-100">
                <div className=" mx-auto flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm">
                    <div className="flex items-center gap-3 mb-6 md:mb-0">
                        <div className="size-7 bg-[#407EA7] rounded-lg" />
                        <span className="font-bold text-slate-800 text-lg">Verbalize</span>
                        <span className="ml-2 pl-2 border-l border-slate-200">© 2026 UTD ACM Projects</span>
                    </div>
                    <div className="flex gap-10">
                        <a href="#" className="hover:text-[#407EA7] transition-colors font-medium">Privacy</a>
                        <a href="#" className="hover:text-[#407EA7] transition-colors font-medium">Terms</a>
                        <a href="#" className="hover:text-[#407EA7] transition-colors font-medium">Github</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}