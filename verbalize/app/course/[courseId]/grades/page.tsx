"use client";

<<<<<<< HEAD
import { use } from "react";
import { useState, useEffect } from "react";
=======

import { useState, useEffect, use } from "react";
>>>>>>> 6814727ad31de9ad8256adc1f0e8787dae68a9ee
import CreateModal from "@/app/components/shared/CreateModal";
import { createClient } from "@/lib/supabase/client";

// 你的类型定义保持不变
type AssignmentDetail = {
  name: string;
  status: "Completed" | "Pending" | "Missed";
  score: number;
};

type StudentGrade = {
  lastName: string;
  firstName: string;
  netId: string;
  mainAssignment: string;
  callStatus: "Completed" | "Pending" | "Missed";
  avgGrade: number;
  details: AssignmentDetail[];
};

function getStatusBadge(status: "Completed" | "Pending" | "Missed") {
  if (status === "Completed") return "bg-green-100 text-green-700";
  if (status === "Pending") return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
}

function getDetailBorder(status: "Completed" | "Pending" | "Missed") {
  if (status === "Completed") return "border-green-300";
  if (status === "Pending") return "border-yellow-300";
  return "border-red-300";
}


export default function GradesPage({ params }: { params: Promise<{ courseId: string }> }) {
  const [openModal, setOpenModal] = useState(false);
  const [openRows, setOpenRows] = useState<number[]>([]);
  
  
  const resolvedParams = use(params);
  const courseId = Number(resolvedParams.courseId);

  const [students, setStudents] = useState<StudentGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchStudents() {
      
      if (!courseId) return;

      const { data, error } = await supabase
        .from("Students") 
        .select("*")
        .eq("course_id", courseId); 

      if (error) {
        console.error("Error fetching students:", error);
      } else if (data && data.length > 0) {
        console.log("Real student data:", data);
     
      } else {
        console.log("No real data yet, using mock fallback.");
        setStudents(getMockFallbackData());
      }
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
        {/* Header */}
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

        <div className="px-2 py-2">
          {/* Search Bar */}
          <div className="mb-4 flex items-center justify-between">
            <div className="relative w-72">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full rounded-lg border border-gray-200 bg-gray-50 p-2 pl-10 text-sm text-gray-900 focus:border-[#5b92b9] focus:ring-[#5b92b9] outline-none transition-all"
                placeholder="Search students..."
              />
            </div>
            <div className="flex gap-2">
               <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                  Filter
               </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#edf2f7]">
            {/* Table Header */}
            <div className="grid grid-cols-[46px_1.1fr_1.1fr_1fr_1.2fr_1.1fr_0.9fr_54px] items-center gap-4 bg-[#f3f4f6] px-5 py-5 text-[14px] font-semibold text-[#1f2a44]">
              <div />
              <div>Last Name</div>
              <div>First Name</div>
              <div>Net ID</div>
              <div>Assignments</div>
              <div>Call Status</div>
              <div>AVG Grade</div>
              <div />
            </div>

            {/* Table Body */}
            <div className="bg-white px-3 py-4">
              {loading ? (
                <div className="flex justify-center items-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5b92b9]"></div>
                </div>
              ) : students.length === 0 ? (
                 <div className="text-center text-slate-400 py-10">
                   No students found for this course.
                 </div>
              ) : (
                <div className="space-y-4">
                  {students.map((student, index) => {
                    const isOpen = openRows.includes(index);
                    return (
                      <div key={`${student.netId}-${index}`}>
                        <div className="grid grid-cols-[46px_1.1fr_1.1fr_1fr_1.2fr_1.1fr_0.9fr_54px] items-center gap-4 rounded-xl text-[13px] border border-sky-200 px-4 py-2">
                           <button onClick={() => toggleRow(index)} className="flex h-7 w-7 items-center justify-center rounded-[10px] bg-[#5f93b8] text-white shadow-sm transition hover:brightness-105">
                             <span className="text-white text-lg font-bold">{isOpen ? "-" : "+"}</span>
                           </button>
                           <div className="font-semibold text-[#1d1d1f]">{student.lastName}</div>
                           <div className="font-semibold text-[#1d1d1f]">{student.firstName}</div>
                           <div className="text-[#6e6e73]">{student.netId}</div>
                           <div className="font-semibold text-[#4f87b0]">{student.mainAssignment}</div>
                           <div>
                             <span className={`rounded-full px-3 py-1 text-[12px] font-bold uppercase tracking-[0.08em] ${getStatusBadge(student.callStatus)}`}>{student.callStatus}</span>
                           </div>
                           <div className="text-[20px] font-bold text-[#111827]">{student.avgGrade}</div>
                           <div />
                        </div>

                        {isOpen && (
                          <div className="ml-[58px] mt-3 space-y-3">
                            {student.details.map((detail, detailIndex) => (
                              <div key={detailIndex} className={`grid grid-cols-[1.8fr_1fr_0.9fr] items-center rounded-xl border-1 px-5 py-2 ${getDetailBorder(detail.status)}`}>
                                <div className="font-medium text-[#4b5563] text-[12px]">{detail.name}</div>
                                <div><span className={`rounded-full px-3 py-1 text-[12px] font-bold uppercase ${getStatusBadge(detail.status)}`}>{detail.status}</span></div>
                                <div className="text-right text-[20px] font-bold text-[#111827]">{detail.score}</div>
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

function getMockFallbackData(): StudentGrade[] {
  return [
    { lastName: "nguyen", firstName: "nguyen", netId: "abc123", mainAssignment: "assignment1", callStatus: "Completed", avgGrade: 100, details: [] },
    { lastName: "smith", firstName: "john", netId: "js456", mainAssignment: "assignment1", callStatus: "Pending", avgGrade: 0, details: [] }
  ];
}