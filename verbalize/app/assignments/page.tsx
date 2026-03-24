"use client";

import { useState,useEffect } from "react";
import CreateModal from "../components/shared/CreateModal";
import CourseLayout from "../components/course/CourseLayout";
import { createClient } from "@/lib/supabase/client";
import { useParams } from "next/navigation";

type AssignmentItem = {
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
  if (status === "Active") {
    return "bg-green-100 text-green-700";
  }
  if (status === "Upcoming") {
    return "bg-yellow-100 text-yellow-700";
  }
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

export default function AssignmentsPage() {
  const supabase = createClient();

  const [openModal, setOpenModal] = useState(false);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const courseId = Number(params.courseId);

  useEffect(() => {
  const fetchAssignments = async () => {
    const { data, error } = await supabase
      .from("Assignments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setAssignments(data || []);
    }

    setLoading(false);
  };

  fetchAssignments();
}, []);

const sections = [
  {
    title: "All Assignments",
    items: assignments.map((a) => ({
      title: a.assignment_name,
      description: a.instruction_text || "No description",
      status: "Active" as const,      
      dueDate: a.created_at
        ? new Date(a.created_at).toLocaleDateString()
        : "N/A",
      called: 0,
      total: 0,
    })),
  },
];

  return (
    <>
      <CourseLayout
        current="assignments"
        onAddClick={() => setOpenModal(true)}
      >
        <div className="h-full">
          <div className="space-y-12 px-2 py-2">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-[28px] font-semibold tracking-[-0.03em] text-[#1d1d1f]">
                  {section.title}
                </h2>

                <div className="mt-6 space-y-4">
                  {section.items.map((item) => (
                    <div
                      key={item.title}
                      className="flex items-center gap-4 rounded-[24px] border border-[#edf2f7] bg-[#fbfbfc] px-6 py-6 shadow-[0_4px_16px_rgba(15,23,42,0.04)]"
                    >
                      {/* left info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="truncate text-[22px] font-semibold text-[#5c8db4]">
                            {item.title}  
                          </h3>
                          <span
                            className={`rounded-full px-3 py-1 text-[13px] font-semibold ${getStatusStyle(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </span>
                        </div>

                        <p className="mt-2 text-[16px] text-[#8a8f98]">
                          {item.description}
                        </p>
                      </div>

                      {/* due date */}
                      <div className="w-[150px] shrink-0 text-center">
                        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#9ca3af]">
                          Due Date
                        </p>
                        <div className="mt-2 flex items-center justify-center gap-2">
                          <span className="text-[14px]">📅</span>
                          <span className="text-[16px] font-semibold text-[#1d1d1f]">
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
                          <p className="mt-2 text-[14px] font-semibold text-[#1d1d1f]">
                            {item.called}/{item.total}
                          </p>
                        </div>
                      </div>

                      {/* arrow */}
                      <button
                        type="button"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#c4c9d1] transition hover:bg-[#f2f4f7] hover:text-[#8a8f98]"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          className="h-5 w-5"
                        >
                          <path d="M9 6l6 6-6 6" />
                        </svg>
                      </button>

                      {/* email button */}
                      <button
                        type="button"
                        className="shrink-0 rounded-full bg-[#5b92b9] px-5 py-3 text-[14px] font-semibold text-white shadow-[0_8px_18px_rgba(91,146,185,0.25)] transition hover:brightness-105"
                      >
                        EMAIL
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CourseLayout>

      <CreateModal  
        open={openModal}
        mode="assignment"
        courseId={53}
        onClose={() => setOpenModal(false)}
      />
    </>
  );
}