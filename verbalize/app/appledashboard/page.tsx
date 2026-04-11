"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import CreateModal from "../components/shared/CreateModal";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

// Student structure
type Course = {
  id: number;
  course_name: string;
  section_num: string;
  created_at: string;
};

// We will store the dynamic stats in a separate state since we aren't changing the Course type
type CourseStats = {
  [key: number]: {
    studentCount: number;
    submissionRate: number;
    gradingProgress: number;
  };
};

export default function DashboardPage() {
  const [openClassModal, setOpenClassModal] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<CourseStats>({});
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchCoursesAndStats() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        console.error("No logged-in user");
        setLoading(false);
        return;
      }

      // 1. Fetch Courses
      const { data: courseData, error: courseError } = await supabase
        .from("Course_Details")
        .select("*")
        .eq("professor_id", user.id)
        .order("created_at", { ascending: false });

      if (courseError) {
        console.error("Error fetching courses:", courseError);
        setLoading(false);
        return;
      }

      if (courseData) {
        setCourses(courseData);

        // 2. Fetch real stats for each course
        const newStats: CourseStats = {};

        await Promise.all(
          courseData.map(async (course) => {
            // Count actual students
            const { count: studentCount } = await supabase
              .from("Course_Students")
              .select("*", { count: "exact", head: true })
              .eq("course_id", course.id);

            // Get assignments to determine expected submissions
            const { data: assignments } = await supabase
              .from("Assignments")
              .select("id")
              .eq("course_id", course.id);
            
            const assignmentIds = assignments?.map(a => a.id) || [];

            // Get actual submissions for these assignments
            const { count: submissionCount } = await supabase
              .from("Submissions")
              .select("*", { count: "exact", head: true })
              .in("assignment_id", assignmentIds);

            // Get total graded results (rows in Results table linked to these submissions)
            const { data: subData } = await supabase
              .from("Submissions")
              .select("id")
              .in("assignment_id", assignmentIds);
            
            const subIds = subData?.map(s => s.id) || [];
            
            const { count: gradedCount } = await supabase
              .from("Results")
              .select("id", { count: "exact", head: true })
              .in("submission_id", subIds);

            // Calculations
            const totalStudents = studentCount || 0;
            const totalAssignments = assignments?.length || 0;
            const expectedTotal = totalStudents * totalAssignments;
            
            const subRate = expectedTotal > 0 
              ? Math.round(((submissionCount || 0) / expectedTotal) * 100) 
              : 0;
            
            const gradeProgress = (submissionCount || 0) > 0 
              ? Math.round(((gradedCount || 0) / (submissionCount || 0)) * 100) 
              : 0;

            newStats[course.id] = {
              studentCount: totalStudents,
              submissionRate: subRate,
              gradingProgress: gradeProgress
            };
          })
        );

        setStats(newStats);
      }
      setLoading(false);
    }

    fetchCoursesAndStats();
  }, []);

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
            <p className="text-slate-500 mt-1">Manage your courses and view student progress.</p>
          </section>
        </motion.div>

        {/* Grid */}
        <section className="px-8 max-w-[1400px] mx-auto">
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
                const courseStat = stats[course.id] || { studentCount: 0, submissionRate: 0, gradingProgress: 0 };
                
                return (
                  <Link
                    key={course.id}
                    href={`/course/${course.id}/assignments`}
                    className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#407EA7]/10"
                  >
                    <div className="h-28 relative bg-[#407EA7] p-5 text-white">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#407EA7] to-[#2D5A78] opacity-90" />
                      <div className="relative z-10">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Section {course.section_num}</span>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold border backdrop-blur-md bg-emerald-500/50 text-white border-emerald-500/30">Active</span>
                        </div>
                        <h2 className="mt-1 text-lg font-bold leading-tight group-hover:underline truncate">{course.course_name}</h2>
                        <p className="text-[11px] opacity-70">Spring 2026</p>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-xs text-slate-500 mb-4">
                        <span>{courseStat.studentCount} Students</span>
                        <div className="flex -space-x-2">
                          {[1, 2, 3].map(i => <div key={i} className="size-5 rounded-full border-2 border-white bg-slate-200" />)}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-[10px] mb-1 font-bold text-slate-400 uppercase">
                            <span>Submissions</span>
                            <span className="text-[#407EA7]">{courseStat.submissionRate}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                            <div 
                              className="h-full bg-[#407EA7] rounded-full transition-all duration-700" 
                              style={{ width: `${courseStat.submissionRate}%` }} 
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[10px] mb-1 font-bold text-slate-400 uppercase">
                            <span>Graded</span>
                            <span className="text-emerald-500">{courseStat.gradingProgress}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500 rounded-full transition-all duration-700" 
                              style={{ width: `${courseStat.gradingProgress}%` }} 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <button
        onClick={() => setOpenClassModal(true)}
        className="fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-[#407EA7] text-white shadow-2xl hover:scale-110 transition-transform active:scale-95 z-50"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
      </button>

      <CreateModal
        open={openClassModal}
        mode="class"
        onClose={() => setOpenClassModal(false)}
      />
    </>
  );
}
