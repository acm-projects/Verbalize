"use client";
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Mock global summary data
const globalSummary = {
  totalStudents: 185,
  pendingCalls: 24,
  completionRate: 82
};

export default function DashboardSidebar({ activePage = 'dashboard' }) {
  // State for AI Q&A input box
  const [aiQuestion, setAiQuestion] = useState("");

  // Dynamically determine the AI bubble's title and text
  let aiTitle = "Welcome, Prof.";
  let aiMessage = ""; 
  
  switch (activePage) {
    case 'assignments':
      aiTitle = "Assignments";
      aiMessage = "Here are your weekly assignments. The AI Agent will use these to challenge your students.";
      break;
    case 'students':
      aiTitle = "Student Analysis";
      aiMessage = "Review student code and my interview transcripts here. I've highlighted key logic for you.";
      break;
    case 'grades':
      aiTitle = "Final Grading";
      aiMessage = "Check the oral defense call statuses. You have the final say on the grades based on my evaluations.";
      break;
  }

  return (
    // Outermost container: Fixed on the left side
<aside className="w-[300px] h-screen fixed top-0 left-0 z-50 flex flex-col justify-between p-10 border-r border-white/20 shadow-2xl transition-all duration-500
  /* Core: Gradient background + frosted glass effect */
  bg-gradient-to-b from-[#5087A9]/90 via-[#407EA7]/95 to-[#2C5A78] backdrop-blur-md">
  
  {/* Add a very thin bright edge on top of the gradient layer to enhance texture */}
  <div className="absolute inset-y-0 right-0 w-[1px] bg-white/10"></div>
      
      {/* Top: Robot, bubble, input box */}
      <div className="flex flex-col gap-8 items-center mt-2">
        
        {/* Robot avatar */}
        <div className="w-[100px] h-[100px] rounded-full bg-white/10 p-1 flex items-center justify-center border-2 border-white/20 shadow-[0_0_20px_rgba(134,215,255,0.3)]">
          {/* Use a real image, eliminate emojis! */}
          <Image src="/robot.png" alt="Verbalize AI" width={80} height={80} className="rounded-full object-cover" />
        </div>

        {/* AI report bubble */}
        <div className="w-full bg-gradient-to-br from-white to-[#F8FAFC] rounded-2xl p-6 text-[#1E293B] shadow-xl relative border border-white">
          <h2 className="text-base font-black mb-3 text-[#5087A9]">{aiTitle}</h2>
          
          {/* Magic check: Display data on Dashboard, show prompt text on other pages */}
          {activePage === 'dashboard' ? (
            <div className="flex flex-col gap-3 font-bold text-sm">
              <div className="flex justify-between items-center text-gray-500">
                <span>Total Students:</span>
                <span className="text-[#1E293B] text-base">{globalSummary.totalStudents}</span>
              </div>
              <div className="flex justify-between items-center text-gray-500">
                <span>Pending Calls:</span>
                <span className="text-[#ff6b6b] text-base">{globalSummary.pendingCalls}</span>
              </div>
              <div className="flex justify-between items-center text-gray-500">
                <span>Avg. Completion:</span>
                <span className="text-[#5087A9] text-base">{globalSummary.completionRate}%</span>
              </div>
            </div>
          ) : (
            <p className="text-sm font-bold text-gray-500 leading-relaxed">
              {aiMessage}
            </p>
          )}

          {/* Bubble's small triangle */}
          <div className="absolute top-[-8px] left-[50%] -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-white"></div>
        </div>
        
        {/* Consult AI box: Persistent feature */}
        <div className="w-full relative">
          <input 
            type="text"
            value={aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
            placeholder="Ask Verbalize AI..." 
            className="w-full bg-white/10 rounded-full pl-11 pr-4 py-3 text-xs font-bold placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#86D7FF] transition-all"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 text-sm">✨</span>
        </div>
      </div>

      {/* Bottom: Global navigation bar (Persistent) */}
<nav className="w-full flex flex-col gap-4 font-bold text-lg border-t border-white/20 pt-8">
  
  {/* 1. Classes: Selected highlight state */}
  <Link 
    href="/dashboard" 
    className={`w-full flex items-center gap-4 pb-2 border-b-2 transition-all group ${
      activePage === 'dashboard' 
        ? 'text-white border-white opacity-100' // Selected: Pure white + 100% brightness
        : 'text-white/60 border-transparent hover:text-white/90' // Unselected: 60% soft white -> Hover 90%
    }`}
  >
    <div className={`p-2 rounded-lg transition-colors ${activePage === 'dashboard' ? 'bg-white/20' : 'bg-white/10 group-hover:bg-white/20'}`}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
      </svg>
    </div>
    <span>Classes</span>
  </Link>
  
  {/* 2. Settings: Unselected state */}
  <Link 
    href="/settings" 
    className={`w-full flex items-center gap-4 pb-2 border-b-2 transition-all group ${
      activePage === 'settings' 
        ? 'text-white border-white opacity-100' 
        : 'text-white/60 border-transparent hover:text-white/90'
    }`}
  >
    <div className={`p-2 rounded-lg transition-colors ${activePage === 'settings' ? 'bg-white/20' : 'bg-white/10 group-hover:bg-white/20'}`}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
      </svg>
    </div>
    <span>Settings</span>
  </Link>
  
  {/* 3. Log out: Red hover feedback */}
  <Link 
    href="/logout" 
    className="w-full flex items-center gap-4 pb-2 border-b-2 border-transparent text-white/60 hover:text-white transition-all group"
  >
    <div className="p-2 bg-white/10 rounded-lg group-hover:bg-red-500/20 transition-colors">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
      </svg>
    </div>
    <span>Log out</span>
  </Link>
</nav>
    </aside>
  );
}