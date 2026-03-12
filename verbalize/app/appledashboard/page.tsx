"use client";

import Link from "next/link";
import { useState } from "react";
import CreateModal from "../components/shared/CreateModal";

export default function DashboardPage() {
  const [openClassModal, setOpenClassModal] = useState(false);

  const courses = [
    {
      code: "CS1200",
      title: "Ez Programming",
      term: "Spring 2026 · Section 01",
      status: "Active",
      students: 60,
      assignments: 8,
      pending: 12,
      avgScore: 87,
      submissionRate: 82,
      gradingProgress: 60,
    },
    {
      code: "CS3345",
      title: "Data Structures",
      term: "Spring 2026 · Section 02",
      status: "Active",
      students: 42,
      assignments: 6,
      pending: 7,
      avgScore: 91,
      submissionRate: 74,
      gradingProgress: 48,
    },
    {
      code: "CS4337",
      title: "Programming Paradigms",
      term: "Spring 2026 · Section 01",
      status: "Active",
      students: 38,
      assignments: 5,
      pending: 4,
      avgScore: 89,
      submissionRate: 79,
      gradingProgress: 66,
    },
    {
      code: "CS3162",
      title: "Professional Communication",
      term: "Spring 2026 · Section 03",
      status: "Draft",
      students: 28,
      assignments: 3,
      pending: 2,
      avgScore: 76,
      submissionRate: 58,
      gradingProgress: 42,
    },
  ];

  const getPendingStyle = (pending: number) => {
    if (pending > 10) {
      return "bg-red-100 text-red-700 border border-red-200";
    }
    return "bg-yellow-100 text-yellow-700 border border-yellow-200";
  };

  const getScoreStyle = (score: number) => {
    if (score >= 90) {
      return "bg-green-100 text-green-700 border border-green-200";
    }
    if (score >= 80) {
      return "bg-yellow-100 text-yellow-700 border border-yellow-200";
    }
    return "bg-red-100 text-red-700 border border-red-200";
  };

  const getStatusStyle = (status: string) => {
    if (status === "Active") {
      return "bg-green-500/15 text-green-300 border border-green-400/30";
    }
    return "bg-red-500/15 text-red-300 border border-red-400/30";
  };

  const getProgressColor = (value: number) => {
    if (value > 80) return "#22c55e";
    if (value >= 60) return "#eab308";
    return "#ef4444";
  };

  return (
    <>
      <main className="min-h-screen bg-[linear-gradient(180deg,#6aa7d8_0px,#8fbcdf_56px,#eef4fa_220px,#f5f5f7_380px)] text-[#1d1d1f]">
        {/* Top Nav */}
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[linear-gradient(135deg,#0b1f3a_0%,#1c4c74_45%,#5fa3d7_100%)] backdrop-blur-xl text-white">
          <div className="mx-auto flex h-12 max-w-[1500px] items-center justify-between px-8">
            <div className="flex min-w-[120px] items-center">
              <div className="text-[22px] font-semibold tracking-tight">V</div>
            </div>

            <div className="flex flex-1 justify-center px-6">
              <div className="w-full max-w-[520px]">
                <div className="flex h-9 items-center gap-2 rounded-full border border-black/10 bg-[#f5f5f7] px-4 shadow-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-4 w-4 text-[#6e6e73]"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search for a class..."
                    className="w-full bg-transparent text-[14px] text-[#1d1d1f] placeholder:text-[#86868b] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex min-w-[120px] items-center justify-end gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white text-sm shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4"
                >
                  <path d="M20 21a8 8 0 0 0-16 0" />
                  <circle cx="12" cy="8" r="4" />
                </svg>
              </div>
              <span className="hidden text-[14px] font-medium text-[#1d1d1f] sm:inline">
                Professor
              </span>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="px-6 pt-16 pb-10">
          <div className="mx-auto max-w-[1200px] text-center">
            <h1 className="text-5xl font-semibold tracking-[-0.04em] text-[#1d1d1f] sm:text-6xl md:text-7xl">
              Welcome back.
            </h1>
            <p className="mt-4 text-xl font-normal tracking-[-0.02em] text-[#6e6e73] sm:text-2xl">
              Please browse and select your course.
            </p>
            <p className="mt-3 text-[15px] text-[#86868b]">
              Manage enrollment, assignments, grading workload, and course progress.
            </p>
          </div>
        </section>

        {/* Cards */}
        <section className="px-6 pb-16">
          <div className="mx-auto max-w-[1360px]">
            <div className="grid grid-cols-1 gap-y-6 md:grid-cols-2">
              {courses.map((course, index) => {
                const isRight = index % 2 === 1;

                return (
                  <div
                    key={index}
                    className={isRight ? "md:ml-8" : "md:mr-4"}
                  >
                    <Link
                      href="/assignments"
                      className="block overflow-hidden rounded-[30px] border border-[#9cc9ff]/60 bg-white shadow-[0_12px_40px_rgba(51,102,153,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(51,102,153,0.16)]"
                    >
                      {/* top */}
                      <div className="bg-[linear-gradient(135deg,#0b1f3a_0%,#1c4c74_45%,#5fa3d7_100%)] px-7 py-7 text-white">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-[14px] font-medium uppercase tracking-[0.08em] text-white/75">
                              {course.code}
                            </p>
                            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em]">
                              {course.title}
                            </h2>
                            <p className="mt-2 text-[15px] text-white/80">{course.term}</p>
                          </div>

                          <span
                            className={`rounded-full px-4 py-1.5 text-[13px] font-medium backdrop-blur-sm ${getStatusStyle(
                              course.status
                            )}`}
                          >
                            {course.status}
                          </span>
                        </div>
                      </div>

                      {/* content */}
                      <div className="px-7 py-6">
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                          <div className="rounded-2xl border border-[#dbeafe] bg-[linear-gradient(180deg,#f8fbff_0%,#eef6ff_100%)] p-4">
                            <p className="text-[12px] uppercase tracking-[0.08em] text-[#86868b]">
                              Students
                            </p>
                            <p className="mt-2 text-2xl font-semibold">{course.students}</p>
                          </div>

                          <div className="rounded-2xl border border-[#dbeafe] bg-[linear-gradient(180deg,#f8fbff_0%,#eef6ff_100%)] p-4">
                            <p className="text-[12px] uppercase tracking-[0.08em] text-[#86868b]">
                              Assignments
                            </p>
                            <p className="mt-2 text-2xl font-semibold">{course.assignments}</p>
                          </div>

                          <div className={`rounded-2xl p-4 ${getPendingStyle(course.pending)}`}>
                            <p className="text-[12px] uppercase tracking-[0.08em]">
                              Pending
                            </p>
                            <p className="mt-2 text-2xl font-semibold">{course.pending}</p>
                          </div>

                          <div className={`rounded-2xl p-4 ${getScoreStyle(course.avgScore)}`}>
                            <p className="text-[12px] uppercase tracking-[0.08em]">
                              Avg Score
                            </p>
                            <p className="mt-2 text-2xl font-semibold">{course.avgScore}%</p>
                          </div>
                        </div>

                        <div className="mt-6 space-y-4">
                          <div>
                            <div className="mb-2 flex items-center justify-between text-[14px]">
                              <span className="text-[#6e6e73]">Submission rate</span>
                              <span className="font-medium text-[#1d1d1f]">
                                {course.submissionRate}%
                              </span>
                            </div>
                            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#e5e7eb]">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${course.submissionRate}%`,
                                  backgroundColor: getProgressColor(course.submissionRate),
                                }}
                              />
                            </div>
                          </div>

                          <div>
                            <div className="mb-2 flex items-center justify-between text-[14px]">
                              <span className="text-[#6e6e73]">Grading progress</span>
                              <span className="font-medium text-[#1d1d1f]">
                                {course.gradingProgress}%
                              </span>
                            </div>
                            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#e5e7eb]">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${course.gradingProgress}%`,
                                  backgroundColor: getProgressColor(course.gradingProgress),
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mt-7 inline-flex h-11 items-center justify-center rounded-full bg-[#0071e3] px-6 text-[15px] font-medium text-white">
                          View course
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}

              {/* Add class card */}
              <div className="md:mr-4">
                <button
                  type="button"
                  onClick={() => setOpenClassModal(true)}
                  className="flex min-h-[410px] w-full flex-col items-center justify-center rounded-[30px] border border-dashed border-[#9cc9ff] bg-[linear-gradient(180deg,#fbfdff_0%,#eef6ff_100%)] text-center shadow-[0_12px_40px_rgba(51,102,153,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(51,102,153,0.12)]"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-white shadow-[0_8px_24px_rgba(51,102,153,0.12)]">
                    <span className="text-4xl font-light text-[#0071e3]">+</span>
                  </div>

                  <h3 className="mt-6 text-3xl font-semibold tracking-[-0.03em] text-[#1d1d1f]">
                    Add a class
                  </h3>

                  <p className="mt-3 max-w-[280px] text-[16px] text-[#6e6e73]">
                    Create a new course space and begin managing students, assignments, and grading.
                  </p>

                  <div className="mt-8 inline-flex h-11 items-center justify-center rounded-full border border-[#0071e3] bg-white px-6 text-[15px] font-medium text-[#0071e3] transition hover:bg-[#0071e3] hover:text-white">
                    Create class
                  </div>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <CreateModal
        open={openClassModal}
        mode="class"
        onClose={() => setOpenClassModal(false)}
      />
    </>
  );
}