'use client';

import { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

// Added "avg" field to each dataset for dynamic display
const ASSIGNMENTS_DATA = {
  "Assignment 1": {
    avg: 68.5,
    data: [
      { range: "0-20", students: 5 },
      { range: "20-40", students: 8 },
      { range: "40-60", students: 15 },
      { range: "60-80", students: 25 },
      { range: "80-100", students: 12 },
    ]
  },
  "Assignment 2": {
    avg: 81.2,
    data: [
      { range: "0-20", students: 2 },
      { range: "20-40", students: 4 },
      { range: "40-60", students: 10 },
      { range: "60-80", students: 30 },
      { range: "80-100", students: 20 },
    ]
  },
  "Overall": {
    avg: 74.8,
    data: [
      { range: "0-20", students: 7 },
      { range: "20-40", students: 12 },
      { range: "40-60", students: 25 },
      { range: "60-80", students: 55 },
      { range: "80-100", students: 32 },
    ]
  }
};

export default function GraphicDashboard() {
  const [selectedAssignment, setSelectedAssignment] = useState("Overall");

  // Get current dataset based on selection
  const currentSet = useMemo(() => 
    ASSIGNMENTS_DATA[selectedAssignment as keyof typeof ASSIGNMENTS_DATA], 
    [selectedAssignment]
  );

  return (
    <div className="h-full">
      {/* 1. Header Section */}
      <div className="flex justify-between items-center px-2 py-4 border-b border-gray-100 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Confidence Analysis</h1>
          <p className="text-sm text-slate-500">Course ID: 11</p>
        </div>
        
        <select 
          value={selectedAssignment}
          onChange={(e) => setSelectedAssignment(e.target.value)}
          className="bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl px-3 py-2 outline-none focus:ring-2 ring-[#407EA7]/20 transition-all cursor-pointer shadow-sm"
        >
          <option value="Overall">Overall Performance</option>
          <option value="Assignment 1">Assignment 1</option>
          <option value="Assignment 2">Assignment 2</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Interactive Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <div className="mb-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Student Distribution</h3>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentSet.data} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="range" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 11 }} 
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05)',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="students" radius={[4, 4, 0, 0]} barSize={45}>
                  {currentSet.data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.range === "80-100" ? "#407EA7" : "#407EA760"} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Dynamic Insight Panels */}
        <div className="flex flex-col gap-4">
          
          {/* Dynamic AVG Confidence Card */}
          <div className="bg-[#407EA7]/5 border border-[#407EA7]/10 p-5 rounded-xl transition-all duration-500">
            <p className="text-[10px] font-black text-[#407EA7] uppercase tracking-tighter">
              {selectedAssignment === "Overall" ? "Overall Avg. Confidence" : `Avg. ${selectedAssignment}`}
            </p>
            <h4 className="text-2xl font-black text-slate-800 mt-1">
              {currentSet.avg}%
            </h4>
            <div className="mt-2 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
               <div 
                 className="h-full bg-[#407EA7] transition-all duration-700 ease-out" 
                 style={{ width: `${currentSet.avg}%` }}
               />
            </div>
            <p className="text-[10px] text-slate-400 mt-2 italic">Based on real-time AI oral defense metrics</p>
          </div>

          <div className="bg-white border border-slate-100 p-5 rounded-xl shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter tracking-widest">Low Score Warnings</p>
            <h4 className="text-3xl font-black text-red-400 mt-1">
              {currentSet.data[0].students + currentSet.data[1].students}
            </h4>
            <p className="text-xs text-slate-400 mt-1">Students below 40% threshold</p>
          </div>

          <div className="bg-slate-900 p-5 py-5 rounded-xl text-white flex-1 flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Active Filter</p>
              <h4 className="text-lg font-bold mt-1 text-[#407EA7]">{selectedAssignment}</h4>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}