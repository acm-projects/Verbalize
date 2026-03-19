// This page is a common component designed for the top box of the assignment/grade/student pages. It also displays a modal when "add assignment" is clicked on these three pages.
"use client";
import { useState } from 'react';
import Link from 'next/link';

// Accepts the activePage parameter to determine which navigation link is highlighted
export default function ClassroomHeader({ activePage }) {
  const [showModal, setShowModal] = useState(false); 

  return (
    <>
      {/* Blur layer: Added here! This ensures that when the modal is open, the Header and the content below it are blurred */}
      <div className="">
        <header className="relative text-white p-3 bg-gradient-to-br from-[#3E6F8B] via-[#5087A9] to-[#2F3A4A]">
          <div className="w-full max-h-100 pl-10 pr-4 mx-20">
            <div className="flex items-center gap-8 relative">
              
              {/* Left arrow always returns to the Dashboard */}
              <Link href="/appledashboard" className="text-white transition-all duration-300 ease-out hover:-translate-x-2 cursor-pointer block group relative">
                {/* Add an outer halo that only appears on hover */}
              <div className="absolute inset-[-8px] bg-white/0 group-hover:bg-white/10 rounded-full transition-colors duration-300"></div>

                <svg 
                  width="28" 
                  height="28" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.6)] transition-all"
                >
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
              </Link>
              
              <div className="h-12 w-[1px] bg-white/30"></div>
              <div>
                <div className="flex items-center gap-3 text-sm font-bold text-white/80">
                  <span>CS 1200</span>
                  <span>Spring 2026</span>
                </div>
                <h1 className="text-xl font-extrabold tracking-wide">Fundamental Programming</h1>
              </div>
            </div>

            {/* Navigation bar: Use activePage to determine which link should have the white underline */}
            <nav className="flex items-end gap-8 text-sm font-bold mt-5">
              <Link href="/assignments" className={`cursor-pointer transition-opacity border-b-4 ${activePage === 'assignments' ? 'border-white opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                Assignments
              </Link>
              <Link href="/students" className={`cursor-pointer transition-opacity border-b-4 ${activePage === 'students' ? 'border-white opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                Students
              </Link>
              <Link href="/grades" className={`cursor-pointer transition-opacity border-b-4 ${activePage === 'grades' ? 'border-white opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                Grades
              </Link>
              
              <button onClick={() => setShowModal(true)} className="border-b-4 border-transparent opacity-60 hover:opacity-100 self-end transition-opacity">
                + Add Assignments
              </button>
            </nav>
          </div>
        </header>
      </div>

      {/* The modal code also stays in this common file */}
      {/* 3. Modal layer: Acts as a "sibling node" to the blur layer, attached just below the outermost large container */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
          <div className="bg-white w-[600px] rounded-[40px] p-10 shadow-2xl relative">
            <h2 className="text-3xl font-black mb-8 text-[#1E293B]">Create an assignment</h2>

            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="font-bold text-lg">Assignment name</label>
                <input type="text" className="bg-gray-100 rounded-xl p-4 outline-none focus:ring-2 ring-[#5087A9]/20" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-lg">Due date</label>
                  <input type="text" className="bg-gray-100 rounded-xl p-4" placeholder="DD - MM - YYYY" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-lg">File</label>
                  <div className="bg-gray-100 rounded-xl p-4 text-gray-400 cursor-pointer text-center">
                    Upload file
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-bold text-lg">Instruction</label>
                <textarea className="bg-gray-100 rounded-2xl p-6 h-40 resize-none outline-none" />
              </div>

              <div className="flex justify-end gap-4 mt-4">
                <button 
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 text-gray-400 font-bold hover:text-gray-600"
                >
                  Cancel
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 text-[#1E293B] font-bold px-10 py-3 rounded-xl shadow-sm transition-all active:scale-95">
                  Submit
                </button>
              </div>
            </div>

            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-8 right-8 text-gray-300 hover:text-gray-500 text-2xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}