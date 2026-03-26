"use client";

import Link from "next/link";
import { ReactNode } from "react";
// 引入 useParams 来获取动态路由参数
import { useParams } from "next/navigation"; 
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
  courseCode, // 这里去掉了默认的 "CS1200"
  onAddClick,
}: CourseLayoutProps) {
  
  // 🔴 核心改动：获取当前真实的 courseId
  const params = useParams();
  const courseId = params?.courseId as string || "unknown";

  const itemBase =
    "relative pt-2 pb-2 text-[15px] font-semibold transition-colors duration-200";
  const activeItem = "text-[#407EA7]";
  const inactiveItem = "text-[#407EA7]/55 hover:text-[#407EA7]/85";

  // 注意：这个 getNeighbors 函数主要是给 SidePlate 用的，
  // 既然我们现在移除了霸道的 CoursePlate，这部分代码其实也可以以后清理掉，
  // 但为了安全起见，我先帮你把这里的路径也修正了。
  const getNeighbors = () => {
    if (current === "assignments") {
      return {
        left: { label: "Grades", href: `/course/${courseId}/grades`, type: "grades" as const },
        right: { label: "Students", href: `/course/${courseId}/students`, type: "students" as const },
      };
    }

    if (current === "students") {
      return {
        left: {
          label: "Assignments",
          href: `/course/${courseId}/assignments`,
          type: "assignments" as const,
        },
        right: { label: "Grades", href: `/course/${courseId}/grades`, type: "grades" as const },
      };
    }

    return {
      left: { label: "Students", href: `/course/${courseId}/students`, type: "students" as const },
      right: {
        label: "Assignments",
        href: `/course/${courseId}/assignments`,
        type: "assignments" as const,
      },
    };
  };

  const { left, right } = getNeighbors();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#6aa7d8_0px,#8fbcdf_56px,#eef4fa_220px,#f5f5f7_380px)] text-[#1d1d1f]">
      {/* Single top nav */}
      <header className="sticky top-0 z-50 border-b border-[#407EA7]/10 bg-white backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-8">
          <Link href="/appledashboard">
            <div className="flex items-center gap-3">
              <div className="size-8 bg-[#407EA7] rounded-lg shadow-lg shadow-[#407EA7]/20 flex items-center justify-center text-white font-bold">V</div>
              <span className="text-xl font-bold tracking-tight text-slate-800">Verbalize</span>
            </div>
          </Link>

          <div className="flex flex-1 justify-center px-6">
            <nav className="flex w-full max-w-[900px] items-center justify-between">
              <Link
                href="/appledashboard"
                className={`${itemBase} ${activeItem}`}
              >
                {/* 🔴 如果没传 courseCode，就显示 URL 里的 courseId */}
                Class: {courseCode || courseId}
              </Link>

              {/* 🔴 核心改动：修改了 href 路径，拼接了真实的 courseId */}
              <Link
                href={`/course/${courseId}/assignments`}
                className={`${itemBase} ${current === "assignments" ? activeItem : inactiveItem
                  }`}
              >
                Assignments
                {current === "assignments" && (
                  <span className="absolute left-0 bottom-0 h-[4px] w-full rounded-full bg-[#407EA7]" />
                )}
              </Link>

              <Link
                href={`/course/${courseId}/students`}
                className={`${itemBase} ${current === "students" ? activeItem : inactiveItem
                  }`}
              >
                Students
                {current === "students" && (
                  <span className="absolute left-0 bottom-0 h-[4px] w-full rounded-full bg-[#407EA7]" />
                )}
              </Link>

              <Link
                href={`/course/${courseId}/grades`}
                className={`${itemBase} ${current === "grades" ? activeItem : inactiveItem
                  }`}
              >
                Grades
                {current === "grades" && (
                  <span className="absolute left-0 bottom-0 h-[4px] w-full rounded-full bg-[#407EA7]" />
                )}
              </Link>

              {/* 注意：你在子页面里已经重写了 Add Assignment 按钮，所以这里的其实多余了。
                  如果不需要，你可以把它删掉。 */}
              <button
                type="button"
                onClick={onAddClick}
                className={`${itemBase} ${inactiveItem}`}
              >
                + Add Assignment
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-9 w-9 rounded-full bg-black border border-[#407EA7]/20 flex items-center justify-center text-white">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
          </div>
        </div>
      </header>

      {/* Page content area */}
      <section className="px-8 lg:px-20 mt-6 max-w-[1720px] mx-auto gap-3">
        {/* 🔴 核心改动：移除了 <CoursePlate>，直接渲染 children */}
        {children}
      </section>
    </main>
  );
}

// ============================================================================
// 下面这些组件 (SidePlate, PreviewShape) 是 Huy 之前写给 CoursePlate 用的动画。
// 既然我们现在不用 CoursePlate 了，这些代码其实处于“休眠”状态。
// 我帮你原封不动地保留在这里，万一他以后还要用到，就不会报错了。
// ============================================================================

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