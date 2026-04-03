"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { useParams } from "next/navigation"; 

type CourseLayoutProps = {
  current: "assignments" | "students" | "grades";
  children: ReactNode;
  courseCode?: string;
  onAddClick?: () => void;
};

export default function CourseLayout({
  current,
  children,
  courseCode, 
  onAddClick,
}: CourseLayoutProps) {
  
  
  const params = useParams();
  const courseId = params?.courseId as string || "unknown";

  // Base styles for navigation items
  const itemBase = "relative pt-2 pb-2 text-[15px] font-semibold transition-all duration-200";
  
  // Specific styles for Active vs Inactive
  const activeItem = "text-[#407EA7] font-bold scale-105"; // Added bold and slight scale for emphasis
  const inactiveItem = "text-[#407EA7]/55 hover:text-[#407EA7]/85";

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#6aa7d8_0px,#8fbcdf_56px,#eef4fa_220px,#f5f5f7_380px)] text-[#1d1d1f]">
      <header className="sticky top-0 z-50 border-b border-[#407EA7]/10 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-8">
          <Link href="/appledashboard">
            <div className="flex items-center gap-3">
              <div className="size-8 bg-[#407EA7] rounded-lg shadow-lg shadow-[#407EA7]/20 flex items-center justify-center text-white font-bold">V</div>
              <span className="text-xl font-bold tracking-tight text-slate-800">Verbalize</span>
            </div>
          </Link>

          <div className="flex flex-1 justify-center px-6">
            <nav className="flex w-full max-w-[800px] items-center justify-between">
              
              {/* Dashboard Link (Always inactive style unless you are on dashboard) */}
              <Link
                href="/appledashboard"
                className={`${itemBase} ${inactiveItem}`}
              >
               
                Class: {courseCode || courseId}
              </Link>

             
              <Link
                href={`/course/${courseId}/assignments`}
                className={`${itemBase} ${current === "assignments" ? activeItem : inactiveItem}`}
              >
                Assignments 
                {current === "assignments" && activeItem}
              </Link>

              {/* Students Link */}
              <Link
                href={`/course/${courseId}/students`}
                className={`${itemBase} ${current === "students" ? activeItem : inactiveItem}`}
              >
                Students
                {current === "students" && activeItem}
              </Link>

              {/* Grades Link */}
              <Link
                href={`/course/${courseId}/grades`}
                className={`${itemBase} ${current === "grades" ? activeItem : inactiveItem}`}
              >
                Grades
                {current === "grades" && activeItem}
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-9 w-9 rounded-full bg-black border border-[#407EA7]/20 flex items-center justify-center text-white hover:opacity-80 cursor-pointer transition-opacity">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      <section className="px-8 lg:px-20 mt-6 max-w-[1720px] mx-auto">
        {children}
      </section>
    </main>
  );
}


function SidePlate({
  label,
  href,
  side,
  children,
}: {
  label: string;
  href: string;
  side: "left" | "right";
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group relative block h-full min-h-full w-[112px] rounded-[30px] border border-white/28 bg-white/24 p-[8px] shadow-[0_14px_32px_rgba(15,23,42,0.04)] backdrop-blur-xl transition duration-300 hover:bg-white/34 hover:shadow-[0_18px_40px_rgba(15,23,42,0.06)]"
      aria-label={`Go to ${label}`}
    >
      <div
        className={`h-full overflow-hidden rounded-[26px] opacity-75 blur-[2px] transition duration-300 group-hover:opacity-90 group-hover:blur-[1px] ${side === "left"
            ? "[transform:perspective(1200px)_rotateY(16deg)_scale(0.96)] origin-left"
            : "[transform:perspective(1200px)_rotateY(-16deg)_scale(0.96)] origin-right"
          }`}
      >
        {children}
      </div>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-white/78 px-4 py-2 text-sm font-semibold text-[#425b74] shadow-sm backdrop-blur-md transition group-hover:bg-white/90">
        {label}
      </div>
    </Link>
  );
}

function PreviewShape({
  type,
  side,
}: {
  type: "assignments" | "students" | "grades";
  side: "left" | "right";
}) {
  const padClass = side === "left" ? "pr-2" : "pl-2";

  if (type === "assignments") {
    return (
      <div
        className={`flex h-full w-full flex-col rounded-[26px] bg-[linear-gradient(180deg,#f9fbff_0%,#eef5fc_100%)] p-4 ${padClass}`}
      >
        <div className="h-8 w-16 rounded-full bg-[#d4e6f6]" />

        <div className="mt-5 flex-1 space-y-4">
          <div className="rounded-[18px] border border-[#dce8f5] bg-white/85 p-3">
            <div className="h-4 w-5/6 rounded-full bg-[#a9c7e2]" />
            <div className="mt-2 h-3 w-1/2 rounded-full bg-[#d3e2f0]" />
          </div>
          <div className="rounded-[18px] border border-[#dce8f5] bg-white/85 p-3">
            <div className="h-4 w-4/5 rounded-full bg-[#a9c7e2]" />
            <div className="mt-2 h-3 w-2/5 rounded-full bg-[#d3e2f0]" />
          </div>
          <div className="rounded-[18px] border border-[#dce8f5] bg-white/85 p-3">
            <div className="h-4 w-3/4 rounded-full bg-[#a9c7e2]" />
            <div className="mt-2 h-3 w-1/3 rounded-full bg-[#d3e2f0]" />
          </div>
          <div className="rounded-[18px] border border-[#dce8f5] bg-white/85 p-3">
            <div className="h-4 w-5/6 rounded-full bg-[#a9c7e2]" />
            <div className="mt-2 h-3 w-2/5 rounded-full bg-[#d3e2f0]" />
          </div>
          <div className="rounded-[18px] border border-[#dce8f5] bg-white/85 p-3">
            <div className="h-4 w-2/3 rounded-full bg-[#a9c7e2]" />
            <div className="mt-2 h-3 w-1/2 rounded-full bg-[#d3e2f0]" />
          </div>
        </div>
      </div>
    );
  }

  if (type === "students") {
    return (
      <div
        className={`flex h-full w-full flex-col rounded-[26px] bg-[linear-gradient(180deg,#f9fbff_0%,#eef5fc_100%)] p-4 ${padClass}`}
      >
        <div className="rounded-[18px] border border-[#dce8f5] bg-white/85 p-3">
          <div className="grid grid-cols-3 gap-2">
            <div className="h-3 rounded-full bg-[#bfd6eb]" />
            <div className="h-3 rounded-full bg-[#bfd6eb]" />
            <div className="h-3 rounded-full bg-[#bfd6eb]" />
          </div>
        </div>

        <div className="mt-4 flex-1 space-y-3">
          {[1, 2, 3, 4, 5, 6, 7].map((row) => (
            <div
              key={row}
              className="rounded-[16px] border border-[#dce8f5] bg-white/85 p-3"
            >
              <div className="space-y-2">
                <div className="h-3 w-5/6 rounded-full bg-[#d8e5f1]" />
                <div className="h-3 w-2/3 rounded-full bg-[#d8e5f1]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex h-full w-full flex-col rounded-[26px] bg-[linear-gradient(180deg,#f9fbff_0%,#eef5fc_100%)] p-4 ${padClass}`}
    >
      <div className="rounded-[18px] border border-[#dce8f5] bg-white/85 p-3">
        <div className="grid grid-cols-3 gap-2">
          <div className="h-3 rounded-full bg-[#bfd6eb]" />
          <div className="h-3 rounded-full bg-[#bfd6eb]" />
          <div className="h-3 rounded-full bg-[#bfd6eb]" />
        </div>
      </div>

      <div className="mt-4 flex-1 space-y-3">
        <div className="rounded-[16px] border border-[#c8ddf1] bg-white/85 p-3">
          <div className="space-y-2">
            <div className="h-3 w-5/6 rounded-full bg-[#d8e5f1]" />
            <div className="h-6 rounded-full bg-[#b9d8c0]" />
          </div>
        </div>

        <div className="h-10 rounded-[16px] border-2 border-yellow-300/80 bg-white/70" />
        <div className="h-10 rounded-[16px] border-2 border-green-300/80 bg-white/70" />
        <div className="h-10 rounded-[16px] border-2 border-red-300/80 bg-white/70" />
        <div className="h-10 rounded-[16px] border-2 border-green-300/80 bg-white/70" />
        <div className="h-10 rounded-[16px] border-2 border-sky-300/80 bg-white/70" />
        <div className="h-10 rounded-[16px] border-2 border-sky-300/80 bg-white/70" />
      </div>
    </div>
  );
}