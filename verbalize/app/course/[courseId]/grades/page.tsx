"use client";

import { useState, useEffect, use } from "react";
// 1. Import Framer Motion components
import { motion, AnimatePresence } from "framer-motion"; 
import CreateModal from "@/app/components/shared/CreateModal";
import { createClient } from "@/lib/supabase/client";

type AssignmentDetail = {
  name: string;
  status: "Completed" | "Pending";
  score: number;
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
  const [openModal, setOpenModal] = useState(false);
  const [students, setStudents] = useState<StudentGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [openRows, setOpenRows] = useState<number[]>([]);

  const supabase = createClient();
  
  // Unwrap params using React.use() to fix the async error
  const resolvedParams = use(params);
  const courseId = Number(resolvedParams.courseId);

  useEffect(() => {
    async function fetchStudents() {
      if (!courseId) return;
      setLoading(true);

      // 1. Fetch only students enrolled in THIS course
      const { data: courseStudents, error } = await supabase
        .from("Course_Students")
        .select(`
          student_id,
          Students (
            id,
            last_name,
            first_name,
            netID
          )
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

          // 1. Fetch submissions but ensure we only get Results for this specific course join
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

          let total = 0;
          let count = 0;
          const details: AssignmentDetail[] = [];

          submissions?.forEach((sub: any) => {
            //Only count as completed if the Results array for THIS submission is not empty
            const results = sub.Results || [];
            const hasResultsForThisAssignment = results.length > 0;

            let grade = 0;

            if (hasResultsForThisAssignment) {
              const sum = results.reduce((acc: number, curr: any) => acc + (curr.confidence_score || 0), 0);
              grade = sum / results.length;
              total += grade;
              count++;
            }

            details.push({
              name: sub.Assignments?.assignment_name || `Assignment ${sub.assignment_id}`,
              //The key change: Status is now scoped strictly to this submission's results
              status: hasResultsForThisAssignment ? "Completed" : "Pending",
              score: Math.round(grade || 0),
            });
          });


          const avgGrade = count > 0 ? total / count : 0;

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
                // Filter only completed assignments for display in expanded view
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
                        {/* 2. Thêm rotation animation cho dấu + / - */}
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

                    {/* EXPANDED DETAILS (Filtered to only show Completed with Motion) */}
                    {/* 3. Bọc bằng AnimatePresence để xử lý exit animation */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        // 4. Thay div thường bằng motion.div và cấu hình animation
                        <motion.div
                          initial={{ height: 0, opacity: 0 }} // Trạng thái bắt đầu
                          animate={{ height: "auto", opacity: 1 }} // Trạng thái khi hiển thị
                          exit={{ height: 0, opacity: 0 }} // Trạng thái khi đóng
                          transition={{ duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] }} // Kiểu chuyển động
                          className="ml-12 space-y-3 overflow-hidden" // Thêm overflow-hidden để mượt
                        >
                          {/* Thêm padding top ở đây để không bị giật animation */}
                          <div className="pt-3 space-y-3">
                            {completedDetails.length > 0 ? (
                              completedDetails.map((d, i) => (
                                <div
                                  key={i}
                                  className={`flex items-center justify-between rounded-xl border px-5 py-3 ${getStatusStyle(d.status)}`}
                                >
                                  <div className="text-[13px] font-medium">{d.name}</div>
                                  <div className="text-[14px] font-semibold">{d.score}</div>
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