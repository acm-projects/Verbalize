"use client";

import {useRef, useState } from "react";
import { StudentUploader } from '@/lib/StudentUploader'
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import CreateModal from "../components/shared/CreateModal";



export default function Course() {
  const supabase = createClient();
  const router = useRouter();

    const fileInputRef = useRef<HTMLInputElement>(null); // hidden input ref



  const [courseName, setCourseName] = useState("");
  const [sectionNum, setSectionNum] = useState("");
  const [studentInfo, setStudentInfo] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

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
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      if (file) {
        const uploader = new StudentUploader(supabase, file, data.id);
        await uploader.process(); // upload to storage + insert students
      }

      setMessage("Course created successfully!");
      setCourseName("");
      setSectionNum("");
      setStudentInfo("");
      setFile(null);
      setIsModalOpen(false);
      router.push(`/assignments/create?courseId=${data.id}`);

      
    } catch (err: any) {
      setMessage(err.message);
    }

    setLoading(false);
  };

  return (
    <div>
      {/* Open Modal Button */}
      <button
        className="rounded bg-blue-500 px-4 py-2 text-white"
        onClick={() => setIsModalOpen(true)}
      >
        Create Class
      </button>

      {/* Modal */}
      
      <CreateModal
        open={isModalOpen}
        mode="class"
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        courseName={courseName}
        setCourseName={setCourseName}
        sectionNum={sectionNum}
        setSectionNum={setSectionNum}
        file={file}
        setFile={setFile}/>
    </div>
  );
}