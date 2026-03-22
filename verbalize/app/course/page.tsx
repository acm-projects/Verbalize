"use client";

import { useState } from "react";
import { StudentUploader } from '@/lib/StudentUploader'
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";



export default function Course() {
  const supabase = createClient();
  const router = useRouter();


  const [courseName, setCourseName] = useState("");
  const [sectionNum, setSectionNum] = useState("");
  const [studentInfo, setStudentInfo] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course_name: courseName,
          section_num: sectionNum,
          student_info: studentInfo,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      if (file) {
        const uploader = new StudentUploader(supabase, file,data.id);
        await uploader.process(); // upload to storage + insert students
      }

      setMessage("Course created successfully!");
      setCourseName("");
      setSectionNum("");
      setStudentInfo("");
      router.push(`/assignments/create?courseId=${data.id}`);

      
    } catch (err: any) {
      setMessage(err.message);
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Create Course & Upload Students</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Course Name</label>
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Section Number</label>
          <input
            type="text"
            value={sectionNum}
            onChange={(e) => setSectionNum(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Upload Student CSV</label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => e.target.files && setFile(e.target.files[0])}
            style={{ marginTop: 8 }}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Create Course"}
        </button>
      </form>

      {message && <p style={{ marginTop: 20 }}>{message}</p>}
    </div>
  );
}