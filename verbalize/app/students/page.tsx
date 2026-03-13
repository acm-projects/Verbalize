"use client";

import { useState } from "react";
import CreateModal from "../components/shared/CreateModal";
import CourseLayout from "../components/course/CourseLayout";

export default function StudentsPage() {
  const [openModal, setOpenModal] = useState(false);

  const students = [
    ["nguyen", "nguyen", "abc123", "A"],
    ["smith", "john", "js456", "B"],
    ["doe", "jane", "jd789", "C"],
    ["lee", "bruce", "bl001", "A"],
    ["wang", "david", "dw222", "D"],
    ["garcia", "maria", "mg301", "B"],
    ["kim", "soojin", "sk118", "A"],
    ["brown", "ethan", "eb540", "C"],
    ["chen", "linda", "lc224", "A"],
  ];

  const badgeStyle = (grade: string) => {
    if (grade === "A") return "bg-green-100 text-green-700";
    if (grade === "B") return "bg-blue-100 text-blue-700";
    if (grade === "C") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <>
      <CourseLayout
        current="students"
        onAddClick={() => setOpenModal(true)}
      >
        <div className="overflow-hidden rounded-[22px] border border-[#edf2f7]">
          <div className="grid grid-cols-6 gap-4 bg-[#f3f4f6] px-6 py-5 text-[15px] font-semibold text-[#1f2a44]">
            <div>Last Name</div>
            <div>First Name</div>
            <div>Net ID</div>
            <div>Uploaded Code</div>
            <div>AI Transcript</div>
            <div>AI Evaluation</div>
          </div>

          <div className="divide-y divide-[#edf2f7] bg-white">
            {students.map((student, index) => (
              <div
                key={index}
                className="grid grid-cols-6 items-center gap-4 px-6 py-5 text-[16px]"
              >
                <div className="font-semibold text-[#1d1d1f]">{student[0]}</div>
                <div className="font-semibold text-[#1d1d1f]">{student[1]}</div>
                <div className="text-[#6e6e73]">{student[2]}</div>

                <div>
                  <span className="font-semibold text-[#4f87b0] underline underline-offset-2">
                    View Code
                  </span>
                </div>

                <div>
                  <span className="font-semibold text-[#4f87b0] underline underline-offset-2">
                    Transcript
                  </span>
                </div>

                <div>
                  <span
                    className={`inline-flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-[15px] font-bold ${badgeStyle(
                      student[3]
                    )}`}
                  >
                    {student[3]}
                  </span>
                </div>
              </div>
            ))}
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