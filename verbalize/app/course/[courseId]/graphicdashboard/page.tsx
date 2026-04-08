'use client';

import { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, Dot
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data for Bar Chart (Individual Assignments)
const ASSIGNMENTS_DETAILS = {
  "Assignment 1": {
    avg: 68.5,
    data: [
      { range: "0-20", students: 5 }, { range: "20-40", students: 8 },
      { range: "40-60", students: 15 }, { range: "60-80", students: 25 },
      { range: "80-100", students: 12 },
    ]
  },
  "Assignment 2": {
    avg: 81.2,
    data: [
      { range: "0-20", students: 2 }, { range: "20-40", students: 4 },
      { range: "40-60", students: 10 }, { range: "60-80", students: 30 },
      { range: "80-100", students: 20 },
    ]
  },
  "Assignment 3": {
    avg: 72.4,
    data: [
      { range: "0-20", students: 4 }, { range: "20-40", students: 10 },
      { range: "40-60", students: 18 }, { range: "60-80", students: 22 },
      { range: "80-100", students: 15 },
    ]
  }
};

// Mock data for Line Chart (The Trend)
const FULL_TREND_DATA = [
  { name: "Asgn 1", avg: 68.5 },
  { name: "Asgn 2", avg: 81.2 },
  { name: "Asgn 3", avg: 72.4 },
  { name: "Asgn 4", avg: 78.0 },
  { name: "Asgn 5", avg: 85.3 },
];

export default function GraphicDashboard() {
  const [selectedAsgn, setSelectedAsgn] = useState("Assignment 1");
  const [trendRange, setTrendRange] = useState("All");

  const currentSet = useMemo(() => 
    ASSIGNMENTS_DETAILS[selectedAsgn as keyof typeof ASSIGNMENTS_DETAILS], 
    [selectedAsgn]
  );

  const trendData = useMemo(() => {
    if (trendRange === "All") return FULL_TREND_DATA;
    return FULL_TREND_DATA.slice(-parseInt(trendRange));
  }, [trendRange]);

  return (
    <div className="h-full space-y-6">
      {/* 1. Header Section */}
      <div className="flex justify-between items-center px-2 py-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Score Analytics</h1>
          <p className="text-sm text-slate-500">Course ID: 11</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* TOP LEFT: Bar Chart for Current Assignment */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Score Distribution</h3>
            <select 
              value={selectedAsgn}
              onChange={(e) => setSelectedAsgn(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg px-3 py-1.5 outline-none focus:ring-2 ring-[#407EA7]/20 cursor-pointer"
            >
              {Object.keys(ASSIGNMENTS_DETAILS).map(key => <option key={key} value={key}>{key}</option>)}
            </select>
          </div>
          
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentSet.data} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                <Bar dataKey="students" isAnimationActive={true} animationDuration={1000} radius={[4, 4, 0, 0]} barSize={40}>
                  {currentSet.data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.range === "80-100" ? "#407EA7" : "#407EA740"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* TOP RIGHT: Avg & Metrics */}
        <div className="space-y-4">
          <motion.div 
            key={selectedAsgn}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#407EA7]/5 border border-[#407EA7]/10 p-6 rounded-xl"
          >
            <p className="text-[10px] font-black text-[#407EA7] uppercase">Avg. {selectedAsgn}</p>
            <h4 className="text-2xl font-black text-slate-800 mt-1">{currentSet.avg}%</h4>
            <div className="mt-4 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${currentSet.avg}%` }}
                 transition={{ duration: 1, ease: "easeOut" }}
                 className="h-full bg-[#407EA7]" 
               />
            </div>
          </motion.div>

          <div className="bg-white border border-slate-100 p-6 rounded-xl shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Integrity Alert</p>
            <h4 className="text-2xl font-black text-red-400 mt-1">{currentSet.data[0].students + currentSet.data[1].students}</h4>
            <p className="text-xs text-slate-400 mt-1 italic">Students in low-confidence range</p>
          </div>
        </div>

        {/* BOTTOM: Line Chart for Trends */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3 bg-white p-6 rounded-xl border border-slate-100 shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Average understanding over time</h3>
            </div>
            <div className="flex gap-2">
              {["3", "5", "All"].map(range => (
                <button 
                  key={range}
                  onClick={() => setTrendRange(range)}
                  className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${trendRange === range ? 'bg-[#407EA7] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  {range === "All" ? "All Time" : `Last ${range}`}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '12px' }} />
                <Line 
                  type="monotone" 
                  dataKey="avg" 
                  stroke="#407EA7" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: "#407EA7", strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}