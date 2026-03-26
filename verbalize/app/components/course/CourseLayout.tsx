"use client";

import Link from "next/link";
import { ReactNode } from "react";
import CoursePlate from "./CoursePlate";

type CourseLayoutProps = {
  current: "assignments" | "students" | "grades";
  children: ReactNode;
  courseCode?: string;
  onAddClick?: () => void;
};

export default function CourseLayout({
  current,
  children,
  courseCode = "CS1200",
  onAddClick,
}: CourseLayoutProps) {
  const itemBase =
    "relative pb-2 text-[16px] font-semibold transition-colors duration-200";
  const activeItem = "text-white";
  const inactiveItem = "text-white/55 hover:text-white/85";

  const getNeighbors = () => {
    if (current === "assignments") {
      return {
        left: { label: "Grades", href: "/grades", type: "grades" as const },
        right: { label: "Students", href: "/students", type: "students" as const },
      };
    }

    if (current === "students") {
      return {
        left: {
          label: "Assignments",
          href: "/assignments",
          type: "assignments" as const,
        },
        right: { label: "Grades", href: "/grades", type: "grades" as const },
      };
    }

    return {
      left: { label: "Students", href: "/students", type: "students" as const },
      right: {
        label: "Assignments",
        href: "/assignments",
        type: "assignments" as const,
      },
    };
  };

  const { left, right } = getNeighbors();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#6aa7d8_0px,#8fbcdf_56px,#eef4fa_220px,#f5f5f7_380px)] text-[#1d1d1f]">
      {/* Single top nav */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[linear-gradient(135deg,#0b1f3a_0%,#1c4c74_45%,#5fa3d7_100%)] backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-8">
          {/* Left */}
          <div className="flex min-w-[120px] items-center">
            <Link
              href="/appledashboard"
              className="text-[22px] font-semibold tracking-tight text-white"
            >
              V
            </Link>
          </div>

          {/* Middle nav replaces search bar */}
          <div className="flex flex-1 justify-center px-6">
            <nav className="flex w-full max-w-[900px] items-center justify-between">
              <Link
                href="/appledashboard"
                className={`${itemBase} ${activeItem}`}
              >
                Class: {courseCode}
              </Link>

              <Link
                href="/assignments"
                className={`${itemBase} ${
                  current === "assignments" ? activeItem : inactiveItem
                }`}
              >
                Assignments
                {current === "assignments" && (
                  <span className="absolute left-0 bottom-0 h-[4px] w-full rounded-full bg-white" />
                )}
              </Link>

              <Link
                href="/students"
                className={`${itemBase} ${
                  current === "students" ? activeItem : inactiveItem
                }`}
              >
                Students
                {current === "students" && (
                  <span className="absolute left-0 bottom-0 h-[4px] w-full rounded-full bg-white" />
                )}
              </Link>

              <Link
                href="/grades"
                className={`${itemBase} ${
                  current === "grades" ? activeItem : inactiveItem
                }`}
              >
                Grades
                {current === "grades" && (
                  <span className="absolute left-0 bottom-0 h-[4px] w-full rounded-full bg-white" />
                )}
              </Link>

              <button
                type="button"
                onClick={onAddClick}
                className={`${itemBase} ${inactiveItem}`}
              >
                + Add Assignment
              </button>
            </nav>
          </div>

          {/* Right */}
          <div className="flex min-w-[140px] items-center justify-end gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1d1d1f"
                strokeWidth="1.8"
                className="h-4 w-4"
              >
                <path d="M20 21a8 8 0 0 0-16 0" />
                <circle cx="12" cy="8" r="4" />
              </svg>
            </div>
            <span className="text-[15px] font-medium text-white">Professor</span>
          </div>
        </div>
      </header>

      {/* Page content area */}
      <section className="mx-auto mt-6 grid max-w-[1720px] grid-cols-[112px_minmax(0,1fr)_112px] gap-3 px-0">
        <SidePlate label={left.label} href={left.href} side="left">
          <PreviewShape type={left.type} side="left" />
        </SidePlate>

        <CoursePlate>{children}</CoursePlate>

        <SidePlate label={right.label} href={right.href} side="right">
          <PreviewShape type={right.type} side="right" />
        </SidePlate>
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
        className={`h-full overflow-hidden rounded-[26px] opacity-75 blur-[2px] transition duration-300 group-hover:opacity-90 group-hover:blur-[1px] ${
          side === "left"
            ? "[transform:perspective(1200px)_rotateY(16deg)_scale(0.96)] origin-left"
            : "[transform:perspective(1200px)_rotateY(-16deg)_scale(0.96)] origin-right"
        }`}
      >
        {children}
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/78 px-4 py-2 text-sm font-semibold text-[#425b74] shadow-sm backdrop-blur-md transition group-hover:bg-white/90">
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