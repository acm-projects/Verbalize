"use client"; 
import Link from 'next/link';
import Image from 'next/image'; 
import { useState } from 'react';

export default function DashboardPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="bg-[#F8FAFC]">
      <div className={`flex h-screen transition-all duration-300 ${showModal ? 'blur-sm pointer-events-none' : ''}`}>
        
        {/* SIDEBAR: Switched from #262626 to a Deep Slate Blue with 50% brand depth */}
        <aside className="w-[130px] h-screen bg-black text-white flex flex-col p-3 justify-end pb-5 z-20 shadow-2xl relative overflow-hidden border-r border-[#5087A9]/20">
          <div className="space-y-4 font-bold pt-8 border-t border-white/10 flex flex-col items-start justify-end">
            {/* Settings button - Uses 10% & 20% rules */}
            <button className="w-full text-left rounded-xl flex items-center gap-2 text-white/90 hover:text-white transition-all group">
              <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
              </div>
              <span className="text-sm">Settings</span>
            </button>

            {/* Logout button */}
            <Link href="/landing">
              <button className="w-full text-left rounded-xl flex items-center gap-2 text-white/90 hover:text-white transition-all group">
                <div className="p-2 bg-white/10 rounded-lg group-hover:bg-red-500/20 transition-colors">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                </div>
                <div className="text-sm">Log out</div>
              </button>
            </Link>
          </div>
        </aside>

        <main className="flex-1 flex flex-col relative overflow-hidden">
          {/* HEADER: Brighter Glass - 50% main blue with 30% overlay */}
          <header className="h-[60px] relative flex items-center justify-between px-10 z-10 border-b border-[#5087A9]/20 bg-white/90 backdrop-blur-md">
            <div className="absolute inset-0 bg-[#f7f9fb]" />
            
            <input 
              type="text" 
              placeholder="🔍︎ Search for classes..." 
              className="relative w-[500px] h-[35px] rounded-xl px-6 text-slate-700 border border-[#5087A9]/30 bg-white/60 focus:bg-white transition-all outline-none text-sm shadow-sm" 
            />

            <div className="relative text-[#5087A9] font-black flex items-center gap-3 tracking-wide">
              <div className="bg-black p-2 rounded-full border border-[#5087A9]/20">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <span className="text-sm text-black">Professor</span>
            </div>
          </header>

          <div className="flex-1 bg-[#F1F5F9] overflow-y-auto">
            <div className="px-10 py-8">
              <div className="mb-12">
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Your Classes</h2>
                <p className="text-sm font-medium text-slate-500 mt-1">Manage assignments and track overall performance.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl">
                {/* Course Card 1 - Updated with brighter gradients */}
                <Link href="/assignments" className="block group">
                  <div className="bg-white rounded-xl overflow-hidden transition-all duration-300 border border-slate-200 shadow-xl shadow-slate-200/50 group-hover:-translate-y-1">
                    <div className="relative p-4 text-white overflow-hidden">
                      {/* 50% Brand Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#5087A9] to-[#3E6F8B]" />
                      
                      <div className="relative flex justify-between items-start">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">CS1200</p>
                          <h3 className="text-xl font-black mt-1">Ez Programming</h3>
                        </div>
                        <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold border border-white/30">Active</span>
                      </div>
                    </div>

                    <div className="p-4 ">
                      <div className="grid grid-cols-4 gap-2 mb-6">
                        {[
                          { label: 'Students', val: '60' },
                          { label: 'Tasks', val: '8' },
                          { label: 'Pending', val: '12' },
                          { label: 'Avg', val: '87%' }
                        ].map((m, i) => (
                          <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl text-center">
                            <p className="text-[9px] font-bold text-slate-400 uppercase">{m.label}</p>
                            <p className="font-black text-slate-800">{m.val}</p>
                          </div>
                        ))}
                      </div>
                      
                      {/* Progress - Uses 30% and 10% opacity rules */}
                      <div className="space-y-4">
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="h-full w-[82%] bg-[#5087A9] rounded-full shadow-[0_0_10px_rgba(80,135,169,0.3)]" />
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="h-full w-[60%] bg-[#5087A9]/60 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Create Class Card - Uses 10% dashed rule */}
                <div
                  onClick={() => setShowModal(true)}
                  className="h-full rounded-xl border-2 border-dashed border-[#5087A9]/30 bg-[#5087A9]/5 hover:bg-[#5087A9]/10 cursor-pointer transition-all flex flex-col items-center justify-center text-[#5087A9] group"
                >
                  <div className="size-16 rounded-xl bg-white shadow-lg shadow-[#5087A9]/10 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">+</div>
                  <p className="mt-4 font-black text-lg">Create a class</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* MODAL: Uses 100% white with 50% main blue accents */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-[550px] rounded-[40px] p-10 shadow-2xl relative border border-white">
            <h2 className="text-3xl font-black mb-8 text-slate-800">Add New Class</h2>
            <div className="space-y-6">
               <div className="flex flex-col gap-2">
                 <label className="font-bold text-slate-600 ml-1">Class Name</label>
                 <input type="text" className="bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-4 ring-[#5087A9]/10 transition-all outline-none" />
               </div>
               <button className="w-full bg-[#5087A9] py-4 rounded-2xl text-white font-black shadow-lg shadow-[#5087A9]/30 hover:bg-[#3d6a87] transition-all">
                 Initialize Course
               </button>
            </div>
            <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-500 transition-colors">✕</button>
          </div>
        </div>
      )}
    </div>
  );
}