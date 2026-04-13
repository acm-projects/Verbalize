'use client';

import { useState, useMemo, useEffect, use } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line
} from 'recharts';
import { motion } from 'framer-motion';
import { createClient } from "@/lib/supabase/client";

export default function GraphicDashboard({ params }: { params: Promise<{ courseId: string }> }) {
  const supabase = createClient();
  const resolvedParams = use(params);
  const courseId = Number(resolvedParams.courseId);

  const [selectedAsgn, setSelectedAsgn] = useState<string>("");
  const [trendRange, setTrendRange] = useState("All");
  const [loading, setLoading] = useState(true);
  
  const [assignmentsDetails, setAssignmentsDetails] = useState<any>({});
  const [fullTrendData, setFullTrendData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchAnalyticsData() {
      if (!courseId) return;
      setLoading(true);

      const { data: assignments } = await supabase
        .from("Assignments")
        .select("id, assignment_name")
        .eq("course_id", courseId);

      const { data: submissions, error } = await supabase
        .from("Submissions")
        .select(`
          assignment_id,
          Results ( confidence_score )
        `)
        .in("assignment_id", assignments?.map(a => a.id) || []);

      if (error || !submissions || !assignments) {
        setLoading(false);
        return;
      }

      const details: any = {};
      const trend: any[] = [];

      assignments.forEach((asgn) => {
        const asgnSubmissions = submissions.filter(s => s.assignment_id === asgn.id);
        
        const scores = asgnSubmissions.flatMap(s => 
          (s.Results as any[] || []).map(r => r.confidence_score || 0)
        );

        const distribution = [
          { range: "0-20", students: scores.filter(s => s <= 20).length },
          { range: "20-40", students: scores.filter(s => s > 20 && s <= 40).length },
          { range: "40-60", students: scores.filter(s => s > 40 && s <= 60).length },
          { range: "60-80", students: scores.filter(s => s > 60 && s <= 80).length },
          { range: "80-100", students: scores.filter(s => s > 80).length },
        ];

        const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

        details[asgn.assignment_name] = {
          avg,
          data: distribution
        };

        trend.push({ name: asgn.assignment_name, avg });
      });

      setAssignmentsDetails(details);
      setFullTrendData(trend);
      
      if (assignments.length > 0 && !selectedAsgn) {
        setSelectedAsgn(assignments[0].assignment_name);
      }
      
      setLoading(false);
    }

    fetchAnalyticsData();
  }, [courseId]);

  const currentSet = useMemo(() => 
    assignmentsDetails[selectedAsgn] || { avg: 0, data: [] }, 
    [selectedAsgn, assignmentsDetails]
  );

  const trendData = useMemo(() => {
    if (trendRange === "All") return fullTrendData;
    return fullTrendData.slice(-parseInt(trendRange));
  }, [trendRange, fullTrendData]);

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#407EA7]" />
    </div>
  );

  return (
    <div className="h-full space-y-6">
      <div className="flex justify-between items-center px-2 py-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Score Analytics</h1>
          <p className="text-sm text-slate-500">Course ID: {courseId}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              {Object.keys(assignmentsDetails).map(key => <option key={key} value={key}>{key}</option>)}
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
                  {currentSet.data.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.range === "80-100" ? "#407EA7" : "#407EA740"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

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
            <h4 className="text-2xl font-black text-red-400 mt-1">
              {(currentSet.data[0]?.students || 0) + (currentSet.data[1]?.students || 0)}
            </h4>
            <p className="text-xs text-slate-400 mt-1 italic">Students in low-confidence range</p>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3 bg-white p-6 rounded-xl border border-slate-100 shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Average understanding over time</h3>
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