"use client";

import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion"; 
import CreateModal from "@/app/components/shared/CreateModal";
import { createClient } from "@/lib/supabase/client";

type QuestionResult = {
  id: string | number;
  score: number;
};

type AssignmentDetail = {
  name: string;
  status: "Completed" | "Pending";
  avgScore: number;
  questions: QuestionResult[]; 
};

type StudentGrade = {
  lastName: string;
  firstName: string;
  netId: string;
  avgGrade: number;
  details: AssignmentDetail[];
};

// Hardcoded data based on your CSV
const HARDCODED_STUDENTS: StudentGrade[] = [
  {
    firstName: "Harshitha",
    lastName: "Mahesh",
    netId: "dal267662",
    avgGrade: 42.5,
    details: [
      {
        name: "Temperature Tracker",
        status: "Completed",
        avgScore: 42.5,
        questions: [
          { id: 1, score: 85 },
          { id: 2, score: 0 },
        ],
      }
    ],
  },
  { firstName: "Rupesh", lastName: "Senthil", netId: "rxs240062", avgGrade: 0, details: [] },
  { firstName: "Sunay", lastName: "Shehaan", netId: "sxs230509", avgGrade: 0, details: [] },
  { firstName: "Sara", lastName: "Lee", netId: "sl321", avgGrade: 0, details: [] },
  { firstName: "David", lastName: "Brown", netId: "db654", avgGrade: 0, details: [] },
  { firstName: "Nguyen", lastName: "Huy", netId: "dal882689", avgGrade: 0, details: [] },
  { firstName: "Tom", lastName: "Cruise", netId: "xx8263", avgGrade: 0, details: [] },
  { firstName: "Justin", lastName: "Beiber", netId: "bb8y798324", avgGrade: 0, details: [] },
  { firstName: "Lebron", lastName: "James", netId: "lj71873", avgGrade: 0, details: [] },
  { firstName: "Steph", lastName: "Curry", netId: "sp3243432", avgGrade: 0, details: [] },
];

function getStatusStyle(status: "Completed" | "Pending") {
  if (status === "Completed") return "bg-green-100 text-green-700 border-green-200";
  return "bg-yellow-100 text-yellow-700 border-yellow-200";
}

export default function GradesPage({ params, }: { params: Promise<{ courseId: string }>; }) {
  const [openModal, setOpenModal] = useState(false);
  const [students, setStudents] = useState<StudentGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [openRows, setOpenRows] = useState<number[]>([]);

  const resolvedParams = use(params);
  const courseId = Number(resolvedParams.courseId);

  useEffect(() => {
    // Simulate a brief loading state then set the hardcoded data
    setLoading(true);
    const timer = setTimeout(() => {
      setStudents(HARDCODED_STUDENTS);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [courseId]);

  const toggleRow = (index: number) => {
    setOpenRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <>
      <div className="h-full">
        {/* HEADER */}
        <div className="flex justify-between items-center px-2 py-4 border-b border-gray-100 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Grades</h1>
            <p className="text-sm text-slate-500">Course ID: {courseId}</p>
          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="rounded-xl bg-[#5b92b9] px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-[#4a7a9c] transition-colors"
          >
            + Add Assignment
          </button>
        </div>

        {/* CONTENT */}
        <div className="space-y-8 px-2 py-2">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5b92b9]" />
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
              <h3 className="text-lg font-medium text-slate-600 mb-2">No students yet</h3>
              <p className="text-sm text-slate-400">Students will appear once submissions are made.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {students.map((student, index) => {
                const isOpen = openRows.includes(index);
                const completedDetails = student.details.filter(d => d.status === "Completed");
                const overallStatus = completedDetails.length > 0 ? "Completed" : "Pending";

                return (
                  <div key={index}>
                    {/* STUDENT CARD */}
                    <div className="flex items-center gap-4 rounded-xl border border-blue-200 bg-[#fbfbfc] px-4 py-4 shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
                      <button
                        onClick={() => toggleRow(index)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5b92b9] text-white transition hover:brightness-110"
                      >
                        <motion.span
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex items-center justify-center font-bold text-lg"
                        >
                          {isOpen ? "−" : "+"}
                        </motion.span>
                      </button>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-[16px] font-semibold text-[#5c8db4]">
                          {student.firstName} {student.lastName}
                        </h3>
                        <p className="text-[13px] text-[#8a8f98]">{student.netId}</p>
                      </div>

                      <div className="w-[140px] text-center">
                        <p className="text-[12px] uppercase text-[#9ca3af] font-semibold">Status</p>
                        <span className={`mt-2 inline-block rounded-full px-3 py-1 text-[12px] font-semibold ${getStatusStyle(overallStatus)}`}>
                          {overallStatus}
                        </span>
                      </div>

                      <div className="w-[140px] text-center">
                        <p className="text-[12px] uppercase text-[#9ca3af] font-semibold">Avg Grade</p>
                        <p className="mt-2 text-[20px] font-bold text-[#1d1d1f]">{student.avgGrade}%</p>
                      </div>
                    </div>

                    {/* EXPANDED DETAILS */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] }}
                          className="ml-12 space-y-3 overflow-hidden"
                        >
                          <div className="pt-3 space-y-3">
                            {completedDetails.length > 0 ? (
                              completedDetails.map((d, i) => (
                                <div
                                  key={i}
                                  className={`flex flex-col rounded-xl border px-5 py-3 ${getStatusStyle(d.status)}`}
                                >
                                  <div className="flex items-center justify-between border-b border-black/5 pb-2 mb-2">
                                    <div className="text-[13px] font-bold uppercase tracking-wide">{d.name}</div>
                                    <div className="text-[12px] opacity-70 italic">Assignment Avg: {d.avgScore}%</div>
                                  </div>
                                  
                                  <div className="flex flex-wrap gap-4">
                                    {d.questions.map((q, qIdx) => (
                                      <div key={q.id} className="flex items-center gap-2">
                                        <span className="text-[11px] font-bold opacity-60">Q{qIdx + 1}:</span>
                                        <span className="text-[14px] font-semibold">{q.score}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="px-5 py-2 text-[12px] text-slate-400 italic">
                                No completed assignments found for this student.
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <CreateModal
        open={openModal}
        mode="assignment"
        courseId={courseId}
        onClose={() => setOpenModal(false)}
      />
    </>
  );
}