"use client";

import Link from "next/link";
import { useState } from "react";
import CreateModal from "../components/shared/CreateModal";
import MainBG from "../assets/main-bg.jpg";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const [openClassModal, setOpenClassModal] = useState(false);

  const courses = [
    { code: "CS1200", title: "Ez Programming", term: "Spring 2026", status: "Active", students: 60, submissionRate: 82, gradingProgress: 60 },
    { code: "CS3345", title: "Data Structures", term: "Spring 2026", status: "Active", students: 42, submissionRate: 74, gradingProgress: 48 },
    { code: "CS4337", title: "Programming Paradigms", term: "Spring 2026", status: "Active", students: 38, submissionRate: 79, gradingProgress: 66 },
    { code: "CS3162", title: "Professional Communication", term: "Spring 2026", status: "Draft", students: 28, submissionRate: 58, gradingProgress: 42 },
  ];


  const cardThemes = [
    { from: "from-[#407EA7]", to: "to-[#2D5A78]", shadow: "shadow-[#407EA7]/10", progress: "text-[#407EA7]", bgProgress: "bg-[#407EA7]" },
    { from: "from-[#5D5CDE]", to: "to-[#4847B0]", shadow: "shadow-[#5D5CDE]/10", progress: "text-[#5D5CDE]", bgProgress: "bg-[#5D5CDE]" },
    { from: "from-[#0F766E]", to: "to-[#0D9488]", shadow: "shadow-[#0F766E]/10", progress: "text-[#0F766E]", bgProgress: "bg-[#0F766E]" },
    { from: "from-[#6366F1]", to: "to-[#4F46E5]", shadow: "shadow-[#6366F1]/10", progress: "text-[#6366F1]", bgProgress: "bg-[#6366F1]" },
  ];

  const getStatusStyle = (status: string) => {
    return status === "Active"
      ? "bg-emerald-500/50 text-white border-emerald-500/30"
      : "bg-red-500/50 text-white border-slate-500/30";
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course, index) => {
                // Chọn theme dựa trên index để tạo màu sắc khác nhau
                const theme = cardThemes[index % cardThemes.length];
                
                return (
                  <Link
                    key={index}
                    href="/assignments"
                    className={`group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ${theme.shadow}`}
                  >
                    {/* Top: Header với Gradient thay đổi */}
                    <div className="h-28 relative p-5 text-white">
                      <div className={`absolute inset-0 bg-gradient-to-br ${theme.from} ${theme.to} opacity-90`} />
                      <div className="relative z-10">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{course.code}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border backdrop-blur-md ${getStatusStyle(course.status)}`}>
                            {course.status}
                          </span>
                        </div>
                        <h2 className="mt-1 text-lg font-bold leading-tight group-hover:underline">{course.title}</h2>
                        <p className="text-[11px] opacity-70">{course.term}</p>
                      </div>
                    </div>

                    {/* Content: Thông tin tóm tắt */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-xs text-slate-500 mb-4">
                        <span>{course.students} Students</span>
                        <div className="flex -space-x-2">
                          {[1, 2, 3].map(i => <div key={i} className="size-5 rounded-full border-2 border-white bg-slate-200" />)}
                        </div>
                      </div>

                      {/* Progress bars */}
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-[10px] mb-1 font-bold text-slate-400 uppercase">
                            <span>Submissions</span>
                            <span className={theme.progress}>{course.submissionRate}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                            <div className={`h-full ${theme.bgProgress} rounded-full`} style={{ width: `${course.submissionRate}%` }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[10px] mb-1 font-bold text-slate-400 uppercase">
                            <span>Graded</span>
                            <span className="text-emerald-500">{course.gradingProgress}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${course.gradingProgress}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </section>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => setOpenClassModal(true)}
          className="fixed bottom-8 right-8 z-[60] flex items-center gap-3 px-6 py-4 rounded-2xl bg-slate-900 text-white shadow-2xl shadow-black/20 hover:bg-[#407EA7] hover:scale-105 active:scale-95 transition-all group"
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
        onClose={() => setOpenClassModal(false)}
      />
    </>
  );
}