"use client";

import { use } from "react";
import { useState, useEffect } from "react";
// 🔴 Magic alias path
import CreateModal from "@/app/components/shared/CreateModal";
import { createClient } from "@/lib/supabase/client";

// Define the structure for real student data
type StudentInfo = {
  id?: string;
  lastName: string;
  firstName: string;
  netId: string;
  grade: string;
};

// 🔴 Fix: In Next.js 15/16, params is a Promise and must be unwrapped
export default function StudentsPage({ 
  params: paramsPromise 
}: { 
  params: Promise<{ courseId: string }> 
}) {
  // 🔴 Fix: Unwrap the params using React's 'use' hook
  const params = use(paramsPromise);
  
  const [openModal, setOpenModal] = useState(false);
  
  // 🔴 Core State: Store real students fetched from the database
  const [students, setStudents] = useState<StudentInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchStudents() {
      // ⚠️ Note: Check if your table name is "Students" or lowercase "students"
      const { data, error } = await supabase
        .from("Students") 
        .select("*")
        .eq("course_id", params.courseId); // Core: Only fetch students for the current course

      if (error) {
        console.error("Error fetching students:", error);
        // If an error occurs (e.g., table not created), use mock data for the UI
        setStudents(getMockStudents());
      } else if (data && data.length > 0) {
        // Map database fields to our state structure
        const mappedStudents = data.map((s: any) => ({
          id: s.id,
          lastName: s.last_name || s.lastName || "Unknown",
          firstName: s.first_name || s.firstName || "Unknown",
          netId: s.net_id || s.netId || "N/A",
          grade: s.grade || "A" // If AI hasn't graded yet, default to A
        }));
        setStudents(mappedStudents);
      } else {
        // Case where no data was found
        setStudents([]);
      }
      setLoading(false);
    }

    fetchStudents();
  }, [params.courseId]);

  const badgeStyle = (grade: string) => {
    if (grade === "A") return "bg-green-100 text-green-700";
    if (grade === "B") return "bg-blue-100 text-blue-700";
    if (grade === "C") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <>
      {/* 🔴 Full-height container without CourseLayout (now handled by layout.tsx) */}
      <div className="h-full">
        {/* Header Section (re-added to maintain consistency with Assignments and Grades) */}
        <div className="flex justify-between items-center px-2 py-4 border-b border-gray-100 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Students</h1>
            <p className="text-sm text-slate-500">Course ID: {params.courseId}</p>
          </div>
          <button
            onClick={() => setOpenModal(true)}
            className="rounded-xl bg-[#5b92b9] px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-[#4a7a9c] transition-colors"
          >
            + Add Assignment
          </button>
        </div>

        <div className="px-2 py-2">
          <div className="overflow-hidden rounded-xl border border-[#edf2f7]">
            {/* Table Header */}
            <div className="grid grid-cols-6 gap-4 bg-[#f3f4f6] px-6 py-5 text-[14px] font-semibold text-[#1f2a44]">
              <div>Last Name</div>
              <div>First Name</div>
              <div>Net ID</div>
              <div>Uploaded Code</div>
              <div>AI Transcript</div>
              <div>AI Evaluation</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-[#edf2f7] bg-white">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5b92b9]"></div>
                </div>
              ) : students.length === 0 ? (
                <div className="text-center py-20 text-slate-400">
                  No students found for this course.
                </div>
              ) : (
                students.map((student, index) => (
                  <div
                    key={student.id || index}
                    className="grid grid-cols-6 items-center gap-4 px-6 py-2 text-[13px]"
                  >
                    <div className="font-semibold text-[#1d1d1f]">{student.lastName}</div>
                    <div className="font-semibold text-[#1d1d1f]">{student.firstName}</div>
                    <div className="text-[#6e6e73]">{student.netId}</div>

                    <div>
                      <span className="font-semibold text-[#4f87b0] cursor-pointer hover:text-blue-700 underline underline-offset-2 transition">
                        View Code
                      </span>
                    </div>

                    <div>
                      <span className="font-semibold text-[#4f87b0] cursor-pointer hover:text-blue-700 underline underline-offset-2 transition">
                        Transcript
                      </span>
                    </div>

                    <div>
                      <span
                        className={`inline-flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-[15px] font-bold ${badgeStyle(
                          student.grade
                        )}`}
                      >
                        {student.grade}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <CreateModal
        open={openModal}
        mode="assignment"
        courseId={params.courseId}
        onClose={() => setOpenModal(false)}
      />
    </>
  );
}

// Mock data to prevent crashes until the database connection is fully established
function getMockStudents(): StudentInfo[] {
  return [
    { lastName: "nguyen", firstName: "nguyen", netId: "abc123", grade: "A" },
    { lastName: "smith", firstName: "john", netId: "js456", grade: "B" },
    { lastName: "doe", firstName: "jane", netId: "jd789", grade: "C" },
  ];
}