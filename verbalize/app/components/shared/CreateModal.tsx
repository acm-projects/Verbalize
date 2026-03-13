"use client";

import { useState } from "react";
import { StudentUploader } from "@/lib/StudentUploader";
import { createClient } from "@/lib/supabase/client";

type CreateModalProps = {
  open: boolean;
  mode: "assignment" | "class";
  onClose: () => void;
};

export default function CreateModal({
  open,
  mode,
  onClose,
}: CreateModalProps) {
  const supabase = createClient();

  const [nameValue, setNameValue] = useState("");
  const [secondValue, setSecondValue] = useState("");
  const [sectionValue, setSectionValue] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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

  const handleSubmit = async () => {
    if (isAssignment) {
      setMessage("Assignment modal UI is ready, but backend is not connected yet.");
      return;
    }

    if (!nameValue.trim() || !sectionValue.trim() || !file) {
      setMessage("Please fill in class name, section, and upload a CSV file.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
        const res = await fetch("/api/course", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            course_name: nameValue,
            section_num: sectionValue,
            student_info: "",
          }),
        });

        const raw = await res.text();
        console.log("course response status:", res.status);
        console.log("course response body:", raw);

      if (!res.ok) {
        throw new Error(data.error || "Failed to create course");
      }

      const uploader = new StudentUploader(supabase, file);
      await uploader.process();

      setMessage("Course created successfully!");

      setTimeout(() => {
        handleClose();
      }, 700);
    } catch (err: any) {
      setMessage(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-white/18 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* modal */}
      <div className="relative z-10 w-[min(92vw,620px)] rounded-[36px] bg-white px-10 py-10 shadow-[0_30px_80px_rgba(15,23,42,0.18)]">
        <button
          onClick={handleClose}
          className="absolute right-8 top-8 text-[#c7c9cf] transition hover:text-[#8a8f98]"
          aria-label="Close modal"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            className="h-6 w-6"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>

        <h2 className="text-[28px] font-semibold tracking-[-0.03em] text-[#1f2a44]">
          {title}
        </h2>

        <div className="mt-8 space-y-6">
          {/* name */}
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
            />
          </div>

          {/* second + section */}
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
              />
            </div>

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
              />
            </div>
          </div>

          {/* file */}
          <div>
            <label className="mb-3 block text-[16px] font-semibold text-[#1d1d1f]">
              {fourthLabel}
            </label>

            <label className="flex h-14 w-full cursor-pointer items-center justify-center rounded-[16px] bg-[#f3f4f6] px-4 text-[16px] text-[#9ca3af] transition hover:bg-[#eceef2]">
              <span className="truncate">
                {file ? file.name : isAssignment ? "Upload file" : "Upload CSV file"}
              </span>
              <input
                type="file"
                accept={isAssignment ? undefined : ".csv"}
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFile(e.target.files[0]);
                  }
                }}
              />
            </label>
          </div>

          {message && (
            <p className="text-[14px] font-medium text-[#5f6672]">{message}</p>
          )}
        </div>

        {/* footer */}
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