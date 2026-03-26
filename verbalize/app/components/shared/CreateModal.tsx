"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { StudentUploader } from "@/lib/StudentUploader";
import { createClient } from "@/lib/supabase/client";

type CreateModalProps = {
  open: boolean;
  mode: "assignment" | "class";
  onClose: () => void;
  courseId?: number; 
};

export default function CreateModal({
  open,
  mode,
  onClose,
  courseId,
}: CreateModalProps) {
  const supabase = createClient();

  const [nameValue, setNameValue] = useState("");
  const [secondValue, setSecondValue] = useState("");
  const [sectionValue, setSectionValue] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  if (!open) return null;

  const isAssignment = mode === "assignment";

  const title = isAssignment ? "Create an assignment" : "Create a class";
  const nameLabel = isAssignment ? "Assignment name" : "Class name";
  const secondLabel = isAssignment ? "Due date" : "Class code";
  const secondPlaceholder = isAssignment ? "DD - MM - YYYY" : "Enter class code";
  const thirdLabel = "Section";
  const thirdPlaceholder = "Enter section";
  const fourthLabel = isAssignment ? "Assignment file" : "Student file";

  const resetForm = () => {
    setNameValue("");
    setSecondValue("");
    setSectionValue("");
    setFile(null);
    setMessage("");
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const extractText = async (file: File) => {
    const pdfjs = await import('pdfjs-dist');
    pdfjs.GlobalWorkerOptions.workerSrc =
      `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(' ') + '\n';
    }

    return text;
};

  const handleSubmit = async () => {
    if (!nameValue.trim() || !file) {
      setMessage("Please fill in the required name and upload the file.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      if (isAssignment) {
        if (!courseId) throw new Error("Missing courseId");
        if (!pdfFile) throw new Error("Please upload a PDF file");

        setMessage("Creating assignment...");

        // 1. Create assignment
        const { data: assignmentData, error } = await supabase
          .from("Assignments")
          .insert({
            assignment_name: nameValue,
            course_id: courseId,
          })
          .select()
          .single();

        if (error) throw error;

        const assignmentId = assignmentData.id;

        // 2. Extract text from PDF
        setMessage("Reading PDF...");
        const aiText = await extractText(pdfFile);

        // 3. Upload files
        setMessage("Uploading files...");
        const zipPath = `master_zips/${Date.now()}-${file.name}`;
        const pdfPath = `pdf_instruction/${Date.now()}-${pdfFile.name}`;

        await supabase.storage.from("AssignmentsBucket").upload(zipPath, file);
        await supabase.storage.from("AssignmentsBucket").upload(pdfPath, pdfFile);

        // 4. Update DB
        await supabase
          .from("Assignments")
          .update({
            instruction_text: aiText,
            submissions: zipPath,
          })
          .eq("id", assignmentId);

        // 5. Process submissions
        setMessage("Processing submissions...");
        await fetch("/api/processSubmissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            zipPath,
            assignmentId,
          }),
        });

        // 6. Generate AI questions
        setMessage("Generating AI questions...");
        await fetch("/api/generate-questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            assignmentId,
            instructionText: aiText,
          }),
        });

        setMessage("Assignment created successfully!");

      } else {
        if (!sectionValue.trim()) {
          throw new Error("Please enter a section for the class.");
        }

        setMessage("Creating class...");
        
        const res = await fetch("/api/course", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            course_name: nameValue,
            section_num: sectionValue,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create course");

        setMessage("Uploading and parsing student CSV...");

        const uploader = new StudentUploader(supabase, file, data.id);
        await uploader.process();

        setMessage("Class created successfully!");
      }

      setTimeout(() => {
        handleClose();
      }, 1000);

    } catch (err: any) {
      console.error(err);
      setMessage(err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-white/18 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-[min(92vw,620px)] rounded-xl bg-white px-10 py-10 shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
        <button
          onClick={handleClose}
          className="absolute right-8 top-8 text-[#c7c9cf] transition hover:text-[#8a8f98]"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-6 w-6">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        <h2 className="text-[28px] font-semibold tracking-[-0.03em] text-[#1f2a44]">
          {title}
        </h2>

        <div className="mt-8 space-y-6">
          {/* Name input */}
          <div>
            <label className="mb-3 block text-[16px] font-semibold text-[#1d1d1f]">
              {nameLabel}
            </label>
            <input
              type="text"
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              className="h-14 w-full rounded-[16px] bg-[#f3f4f6] px-5 text-[16px] outline-none placeholder:text-[#9ca3af]"
              placeholder={nameLabel}
              disabled={loading}
            />
          </div>

          {/* Secondary inputs */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="mb-3 block text-[16px] font-semibold text-[#1d1d1f]">
                {secondLabel}
              </label>
              <input
                type="text"
                value={secondValue}
                onChange={(e) => setSecondValue(e.target.value)}
                className="h-14 w-full rounded-[16px] bg-[#f3f4f6] px-5 text-[16px] outline-none placeholder:text-[#9ca3af]"
                placeholder={secondPlaceholder}
                disabled={loading}
              />
            </div>

            {/* Section input (Class mode only) */}
            {!isAssignment && (
              <div>
                <label className="mb-3 block text-[16px] font-semibold text-[#1d1d1f]">
                  {thirdLabel}
                </label>
                <input
                  type="text"
                  value={sectionValue}
                  onChange={(e) => setSectionValue(e.target.value)}
                  className="h-14 w-full rounded-[16px] bg-[#f3f4f6] px-5 text-[16px] outline-none placeholder:text-[#9ca3af]"
                  placeholder={thirdPlaceholder}
                  disabled={loading}
                />
              </div>
            )}
          </div>

          {/* File upload */}
          <div>
            <label className="mb-3 block text-[16px] font-semibold text-[#1d1d1f]">
              {fourthLabel}
            </label>
            <label className="flex h-14 w-full cursor-pointer items-center justify-center rounded-[16px] bg-[#f3f4f6] px-4 text-[16px] text-[#9ca3af] transition hover:bg-[#eceef2]">
              <span className="truncate">{file ? file.name : `Upload ${isAssignment ? '.zip' : '.csv'} file`}</span>
              <input
                type="file"
                accept={isAssignment ? ".zip" : ".csv"}
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                disabled={loading}
              />
            </label>
          </div>

        <div>
        {isAssignment && (<div>
            <label className="mb-3 block text-[16px] font-semibold text-[#1d1d1f]">
              Instruction PDF
            </label>
            <label className="flex h-14 w-full cursor-pointer items-center justify-center rounded-[16px] bg-[#f3f4f6] px-4 text-[16px] text-[#9ca3af]">
              <span className="truncate">
                {pdfFile ? pdfFile.name : "Upload .pdf file"}
              </span>
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>)}
          </div>

          {message && <p className="text-[14px] font-medium text-[#5f6672]">{message}</p>}
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-end gap-4">
          <button
            onClick={handleClose}
            type="button"
            className="rounded-full px-5 py-3 text-[16px] font-semibold text-[#8a8f98] transition hover:text-[#5f6672]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-[16px] bg-[#f3f4f6] px-8 py-3 text-[16px] font-semibold text-[#1f2a44] shadow-[0_4px_10px_rgba(15,23,42,0.08)] transition hover:bg-[#eceef2] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Processing..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}