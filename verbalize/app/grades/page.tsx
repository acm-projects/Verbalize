"use client";

import { useState } from "react";
import CreateModal from "../components/shared/CreateModal";
import CourseLayout from "../components/course/CourseLayout";

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

const students: StudentGrade[] = [
  {
    lastName: "nguyen",
    firstName: "nguyen",
    netId: "abc123",
    mainAssignment: "assignment1",
    callStatus: "Completed",
    avgGrade: 100,
    details: [
      { name: "While & For loops", status: "Pending", score: 0 },
      { name: "Functions & Scope", status: "Completed", score: 95 },
      { name: "Arrays & Objects", status: "Missed", score: 0 },
      { name: "Project Phase 1", status: "Completed", score: 100 },
    ],
  },
  {
    lastName: "smith",
    firstName: "john",
    netId: "js456",
    mainAssignment: "assignment1",
    callStatus: "Pending",
    avgGrade: 0,
    details: [
      { name: "While & For loops", status: "Pending", score: 0 },
      { name: "Functions & Scope", status: "Pending", score: 0 },
      { name: "Arrays & Objects", status: "Pending", score: 0 },
    ],
  },
  {
    lastName: "doe",
    firstName: "jane",
    netId: "jd789",
    mainAssignment: "assignment2",
    callStatus: "Missed",
    avgGrade: 62,
    details: [
      { name: "While & For loops", status: "Completed", score: 84 },
      { name: "Functions & Scope", status: "Missed", score: 0 },
      { name: "Arrays & Objects", status: "Pending", score: 0 },
      { name: "Project Phase 1", status: "Completed", score: 71 },
    ],
  },
  {
    lastName: "lee",
    firstName: "bruce",
    netId: "bl001",
    mainAssignment: "assignment3",
    callStatus: "Completed",
    avgGrade: 93,
    details: [
      { name: "While & For loops", status: "Completed", score: 92 },
      { name: "Functions & Scope", status: "Completed", score: 95 },
      { name: "Arrays & Objects", status: "Completed", score: 91 },
    ],
  },
];

function getStatusBadge(status: "Completed" | "Pending" | "Missed") {
  if (status === "Completed") {
    return "bg-green-100 text-green-700";
  }
  if (status === "Pending") {
    return "bg-yellow-100 text-yellow-700";
  }
  return "bg-red-100 text-red-700";
}

function getDetailBorder(status: "Completed" | "Pending" | "Missed") {
  if (status === "Completed") {
    return "border-green-300";
  }
  if (status === "Pending") {
    return "border-yellow-300";
  }
  return "border-red-300";
}

export default function GradesPage() {
  const [openModal, setOpenModal] = useState(false);
  const [openRows, setOpenRows] = useState<number[]>([]);

  const toggleRow = (index: number) => {
    setOpenRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <>
      <CourseLayout
        current="grades"
        onAddClick={() => setOpenModal(true)}
      >
        <div className="px-2 py-2">
          {/* search bar */}
          <div className="mb-6 flex justify-end">
            <div className="w-full max-w-[340px]">
              <div className="flex h-11 items-center gap-2 rounded-full border border-[#dbe7f2] bg-white px-4 shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-4 w-4 text-[#8a8f98]"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
                <input
                  type="text"
                  placeholder="Search student..."
                  className="w-full bg-transparent text-[14px] text-[#1d1d1f] placeholder:text-[#8a8f98] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#edf2f7]">
            {/* header */}
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

            {/* rows */}
            <div className="bg-white px-3 py-4">
              <div className="space-y-4">
                {students.map((student, index) => {
                  const isOpen = openRows.includes(index);

                  return (
                    <div key={`${student.netId}-${index}`}>
                      {/* main row */}
                      <div className="grid grid-cols-[46px_1.1fr_1.1fr_1fr_1.2fr_1.1fr_0.9fr_54px] items-center gap-4 rounded-xl text-[13px] border border-sky-200 px-4 py-2">
                        <button
                          type="button"
                          onClick={() => toggleRow(index)}
                          className="flex h-7 w-7 items-center justify-center rounded-[10px] bg-[#5f93b8] text-white shadow-sm transition hover:brightness-105"
                          aria-label={isOpen ? "Collapse row" : "Expand row"}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            className={`h-4 w-4 transition-transform duration-200 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          >
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </button>

                        <div className="font-semibold text-[#1d1d1f]">
                          {student.lastName}
                        </div>
                        <div className="font-semibold text-[#1d1d1f]">
                          {student.firstName}
                        </div>
                        <div className="text-[#6e6e73]">{student.netId}</div>
                        <div className="font-semibold text-[#4f87b0]">
                          {student.mainAssignment}
                        </div>

                        <div>
                          <span
                            className={`rounded-full px-3 py-1 text-[12px] font-bold uppercase tracking-[0.08em] ${getStatusBadge(
                              student.callStatus
                            )}`}
                          >
                            {student.callStatus}
                          </span>
                        </div>

                        <div className="text-[20px] font-bold text-[#111827]">
                          {student.avgGrade}
                        </div>

                        <button
                          type="button"
                          className="flex h-9 w-9 items-center justify-center rounded-full text-[#c4c9d1] transition hover:bg-[#f2f4f7] hover:text-[#8a8f98]"
                          aria-label="Edit grade"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="h-5 w-5"
                          >
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                          </svg>
                        </button>
                      </div>

                      {/* expandable details */}
                      {isOpen && (
                        <div className="ml-[58px] mt-3 space-y-3">
                          {student.details.map((detail, detailIndex) => (
                            <div
                              key={`${student.netId}-${detail.name}-${detailIndex}`}
                              className={`grid grid-cols-[1.8fr_1fr_0.9fr] items-center rounded-xl border-1 px-5 py-2 ${getDetailBorder(
                                detail.status
                              )}`}
                            >
                              <div className="font-medium text-[#4b5563] text-[12px]">
                                {detail.name}
                              </div>

                              <div>
                                <span
                                  className={`rounded-full px-3 py-1 text-[12px] font-bold uppercase tracking-[0.08em] ${getStatusBadge(
                                    detail.status
                                  )}`}
                                >
                                  {detail.status}
                                </span>
                              </div>

                              <div className="text-right text-[20px] font-bold text-[#111827]">
                                {detail.score}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </CourseLayout>

      <CreateModal
        open={openModal}
        mode="assignment"
        onClose={() => setOpenModal(false)}
      />
    </>
  );
}