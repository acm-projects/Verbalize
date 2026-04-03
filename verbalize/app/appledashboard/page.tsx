"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import CreateModal from "../components/shared/CreateModal";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

//
type Course = {
  id: number;
  course_name: string;
  section_num: string;
  created_at: string;
};

export default function DashboardPage() {
  const [openClassModal, setOpenClassModal] = useState(false);
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchCourses() {
      const { data, error } = await supabase
        .from("Course_Details")
        .select("*")
        .order("created_at", { ascending: false }); 

      if (error) {
        console.error("Error fetching courses:", error);
      } else if (data) {
        setCourses(data);
      }
      setLoading(false);
    }

    fetchCourses();
  }, []);

 
  const getMockProgress = (id: any) => {
    const num = Number(id) || 0; 
    
    return {
      students: (num % 50) + 20,
      submissionRate: (num % 40) + 50,
      gradingProgress: (num % 60) + 20,
    };
  };

  return (
    <>
      <main className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-20">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-[#407EA7]/10 bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-8">
            <div className="flex items-center gap-3">
              <div className="size-8 bg-[#407EA7] rounded-lg shadow-lg shadow-[#407EA7]/20 flex items-center justify-center text-white font-bold">V</div>
              <span className="text-xl font-bold tracking-tight text-slate-800">Verbalize</span>
            </div>

            <div className="flex-1 max-w-md mx-10">
              <div className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 focus-within:border-[#407EA7] focus-within:ring-1 focus-within:ring-[#407EA7]/20 transition-all">
                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input type="text" placeholder="Search classes..." className="bg-transparent text-sm outline-none w-full" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/landing" className="text-xs font-bold text-black hover:text-red-500 transition-colors">LOG OUT</Link>
              <div className="h-9 w-9 rounded-full bg-black border border-[#407EA7]/20 flex items-center justify-center text-white">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
            </div>
          </div>
        </header>

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left"
        >
          <section className="px-8 pt-12 pb-8 max-w-[1400px] mx-auto">
            <h1 className="text-3xl font-black text-slate-800 italic">Welcome back, Professor.</h1>
            <p className="text-slate-500 mt-1">Manage your course defenses and student progress.</p>
          </section>
        </motion.div>

        {/* Grid (Canvas Style) */}
        <section className="px-8 max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#407EA7]"></div>
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center text-slate-400 py-10 border-2 border-dashed border-slate-200 rounded-xl">
                No courses found. Create your first class!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {courses.map((course) => {
                  const mockData = getMockProgress(course.id);
                  return (
                    <Link
                      key={course.id}
                      href={`/course/${course.id}/assignments`}
                      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#407EA7]/10"
                    >
                      {/* Top */}
                      <div className="h-28 relative bg-[#407EA7] p-5 text-white">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#407EA7] to-[#2D5A78] opacity-90" />
                        <div className="relative z-10">
                          <div className="flex justify-between items-start">
                            {/* section_num */}
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Section {course.section_num}</span>
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold border backdrop-blur-md bg-emerald-500/50 text-white border-emerald-500/30">
                              Active
                            </span>
                          </div>
                          {/* course_name */}
                          <h2 className="mt-1 text-lg font-bold leading-tight group-hover:underline truncate">{course.course_name}</h2>
                          <p className="text-[11px] opacity-70">Spring 2026</p>
                        </div>
                      </div>

                      {/* Content: Mock UI */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-center text-xs text-slate-500 mb-4">
                          <span>{mockData.students} Students</span>
                          <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => <div key={i} className="size-5 rounded-full border-2 border-white bg-slate-200" />)}
                          </div>
                        </div>

                        {/* Progress bars */}
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-[10px] mb-1 font-bold text-slate-400 uppercase">
                              <span>Submissions</span>
                              <span className="text-[#407EA7]">{mockData.submissionRate}%</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                              <div className="h-full bg-[#407EA7] rounded-full" style={{ width: `${mockData.submissionRate}%` }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-[10px] mb-1 font-bold text-slate-400 uppercase">
                              <span>Graded</span>
                              <span className="text-emerald-500">{mockData.gradingProgress}%</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${mockData.gradingProgress}%` }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </motion.div>
        </section>

        {/* ADD CLASS */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => setOpenClassModal(true)}
          className="fixed bottom-8 right-8 z-[60] flex items-center gap-3 px-6 py-4 rounded-2xl cursor-pointer bg-slate-900 text-white shadow-2xl shadow-black/20 hover:bg-[#407EA7] hover:scale-105 active:scale-95 transition-all group"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/20 group-hover:bg-white/40">
            <span className="text-xl font-light">+</span>
          </div>
          <span className="font-bold tracking-tight">Add New Class</span>
        </motion.div>
      </main>

      <CreateModal
        open={openClassModal}
        mode="class"
        onClose={() => {
          setOpenClassModal(false);
          window.location.reload(); 
        }}
      />
    </>
  );
}