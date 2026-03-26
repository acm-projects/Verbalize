import CourseLayout from "@/app/components/course/CourseLayout";

export default function DynamicCourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) {
  return (
    // 🔴 核心：直接用 CourseLayout 包裹 children，把霸道的 CoursePlate 删掉！
    <CourseLayout>
      {/* 你原来那些作业和成绩列表就会直接乖乖渲染进来了 */}
      {children}
    </CourseLayout>
  );
}