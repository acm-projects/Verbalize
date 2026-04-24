"use client";

import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion"; 
import { createClient } from "@/lib/supabase/client";

type QuestionResult = {
  id: string | number;
  score: number;
};

type AssignmentDetail = {
  name: string;
  status: "Completed" | "Pending";
  avgScore: number;
  questions: QuestionResult[]; // Holds individual scores
};

type StudentGrade = {
  lastName: string;
  firstName: string;
  netId: string;
  avgGrade: number;
  details: AssignmentDetail[];
};

function getStatusStyle(status: "Completed" | "Pending") {
  if (status === "Completed") return "bg-green-100 text-green-700 border-green-200";
  return "bg-yellow-100 text-yellow-700 border-yellow-200";
}

export default function GradesPage({ params, }: { params: Promise<{ courseId: string }>; }) {
  const [students, setStudents] = useState<StudentGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [openRows, setOpenRows] = useState<number[]>([]);

  const supabase = createClient();
  const resolvedParams = use(params);
  const courseId = Number(resolvedParams.courseId);

  useEffect(() => {
    async function fetchStudents() {
      if (!courseId) return;
      setLoading(true);

      const { data: courseStudents, error } = await supabase
        .from("Course_Students")
        .select(`
          student_id,
          Students ( id, last_name, first_name, netID )
        `)
        .eq("course_id", courseId);

      if (error) {
        console.error("Error fetching course students:", error);
        setLoading(false);
        return;
      }

      const finalStudents: StudentGrade[] = await Promise.all(
        courseStudents.map(async (record: any) => {
          const s = record.Students;

          const { data: submissions } = await supabase
            .from("Submissions")
            .select(`
                  id,
                  assignment_id,
                  Assignments!inner ( assignment_name, course_id ),
                  Results ( id, confidence_score ) 
                `)
            .eq("student_id", s.id)
            .eq("Assignments.course_id", courseId);

          let totalOverall = 0;
          let countOverall = 0;
          const details: AssignmentDetail[] = [];

          submissions?.forEach((sub: any) => {
            const results = sub.Results || [];
            const hasResults = results.length > 0;

            // Extract individual scores
            const questions: QuestionResult[] = results.map((r: any) => ({
              id: r.id,
              score: Math.round(r.confidence_score || 0)
            }));

            let assignmentAvg = 0;
            if (hasResults) {
              const sum = results.reduce((acc: number, curr: any) => acc + (curr.confidence_score || 0), 0);
              assignmentAvg = sum / results.length;
              totalOverall += assignmentAvg;
              countOverall++;
            }

            details.push({
              name: sub.Assignments?.assignment_name || `Assignment ${sub.assignment_id}`,
              status: hasResults ? "Completed" : "Pending",
              avgScore: Math.round(assignmentAvg),
              questions: questions,
            });
          });

          const avgGrade = countOverall > 0 ? totalOverall / countOverall : 0;

          return {
            lastName: s?.last_name || "Unknown",
            firstName: s?.first_name || "Unknown",
            netId: s?.netID || "N/A",
            avgGrade: Math.round(avgGrade),
            details,
          };
        })
      );

      setStudents(finalStudents);
      setLoading(false);
    }

    fetchStudents();
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
          
        </div>

        {/* CONTENT */}
        <div className="space-y-8 px-2 py-2">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5b92b9]" />
            </div>
          ) : students.length === 0 ? (
            /* PRESERVED: Original empty state formatting */
            <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
              <h3 className="text-lg font-medium text-slate-600 mb-2">No students yet</h3>
              <p className="text-sm text-slate-400">Students will appear once submissions are made.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {students.map((student, index) => {
                const isOpen = openRows.includes(index);
                const completedDetails = student.details.filter(d => d.status === "Completed");

                return (
                  <div key={index}>
                    {/* STUDENT CARD */}
                    <div className="flex items-center gap-4 rounded-xl border border-blue-200 bg-[#fbfbfc] px-4 py-4 shadow-[0_4px_16px_rgba(15,23,42,0.04)]">

                      {/* expand */}
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
                        <span
                          className={`mt-2 inline-block rounded-full px-3 py-1 text-[12px] font-semibold ${getStatusStyle(
                            completedDetails.length > 0 ? "Completed" : "Pending"
                          )}`}
                        >
                          {completedDetails.length > 0 ? "Completed" : "Pending"}
                        </span>
                      </div>

                      <div className="w-[140px] text-center">
                        <p className="text-[12px] uppercase text-[#9ca3af] font-semibold">Avg Grade</p>
                        <p className="mt-2 text-[20px] font-bold text-[#1d1d1f]">{student.avgGrade}</p>
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
                                  
                                  {/* Individual Question Scores Grid */}
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
                              /* PRESERVED: Original "No completed assignments" text */
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
    </>
  );
}