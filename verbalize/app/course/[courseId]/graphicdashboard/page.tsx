'use client';

import { useState, useMemo, useEffect, use } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from "@/lib/supabase/client";

export default function GraphicDashboard({ params }: { params: Promise<{ courseId: string }> }) {
  const supabase = createClient();
  const resolvedParams = use(params);
  const courseId = Number(resolvedParams.courseId);

  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedAsgn, setSelectedAsgn] = useState("");
  const [trendRange, setTrendRange] = useState("All");
  const [assignmentData, setAssignmentData] = useState<any>({});
  const [trendDataList, setTrendDataList] = useState<any[]>([]);

  useEffect(() => {
    setIsClient(true);
    async function fetchAnalytics() {
      if (!courseId) return;

      const { data, error } = await supabase
        .from("Submissions")
        .select(`
          assignment_id,
          Assignments!inner ( assignment_name, course_id ),
          Results ( confidence_score )
        `)
        .eq("Assignments.course_id", courseId);

      if (error || !data || data.length === 0) {
        setLoading(false);
        return;
      }

      const grouped: any = {};
      data.forEach(sub => {
        const assignment = Array.isArray(sub.Assignments) ? sub.Assignments[0] : sub.Assignments;

        const title = assignment?.assignment_name || `Assignment ${sub.assignment_id}`;
        const scores = sub.Results?.map((r: any) => r.confidence_score).filter((s: any) => s !== null) || [];

        if (!grouped[title]) grouped[title] = [];
        grouped[title].push(...scores);
      });

      const finalDetails: any = {};
      const trends: any[] = [];

      Object.entries(grouped).forEach(([title, scores]: [string, any]) => {
        if (scores.length === 0) return;

        const avg = scores.reduce((a: number, b: number) => a + b, 0) / scores.length;
        const ranges = [
          { range: "0-20", students: scores.filter((s: number) => s < 20).length },
          { range: "20-40", students: scores.filter((s: number) => s >= 20 && s < 40).length },
          { range: "40-60", students: scores.filter((s: number) => s >= 40 && s < 60).length },
          { range: "60-80", students: scores.filter((s: number) => s >= 60 && s < 80).length },
          { range: "80-100", students: scores.filter((s: number) => s >= 80).length },
        ];

        finalDetails[title] = { avg: Math.round(avg), data: ranges };
        trends.push({ name: title, avg: Math.round(avg) });
      });

      setAssignmentData(finalDetails);
      setTrendDataList(trends);
      if (Object.keys(finalDetails).length > 0) setSelectedAsgn(Object.keys(finalDetails)[0]);
      setLoading(false);
    }
    fetchAnalytics();
  }, [courseId]);

  const currentSet = useMemo(() => assignmentData[selectedAsgn] || null, [selectedAsgn, assignmentData]);
  console.log("Current Set:", currentSet);
  const trendData = useMemo(() => trendRange === "All" ? trendDataList : trendDataList.slice(-parseInt(trendRange)), [trendRange, trendDataList]);

  if (loading) return <div className="p-20 text-center animate-pulse text-slate-400">Fetching Course Analytics...</div>;

  return (
    <div className="h-full space-y-6 pb-12">
      <div className="flex justify-between items-center px-2 py-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Score Analytics</h1>
          <p className="text-sm text-slate-500">Course ID: {courseId}</p>
        </div>
      </div>

      {!currentSet ? (
        <div className="py-20 text-center border-2 border-dashed rounded-xl bg-slate-50">
          <p className="text-slate-400">No submission results found for this course.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-sm min-h-0">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Score Distribution</h3>
              <select value={selectedAsgn} onChange={(e) => setSelectedAsgn(e.target.value)} className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg px-3 py-1.5 outline-none">
                {Object.keys(assignmentData).map(key => <option key={key} value={key}>{key}</option>)}
              </select>
            </div>
            <div className="h-[250px] w-full">
              {isClient && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={currentSet.data} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                    <Bar dataKey="students" radius={[4, 4, 0, 0]} barSize={40}>
                      {currentSet.data.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.range === "80-100" ? "#407EA7" : "#407EA740"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>

          <div className="space-y-4">
            <motion.div key={selectedAsgn} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#407EA7]/5 border border-[#407EA7]/10 p-6 rounded-xl">
              <p className="text-[10px] font-black text-[#407EA7] uppercase">Avg. Understanding</p>
              <h4 className="text-2xl font-black text-slate-800 mt-1">{currentSet.avg}%</h4>
              <div className="mt-4 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${currentSet.avg}%` }} transition={{ duration: 1 }} className="h-full bg-[#407EA7]" />
              </div>
            </motion.div>
            <div className="bg-white border border-slate-100 p-6 rounded-xl shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Integrity Alert
              </p>
              <h4 className="text-3xl font-black text-red-500 mt-1">
                {currentSet?.data ? (currentSet.data[0].students + currentSet.data[1].students) : 0}
              </h4>
              <p className="text-xs text-slate-400 mt-1 italic">
                Students in low-confidence range
              </p>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-3 bg-white p-6 rounded-xl border border-slate-100 shadow-sm min-h-0">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Average understanding over time</h3>
              <div className="flex gap-2">
                {["3", "5", "All"].map(range => (
                  <button key={range} onClick={() => setTrendRange(range)} className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${trendRange === range ? 'bg-[#407EA7] text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>{range === "All" ? "All Time" : `Last ${range}`}</button>
                ))}
              </div>
            </div>

            <div className="h-[200px] w-full">
              {isClient && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
                      dy={10}
                    />

                    <YAxis
                      domain={[0, 100]}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 10 }}
                      tickFormatter={(val) => `${val}%`}
                    />

                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value: any) => [`${value}%`, 'Average Score']}
                    />

                    <Line
                      type="monotone"
                      dataKey="avg"
                      stroke="#407EA7"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#407EA7", stroke: "#fff", strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

