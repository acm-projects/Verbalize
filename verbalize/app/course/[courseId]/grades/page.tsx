"use client";

import { useState, useEffect, use } from "react";
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
  if (status === "Completed") return "bg-green-100 text-green-700";
  return "bg-yellow-100 text-yellow-700";
}

export default function GradesPage({ params, }: { params: Promise<{ courseId: string }>;}) {
  const [openModal, setOpenModal] = useState(false);
  const [students, setStudents] = useState<StudentGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [openRows, setOpenRows] = useState<number[]>([]);

  const supabase = createClient();
  const resolvedParams = use(params);
  const courseId = Number(resolvedParams.courseId);

  useEffect(() => {
    async function fetchStudents() {
      if (!courseId) return;

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
        console.error(error);
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
              Results ( confidence_score )
            `)
            .eq("student_id", s.id);

          let total = 0;
          let count = 0;

          const details: AssignmentDetail[] = [];

          submissions?.forEach((sub: any) => {
            const results = sub.Results || [];

            let grade = 0;

            results.forEach((r: any) => {
              grade += r.confidence_score || 0;
            });

            if (results.length > 0) {
              grade /= results.length;
              total += grade;
              count++;
            }

            details.push({
              name: `Assignment ${sub.assignment_id}`,
              status: results.length > 0 ? "Completed" : "Pending",
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
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
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
              <h3 className="text-lg font-medium text-slate-600 mb-2">
                No students yet
              </h3>
              <p className="text-sm text-slate-400">
                Students will appear once submissions are made.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {students.map((student, index) => {
                const isOpen = openRows.includes(index);

                return (
                  <div key={index}>
                    {/* STUDENT CARD */}
                    <div className="flex items-center gap-4 rounded-xl border border-blue-200 bg-[#fbfbfc] px-4 py-4 shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
                      
                      {/* expand */}
                      <button
                        onClick={() => toggleRow(index)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5b92b9] text-white"
                      >
                        {isOpen ? "-" : "+"}
                      </button>

                      {/* name */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[16px] font-semibold text-[#5c8db4]">
                          {student.firstName} {student.lastName}
                        </h3>
                        <p className="text-[13px] text-[#8a8f98]">
                          {student.netId}
                        </p>
                      </div>

                      {/* status */}
                      <div className="w-[140px] text-center">
                        <p className="text-[12px] uppercase text-[#9ca3af] font-semibold">
                          Status
                        </p>
                        <span
                          className={`mt-2 inline-block rounded-full px-3 py-1 text-[12px] font-semibold ${getStatusStyle(
                            student.details.length > 0 ? "Completed" : "Pending"
                          )}`}
                        >
                          {student.details.length > 0 ? "Completed" : "Pending"}
                        </span>
                      </div>

                      {/* grade */}
                      <div className="w-[140px] text-center">
                        <p className="text-[12px] uppercase text-[#9ca3af] font-semibold">
                          Avg Grade
                        </p>
                        <p className="mt-2 text-[20px] font-bold text-[#1d1d1f]">
                          {student.avgGrade}
                        </p>
                      </div>
                    </div>

                    {/* EXPANDED DETAILS */}
                    {isOpen && (
                      <div className="ml-12 mt-3 space-y-3">
                        {student.details.map((d, i) => (
                          <div
                            key={i}
                            className={`flex items-center justify-between rounded-xl border px-5 py-3 ${getStatusStyle(
                              d.status
                            )}`}
                          >
                            <div className="text-[13px] font-medium">
                              {d.name}
                            </div>

                            <div className="text-[14px] font-semibold">
                              {d.score}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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