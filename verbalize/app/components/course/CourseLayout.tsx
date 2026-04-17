"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { useParams } from "next/navigation"; 
import Logo from "../assets/Verbalize-Picsart-BackgroundRemover.jpg";

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
              <img src={Logo.src} alt="Logo" className="size-22 mb-2 rounded-full " />
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
