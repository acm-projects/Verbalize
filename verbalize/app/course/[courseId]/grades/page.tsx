"use client";

import { use } from "react";
import { useState, useEffect } from "react";
import CreateModal from "@/app/components/shared/CreateModal";
import { createClient } from "@/lib/supabase/client"; // 引入 Supabase

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

export default function GradesPage({ params }: { params: { courseId: string } }) {
  const [openModal, setOpenModal] = useState(false);
  const [openRows, setOpenRows] = useState<number[]>([]);
  
  // 🔴 1. 新增：用来存真实学生数据的 State
  const [students, setStudents] = useState<StudentGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // 🔴 2. 新增：一进页面就去 Supabase 查当前 courseId 下的学生
  useEffect(() => {
    async function fetchStudents() {
      // ⚠️ 这里需要根据你的实际数据库结构来调整！
      // 假设你有一个叫 "Students" 的表，并且里面有个 course_id 字段
      const { data, error } = await supabase
        .from("Students") // <--- 填入你真实的表名！
        .select("*")
        .eq("course_id", params.courseId); // 核心：只查当前课的学生！

      if (error) {
        console.error("Error fetching students:", error);
      } else if (data && data.length > 0) {
        // 如果查到了真实数据，你需要在这里把数据库字段 map 成 UI 需要的格式
        // setStudents(formattedData);
        console.log("Real student data:", data);
      } else {
        // 为了暂时不让页面空白，如果没有查到真实数据，先塞点假数据（或者留空）
        console.log("No real data yet, using mock fallback.");
        setStudents(getMockFallbackData());
      }
      setLoading(false);
    }

    fetchStudents();
  }, [params.courseId]);

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
          {/* Search Bar (不变) */}
          {/* ... 为了篇幅省略，保留你原来的 search bar 代码 ... */}

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

            {/* Table Body (增加 Loading 状态) */}
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
                        {/* 这里保留你原本所有的 map 渲染逻辑，一个字都不用改！ */}
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
                           <div /> {/* Actions */}
                        </div>

                        {/* Expandable Details */}
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
        courseId={params.courseId}
        onClose={() => setOpenModal(false)}
      />
    </>
  );
}

// 仅仅是为了不报错加的 fallback 函数，等你数据库连上就可以删了
function getMockFallbackData(): StudentGrade[] {
  return [
    { lastName: "nguyen", firstName: "nguyen", netId: "abc123", mainAssignment: "assignment1", callStatus: "Completed", avgGrade: 100, details: [] },
    { lastName: "smith", firstName: "john", netId: "js456", mainAssignment: "assignment1", callStatus: "Pending", avgGrade: 0, details: [] }
  ];
}