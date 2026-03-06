"use client";
import { useState } from 'react';
// Import the top Header common component
import ClassroomHeader from '../addassignmentPublic'; 
// Import the AI sidebar component
import DashboardSidebar from '../dashboard/dashboardSidebar';

export default function AssignmentsPage() {
  
  // Keep assignmentData and periods data
  const assignmentData = [
    { id: 1, period: "This week", title: "While & For loops", status: "Active", date: "19-02-2026", progress: 60, count: "25/45" },
    { id: 2, period: "Next week", title: "Functions & Scope", status: "Upcoming", date: "26-02-2026", progress: 0, count: "0/45" },
    { id: 3, period: "Next week", title: "Arrays & Objects", status: "Upcoming", date: "02-03-2026", progress: 0, count: "0/45" },
    { id: 4, period: "Next month", title: "Final Project Phase 1", status: "Locked", date: "15-03-2026", progress: 0, count: "0/45" },
  ];
  const periods = ["This week", "Next week", "Next month"];

  return (
    // Outermost container
    <div className="min-h-screen bg-[#F8FAFC] relative">
      
      {/* 1. Insert the left AI sidebar, fixed to the left! */}
      <DashboardSidebar activePage="assignments" />

      {/* 2. Core magic: Wrap everything on the right with this div and push it 300px to the right! */}
      <div className="ml-[300px]">
        
        {/* Top Header */}
        <ClassroomHeader activePage="assignments" />

        {/* Core list content below */}
        <main className="w-full max-w-7xl py-10 pl-10 pr-4">
          {periods.map((period) => (
            <section key={period} className="mb-12">
              <h2 className="text-2xl font-black mb-6">{period}</h2>
              
              <div className="flex flex-col gap-4">
                {assignmentData
                  .filter((item) => item.period === period)
                  .map((task) => (
                    <div key={task.id} className={`relative flex items-center justify-between p-6 bg-white rounded-2xl shadow-sm border border-gray-100 transition-all ${task.period === 'Next month' ? 'opacity-40 grayscale-[50%] pointer-events-none' : 'opacity-100 hover:shadow-md'}`}>
                      
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold text-[#5087A9]">{task.title}</h3>
                          <span className={`text-[10px] text-white px-2 py-0.5 rounded-full font-bold ${task.status === 'Active' ? 'bg-[#86D7FF]' : 'bg-gray-300'}`}>
                            {task.status}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm font-medium">Exercise for {task.title.toLowerCase()}</p>
                      </div>

                      <div className="flex items-center gap-12">
                        <div className="text-center">
                          <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Due Date</p>
                          <p className="font-bold text-sm">📅 {task.date}</p>
                        </div>

                        <div className="text-center min-w-[120px]">
                          <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Phone Called</p>
                          <div className="w-full bg-gray-100 h-1.5 rounded-full mb-1">
                            <div className={`h-full rounded-full ${task.progress > 0 ? 'bg-[#5087A9]' : 'bg-gray-200'}`} style={{ width: `${task.progress}%` }}></div>
                          </div>
                          <p className="text-[10px] font-bold">{task.count}</p>
                        </div>
                        <button className="text-gray-300 font-bold text-xl ml-4 hover:text-[#5087A9]">{">"}</button>
                      </div>
                      
                      <div className="absolute right-[-65px] top-1/2 -translate-y-1/2 bg-[#5087A9] text-white text-[10px] px-3 py-1.5 rounded-full font-black uppercase shadow-md cursor-pointer hover:scale-110 transition-transform z-10">
                          Email
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          ))}
        </main>
      
      </div> {/* <--- The 300px push wrapper closes here! */}

    </div>
  );
}