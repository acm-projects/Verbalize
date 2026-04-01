"use client";

import { use } from "react";
import { useState, useEffect } from "react";
import CreateModal from "@/app/components/shared/CreateModal";
import { createClient } from "@/lib/supabase/client";

type AssignmentItem = {
  id?: string;
  title: string;
  description: string;
  status: "Active" | "Upcoming" | "Locked";
  dueDate: string;
  called: number;
  total: number;
};

type AssignmentSection = {
  title: string;
  items: AssignmentItem[];
};

function getStatusStyle(status: AssignmentItem["status"]) {
  if (status === "Active") return "bg-green-100 text-green-700";
  if (status === "Upcoming") return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
}

function getProgressWidth(called: number, total: number) {
  if (total === 0) return "0%";
  return `${(called / total) * 100}%`;
}

function getProgressColor(status: AssignmentItem["status"]) {
  if (status === "Active") return "#5b92b9";
  if (status === "Upcoming") return "#d1d5db";
  return "#e5e7eb";
}

export default function AssignmentsPage({ params }: { params: { courseId: string } }) {
  const [openModal, setOpenModal] = useState(false);
  
  // 🔴 核心状态：存储真实作业数据
  const [sections, setSections] = useState<AssignmentSection[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchAssignments() {
      // ⚠️ 注意：如果报错 404，请去 Supabase 检查表名是不是小写的 "assignments"
      const { data, error } = await supabase
        .from("Assignments") 
        .select("*")
        .eq("course_id", params.courseId) // 只查当前课程的作业
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching assignments:", error);
      } else if (data) {
        // 将数据库原始数据，映射成你这套漂亮 UI 需要的格式
        const mappedItems: AssignmentItem[] = data.map((item: any) => {
          // 尝试把数据库的时间格式化一下，如果没有就用默认值
          const dateStr = item.created_at 
            ? new Date(item.created_at).toLocaleDateString("en-GB").replace(/\//g, "-") 
            : "TBD";

          return {
            id: item.id,
            title: item.assignment_name || "Untitled Assignment",
            description: "Assignment created via Verbalize", // 数据库暂时没这个字段，用默认的
            status: "Active", 
            dueDate: dateStr, 
            called: 0, // 进度等以后连表查询再做真实计算
            total: 0,
          };
        });

        // 暂时把所有查出来的作业放在 "All Assignments" 这个大分类下
        setSections([
          {
            title: "All Assignments",
            items: mappedItems,
          },
        ]);
      }
      setLoading(false);
    }

    fetchAssignments();
  }, [params.courseId]);

  return (
    <>
      <div className="h-full">
        {/* 头部标题区 */}
        <div className="flex justify-between items-center px-2 py-4 border-b border-gray-100 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Assignments</h1>
            <p className="text-sm text-slate-500">Course ID: {params.courseId}</p>
          </div>
          <button
            onClick={() => setOpenModal(true)}
            className="rounded-xl bg-[#5b92b9] px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-[#4a7a9c] transition-colors"
          >
            + Add Assignment
          </button>
        </div>

        {/* 列表区 */}
        <div className="space-y-8 px-2 py-2">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5b92b9]"></div>
            </div>
          ) : sections.length === 0 || sections[0].items.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
              <h3 className="text-lg font-medium text-slate-600 mb-2">No assignments yet</h3>
              <p className="text-sm text-slate-400 mb-4">Click the button above to create your first assignment.</p>
            </div>
          ) : (
            sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-[20px] font-semibold tracking-[-0.03em] text-[#1d1d1f]">
                  {section.title}
                </h2>

                <div className="mt-6 space-y-4">
                  {section.items.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="flex items-center gap-4 rounded-xl border border-blue-200 bg-[#fbfbfc] px-4 py-4 shadow-[0_4px_16px_rgba(15,23,42,0.04)]"
                    >
                      {/* left info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="truncate text-[16px] font-semibold text-[#5c8db4]">
                            {item.title}
                          </h3>
                          <span className={`rounded-full px-3 py-1 text-[13px] font-semibold ${getStatusStyle(item.status)}`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="mt-2 text-[14px] text-[#8a8f98]">
                          {item.description}
                        </p>
                      </div>

                      {/* due date */}
                      <div className="w-[150px] mb-3 shrink-0 text-center">
                        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#9ca3af]">
                          Due Date
                        </p>
                        <div className="flex mt-2 items-center justify-center gap-2">
                          <span className="text-[14px]">𝄜</span>
                          <span className="text-[14px] font-semibold text-[#1d1d1f]">
                            {item.dueDate}
                          </span>
                        </div>
                      </div>

                      {/* phone called */}
                      <div className="w-[170px] shrink-0 text-center">
                        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#9ca3af]">
                          Phone Called
                        </p>
                        <div className="mt-3">
                          <div className="mx-auto h-[6px] w-[126px] overflow-hidden rounded-full bg-[#eceef2]">
                            <div
                              className="h-full rounded-full transition-all duration-300"
                              style={{
                                width: getProgressWidth(item.called, item.total),
                                backgroundColor: getProgressColor(item.status),
                              }}
                            />
                          </div>
                          <p className="mt-2 text-[12px] font-semibold text-[#1d1d1f]">
                            {item.called}/{item.total}
                          </p>
                        </div>
                      </div>

                      {/* arrow */}
                      <button type="button" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#c4c9d1] transition hover:bg-[#f2f4f7] hover:text-[#8a8f98]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="h-5 w-5">
                          <path d="M9 6l6 6-6 6" />
                        </svg>
                      </button>

                      {/* email button */}
                      <button type="button" className="shrink-0 rounded-xl bg-[#5b92b9] px-3 py-2 text-[12px] font-semibold text-white shadow-[0_8px_18px_rgba(91,146,185,0.25)] transition hover:brightness-105">
                        EMAIL
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <CreateModal  
        open={openModal}
        mode="assignment"
        courseId={params.courseId}
        onClose={() => {
          setOpenModal(false);
          // 粗暴但有效的刷新，让刚建好的作业立刻出现
          window.location.reload(); 
        }}
      />
    </>
  );
}