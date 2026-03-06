// The dashboard has a separate left sidebar design. The dashboardSiderBar is a common sidebar designed for the assignment/student/grades pages.
// However, the general feedback on the sidebar is to remove it. I am currently considering deleting it; this is just the current code.

"use client"; // Ensure this line is at the very top
import Link from 'next/link';
import Image from 'next/image'; // Import the Image component to display the robot image
import { useState } from 'react';

// Mock AI summary data
const globalSummary = {
  totalStudents: 185,
  pendingCalls: 24,
  completionRate: 82
};

export default function DashboardPage() {
  const [showModal, setShowModal] = useState(false);
  const [aiQuestion, setAiQuestion] = useState(""); // State for the AI Q&A input box

  return (
    // 1. Outermost container
    <div className="bg-[#F8FAFC]">
      
      {/* The blur layer must wrap the sidebar and main content! Note that the closing tag has been removed here */}
      <div className={`flex h-screen transition-all duration-300 ${showModal ? 'blur-sm pointer-events-none' : ''}`}>
        
        
      {/* 1. Container upgrade: Apply top-to-bottom darkening gradient + frosted glass effect */}
      <aside className="w-[300px] h-screen bg-gradient-to-b from-[#5087A9]/90 via-[#407EA7]/95 to-[#2C5A78] backdrop-blur-xl text-white flex flex-col justify-between p-8 z-20 shadow-2xl relative overflow-hidden border-r border-white/20">
        
        {/* Top area: AI robot image and data report */}
        <div className="flex flex-col gap-10 items-center mt-4">
          
          {/* Robot avatar: Add breathing halo effect */}
          <div className="w-[120px] h-[120px] rounded-full bg-white/10 p-2 flex items-center justify-center border-4 border-white/20 shadow-[0_0_30px_rgba(134,215,255,0.4)] transition-transform hover:scale-105 duration-500">
            <Image src="/robot.png" alt="Verbalize AI" width={100} height={100} className="object-cover rounded-full" />
          </div>

          {/* AI report bubble: Add subtle gradient to enhance texture */}
          <div className="w-full bg-gradient-to-br from-white to-[#F8FAFC] rounded-2xl p-6 text-[#1E293B] shadow-xl relative border border-white/50">
            <h2 className="text-lg font-black mb-4 tracking-wide text-[#5087A9]">Welcome, Prof!</h2>
            <div className="flex flex-col gap-3 font-bold text-sm">
              <div className="flex justify-between items-center text-gray-500/80">
                <span>Total Students:</span>
                <span className="text-[#1E293B] text-base">{globalSummary.totalStudents}</span>
              </div>
              <div className="flex justify-between items-center text-gray-500/80">
                <span>Pending Calls:</span>
                <span className="text-[#FF8A8A] text-base font-black">{globalSummary.pendingCalls}</span>
              </div>
              <div className="flex justify-between items-center text-gray-500/80">
                <span>Avg. Completion:</span>
                <span className="text-[#5087A9] text-base">{globalSummary.completionRate}%</span>
              </div>
            </div>

            {/* Small triangle decoration */}
            <div className="absolute top-[-10px] left-[50%] -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[10px] border-b-white"></div>
          </div>
    
      {/* 2. AI consultation input box: Changed to semi-transparent white to resolve black overlap, text changed to pure white */}
      <div className="w-full relative">
        <input 
          type="text"
          value={aiQuestion}
          onChange={(e) => setAiQuestion(e.target.value)}
          placeholder="Ask Verbalize AI..." 
          className="w-full bg-white/10 rounded-full pl-12 pr-6 py-3 text-sm font-bold text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all border border-white/10"
        />
        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-white/70">✨</span>
      </div>
    </div>

      {/* 3. Bottom navigation: Switch to white text, book/gear icons, and icon backgrounds */}
      <div className="space-y-4 font-bold text-lg pt-8 border-t border-white/10">
        
        {/* Settings button */}
        <button className="w-full text-left p-3 hover:bg-white/10 rounded-xl flex items-center gap-4 text-white/80 hover:text-white transition-all group">
          <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </div>
          <span>Settings</span>
        </button>

      {/* Logout button */}
      <button className="w-full text-left p-3 hover:bg-white/10 rounded-xl flex items-center gap-4 text-white/80 hover:text-white transition-all group text-white/60">
        <div className="p-2 bg-white/10 rounded-lg group-hover:bg-red-500/20 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </div>
        <span>Log out</span>
      </button>
    </div>
  </aside>

        {/* 3. Right main content area */}
          <main className="flex-1 flex flex-col relative overflow-hidden">
            {/* Header: Premium gradient based on #5087A9 + glass effect */}
            <header className="h-[118px] relative flex items-center justify-between px-10 z-10 border-b border-white/10">
              {/* Background gradient layer */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#3E6F8B] via-[#5087A9] to-[#2F3A4A]" />
              {/* Slight texture/highlight */}
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.10),transparent_40%)]" />
              {/* Bottom vignette to make content more three-dimensional */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30" />

              {/* Search (more glass-like) */}
              <div className="relative w-[620px] h-[56px] rounded-full px-6 flex items-center text-white/60 border border-white/15 bg-white/10 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
                <span className="mr-2">🔍</span> Search for the class..
              </div>

              {/* Top right Professor */}
              <div className="relative text-white font-black flex items-center gap-3 tracking-wide">
                <div className="bg-white/12 p-2 rounded-full border border-white/20 backdrop-blur-md shadow-[0_10px_25px_rgba(0,0,0,0.18)]">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                Professor
              </div>
            </header>

            {/* Main content area */}
            <div className="flex-1 bg-[#F6F7FB] overflow-y-auto">
              {/* Top content container: Limit width to make the two-column cards more evenly distributed and premium */}
              <div className="px-10 py-10">
                <div className="flex items-start justify-between gap-8 mb-8">
                  <div>
                    <h2 className="text-4xl font-extrabold text-[#0F172A]">Your classes</h2>
                    <p className="text-sm font-semibold text-gray-500 mt-2">
                      Track enrollment, assignments, grading workload, and overall performance.
                    </p>
                  </div>

                  {/* Status pill (kept, but better matches the main color) */}
                  <div className="hidden md:flex items-center gap-3 bg-white rounded-2xl px-4 py-3 border border-gray-100 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                    <p className="text-sm font-bold text-[#0F172A]">All systems normal</p>
                  </div>
                </div>

                {/* Content area: Use max-w to control even distribution of two columns + increase column spacing */}
                <div className="relative">
                  {/* Grid: Two per row + wider gap */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full max-w-6xl">
                    {/* ===== Course Card 1 ===== */}
                    <Link href="/assignments" className="block">
                      <div className="bg-white rounded-3xl overflow-hidden h-[285px] transition-all duration-300 border border-gray-100 shadow-[0_14px_50px_rgba(15,23,42,0.10)] hover:shadow-[0_20px_70px_rgba(15,23,42,0.16)] hover:-translate-y-1 cursor-pointer">
                        {/* Header: Tech gradient based on #5087A9 */}
                        <div className="relative p-6 text-white">
                          <div className="absolute inset-0 bg-gradient-to-br from-[#2F3A4A] via-[#3E6F8B] to-[#5087A9]" />
                          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.18),transparent_45%),radial-gradient(circle_at_85%_30%,rgba(255,255,255,0.10),transparent_40%)]" />
                          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/35" />

                          <div className="relative flex items-start justify-between">
                            <div>
                              <p className="text-xs font-extrabold opacity-85 tracking-wider">CS1200</p>
                              <h3 className="text-xl font-extrabold leading-tight mt-1">Ez Programming</h3>
                              <p className="text-xs opacity-75 mt-1">Spring 2026 · Section 01</p>
                            </div>

                            <span className="text-[11px] font-extrabold bg-white/12 border border-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                              Active
                            </span>
                          </div>
                        </div>

              <div className="p-5 flex flex-col gap-4">
                {/* Metrics */}
                <div className="grid grid-cols-4 gap-3">
                  <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Students</p>
                    <p className="text-lg font-extrabold text-[#0F172A] leading-none mt-1">60</p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Assignments</p>
                    <p className="text-lg font-extrabold text-[#0F172A] leading-none mt-1">8</p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Pending</p>
                    <p className="text-lg font-extrabold text-[#0F172A] leading-none mt-1">12</p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Avg Score</p>
                    <p className="text-lg font-extrabold text-[#0F172A] leading-none mt-1">87%</p>
                  </div>
                </div>

                {/* Progress bar: More unified with the main color scheme */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-[11px] font-bold text-gray-500">
                    <span>Submission rate</span>
                    <span className="text-[#0F172A]">82%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="h-full w-[82%] bg-[#5087A9] rounded-full"></div>
                  </div>

                  <div className="flex justify-between text-[11px] font-bold text-gray-500 mt-1">
                    <span>Grading progress</span>
                    <span className="text-[#0F172A]">60%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="h-full w-[60%] bg-[#3E6F8B] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* ===== Course Card 2 ===== */}
          <div className="bg-white rounded-3xl overflow-hidden h-[285px] transition-all duration-300 border border-gray-100 shadow-[0_14px_50px_rgba(15,23,42,0.10)] hover:shadow-[0_20px_70px_rgba(15,23,42,0.16)] hover:-translate-y-1 cursor-pointer lg:translate-x-8">
            <div className="relative p-6 text-white">
              <div className="absolute inset-0 bg-gradient-to-br from-[#2F3A4A] via-[#3E6F8B] to-[#5087A9]" />
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.18),transparent_45%),radial-gradient(circle_at_85%_30%,rgba(255,255,255,0.10),transparent_40%)]" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/35" />

              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-xs font-extrabold opacity-85 tracking-wider">CS3345</p>
                  <h3 className="text-xl font-extrabold leading-tight mt-1">Data Structures</h3>
                  <p className="text-xs opacity-75 mt-1">Spring 2026 · Section 02</p>
                </div>

                <span className="text-[11px] font-extrabold bg-white/12 border border-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                  Active
                </span>
              </div>
            </div>

            <div className="p-5 flex flex-col gap-4">
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Students</p>
                  <p className="text-lg font-extrabold text-[#0F172A] leading-none mt-1">42</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Assignments</p>
                  <p className="text-lg font-extrabold text-[#0F172A] leading-none mt-1">6</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Pending</p>
                  <p className="text-lg font-extrabold text-[#0F172A] leading-none mt-1">7</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Avg Score</p>
                  <p className="text-lg font-extrabold text-[#0F172A] leading-none mt-1">91%</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-[11px] font-bold text-gray-500">
                  <span>Submission rate</span>
                  <span className="text-[#0F172A]">74%</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="h-full w-[74%] bg-[#5087A9] rounded-full"></div>
                </div>

                <div className="flex justify-between text-[11px] font-bold text-gray-500 mt-1">
                  <span>Grading progress</span>
                  <span className="text-[#0F172A]">48%</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="h-full w-[48%] bg-[#3E6F8B] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>



          {/* ===== Draft Card ===== */}
          <div className="h-[285px] rounded-3xl bg-white border border-gray-100 shadow-[0_12px_40px_rgba(15,23,42,0.06)] flex flex-col justify-between overflow-hidden">
            <div className="relative p-6 text-white">
              <div className="absolute inset-0 bg-gradient-to-br from-[#111827] via-[#1F2A37] to-[#0B1220]" />
              <div className="absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_45%)]" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/35" />

              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-xs font-extrabold opacity-80 tracking-wider">DRAFT</p>
                  <h3 className="text-xl font-extrabold leading-tight mt-1">New Course</h3>
                  <p className="text-xs opacity-75 mt-1">Not published</p>
                </div>
                <span className="text-[11px] font-extrabold bg-white/12 border border-white/20 px-3 py-1 rounded-full">
                  Draft
                </span>
              </div>
            </div>

            <div className="p-5">
              <p className="text-sm font-semibold text-gray-500">
                Set up syllabus, grading scheme, and invite students when ready.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 w-full h-11 rounded-2xl bg-[#0B1220] text-white font-extrabold hover:opacity-90 transition"
              >
                Continue setup
              </button>
            </div>
          </div>
          {/* ===== Create Card ===== */}
          <div
            onClick={() => setShowModal(true)}
            className="h-[285px] rounded-3xl border-2 border-dashed border-gray-200 bg-white/70 hover:bg-white cursor-pointer transition shadow-[0_12px_40px_rgba(15,23,42,0.05)] flex flex-col items-center justify-center text-gray-500 lg:translate-x-8"
          >
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-3xl text-gray-400">
              +
            </div>
            <p className="mt-4 font-extrabold text-[#0F172A]">Create a class</p>
            <p className="text-sm font-semibold text-gray-500 mt-1">Add course details and roster</p>
          </div>
        </div>

        {/* Bottom right floating +: Kept, but avoids "squeezing" the cards */}
        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-8 right-8 w-[60px] h-[60px] bg-[#0B1220] rounded-2xl shadow-[0_18px_50px_rgba(0,0,0,0.25)] flex items-center justify-center text-white text-3xl font-light hover:scale-105 transition-transform"
          aria-label="Create class"
        >
          +
        </button>
      </div>
    </div>
  </div>
</main>
      
      </div> {/* This is the closing tag for the blur layer wrapping the sidebar and main content! */}
      {/* 3. Modal layer: Kept exactly as is */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
          <div className="bg-white w-[600px] rounded-[40px] p-10 shadow-2xl relative">
            <h2 className="text-3xl font-black mb-8 text-[#1E293B]">Create a new class</h2>
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="font-bold text-lg">Class name</label>
                <input type="text" className="bg-gray-100 rounded-xl p-4 outline-none focus:ring-2 ring-[#86D7FF]/30 transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-lg">Course code</label>
                  <input type="text" className="bg-gray-100 rounded-xl p-4 outline-none focus:ring-2 ring-[#86D7FF]/30 transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-lg">Section</label>
                  <input type="text" className="bg-gray-100 rounded-xl p-4 outline-none focus:ring-2 ring-[#86D7FF]/30 transition-all" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-bold text-lg">Student file</label>
                <div className="bg-gray-100 rounded-2xl p-6 h-40 border-2 border-transparent hover:border-gray-300 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors group">
                   <span className="text-gray-400 font-bold group-hover:text-gray-500">Drop file here or click to upload</span>
                </div>
              </div>
              <div className="flex justify-end mt-8">
                <button className="bg-[#5087A9] hover:bg-[#3d6a87] text-white font-bold px-10 py-3 rounded-xl shadow-sm transition-all active:scale-95">
                  Submit
                </button>
              </div>
            </div>
            <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 text-gray-300 hover:text-gray-500 text-2xl">
              ✕
            </button>
          </div>
        </div>
      )}
    </div> 
  );
}