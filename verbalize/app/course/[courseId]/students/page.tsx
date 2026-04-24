"use client";

import { useState, useEffect, use } from "react";
import { createClient } from "@/lib/supabase/client";

type StudentInfo = {
  id?: string;
  lastName: string;
  firstName: string;
  netId: string;
  grade: string;
};

export default function StudentsPage({ params }: { params: Promise<{ courseId: number }> }) {
  const [students, setStudents] = useState<StudentInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [selectedSubmissions, setSelectedSubmissions] = useState<any[]>([]);
  const [currentSubIndex, setCurrentSubIndex] = useState(0);

  const [selectedTranscript, setSelectedTranscript] = useState<any[]>([]);
  const [modalType, setModalType] = useState<"code" | "transcript" | null>(null);

  const handleViewCode = async (studentId?: string) => {
    if (!studentId) return;

    const { data, error } = await supabase
      .from("Submissions")
      .select(`
      id,
      code_text,
      submitted_at,
      Assignments!inner (assignment_name, course_id)
    `)
      .eq("student_id", studentId)
      .eq("Assignments.course_id", courseId)
      .order("submitted_at", { ascending: false });

    if (error || !data?.length) {
      setSelectedCode("No code found for this course.");
      setSelectedSubmissions([]);
    } else {
      setSelectedSubmissions(data);
      setCurrentSubIndex(0);
      setSelectedCode(data[0].code_text);
    }
    setModalType("code");
  };

  const resolvedParams = use(params);
  const courseId = resolvedParams.courseId;

  useEffect(() => {
    async function fetchStudents() {
      if (!courseId) return;

      const { data, error } = await supabase
        .from("Course_Students")
        .select(`
          *,
          Students (
            id,
            last_name,
            first_name,
            netID
          )
        `)
        .eq("course_id", courseId);

      if (error) {
        setStudents(getMockStudents());
      } else if (data && data.length > 0) {
        const mappedStudents = data.map((record: any) => {
          const s = record.Students;
          return {
            id: s?.id || record.id,
            lastName: s?.last_name || "Unknown",
            firstName: s?.first_name || "Unknown",
            netId: s?.netID || "N/A",
            grade: record.grade || "A"
          };
        });
        setStudents(mappedStudents);
      } else {
        setStudents([]);
      }
      setLoading(false);
    }

    fetchStudents();
  }, [courseId]);

  const handleViewTranscript = async (studentId?: string) => {
    if (!studentId) return;

    const { data: submissions, error } = await supabase
      .from("Submissions")
      .select(`
      id,
      Assignments!inner (assignment_name, course_id),
      Results (
        transcript,
        summary,
        call_id
      )
    `)
      .eq("student_id", studentId)
      .eq("Assignments.course_id", courseId)
      .order("submitted_at", { ascending: false });

    if (error || !submissions || submissions.length === 0) {
      setSelectedSubmissions([]);
      setSelectedTranscript([]);
      setModalType("transcript");
      return;
    }

    setSelectedSubmissions(submissions);
    setCurrentSubIndex(0);
    setSelectedTranscript(submissions[0].Results || []);
    setModalType("transcript");
  };

  return (
    <>
      <div className="h-full">
        <div className="flex justify-between items-center px-2 py-4 border-b border-gray-100 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Students</h1>
            <p className="text-sm text-slate-500">Course ID: {courseId}</p>
          </div>
          {/* 💥 按钮已经从这里彻底删除了！ 💥 */}
        </div>

        <div className="px-2 py-2">
          <div className="overflow-hidden rounded-xl border border-[#edf2f7]">
            <div className="grid grid-cols-5 gap-4 bg-[#f3f4f6] px-10 py-5 text-[14px] font-semibold text-[#1f2a44]">
              <div className="flex justify-center"><div className="w-24">Last Name</div></div>
              <div className="flex justify-center"><div className="w-24">First Name</div></div>
              <div className="flex justify-center"><div className="w-24">Net ID</div></div>
              <div className="flex justify-center"><div className="w-32">Uploaded Code</div></div>
              <div className="flex justify-center"><div className="w-24">Transcript</div></div>
            </div>

            <div className="divide-y divide-[#edf2f7] bg-white">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5b92b9]"></div>
                </div>
              ) : students.length === 0 ? (
                <div className="text-center py-20 text-slate-400">
                  No students found for this course.
                </div>
              ) : (
                students.map((student, index) => (
                  <div
                    key={student.id || index}
                    className="grid grid-cols-5 gap-4 px-10 py-4 text-[13px] items-center"
                  >
                    <div className="flex justify-center">
                      <div className="w-24 font-semibold text-[#1d1d1f]">{student.lastName}</div>
                    </div>
                    <div className="flex justify-center">
                      <div className="w-24 font-semibold text-[#1d1d1f]">{student.firstName}</div>
                    </div>
                    <div className="flex justify-center">
                      <div className="w-24 text-[#6e6e73]">{student.netId}</div>
                    </div>
                    <div className="flex justify-center">
                      <div className="w-32">
                        <span
                          onClick={() => handleViewCode(student.id)}
                          className="font-semibold text-[#4f87b0] cursor-pointer hover:text-blue-700 underline"
                        >
                          View Code
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <div className="w-24">
                        <span
                          onClick={() => handleViewTranscript(student.id)}
                          className="font-semibold text-[#4f87b0] cursor-pointer hover:text-blue-700 underline"
                        >
                          Transcript
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 💥 CreateModal 组件也已经被彻底删除了！ 💥 */}

      {modalType && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[700px] max-h-[80vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">
                {modalType === "code" ? "Student Code" : "AI Transcript"}
              </h2>
              <button onClick={() => setModalType(null)}>✕</button>
            </div>

            {modalType === "code" && (
              <div>
                {selectedSubmissions.length > 1 && (
                  <div className="flex justify-between items-center mb-4 bg-slate-50 p-2 rounded-lg border">
                    <button
                      disabled={currentSubIndex === 0}
                      onClick={() => {
                        const newIndex = currentSubIndex - 1;
                        setCurrentSubIndex(newIndex);
                        setSelectedCode(selectedSubmissions[newIndex].code_text);
                      }}
                      className="px-3 py-1 text-sm bg-white border rounded shadow-sm disabled:opacity-30"
                    >
                      ← Previous
                    </button>
                    <span className="text-sm font-medium">
                      {selectedSubmissions[currentSubIndex].Assignments?.assignment_name}
                      <span className="text-slate-400 ml-2">({currentSubIndex + 1} of {selectedSubmissions.length})</span>
                    </span>
                    <button
                      disabled={currentSubIndex === selectedSubmissions.length - 1}
                      onClick={() => {
                        const newIndex = currentSubIndex + 1;
                        setCurrentSubIndex(newIndex);
                        setSelectedCode(selectedSubmissions[newIndex].code_text);
                      }}
                      className="px-3 py-1 text-sm bg-white border rounded shadow-sm disabled:opacity-30"
                    >
                      Next →
                    </button>
                  </div>
                )}
                <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto min-h-[300px]">
                  {selectedCode || "No code content available."}
                </pre>
              </div>
            )}

            {modalType === "transcript" && (
              <div className="space-y-4">
                {selectedSubmissions.length > 0 && (
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-200 mb-4">
                    <button
                      disabled={currentSubIndex === 0}
                      onClick={() => {
                        const nextIdx = currentSubIndex - 1;
                        setCurrentSubIndex(nextIdx);
                        setSelectedTranscript(selectedSubmissions[nextIdx].Results || []);
                      }}
                      className="text-xs font-bold text-blue-600 disabled:text-gray-300"
                    >
                      ← PREV
                    </button>
                    <div className="text-center">
                      <p className="text-xs font-bold text-slate-800 uppercase">
                        {selectedSubmissions[currentSubIndex].Assignments?.assignment_name}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Submission {currentSubIndex + 1} of {selectedSubmissions.length}
                      </p>
                    </div>
                    <button
                      disabled={currentSubIndex === selectedSubmissions.length - 1}
                      onClick={() => {
                        const nextIdx = currentSubIndex + 1;
                        setCurrentSubIndex(nextIdx);
                        setSelectedTranscript(selectedSubmissions[nextIdx].Results || []);
                      }}
                      className="text-xs font-bold text-blue-600 disabled:text-gray-300"
                    >
                      NEXT →
                    </button>
                  </div>
                )}

                {selectedTranscript.length > 0 ? (
                  selectedTranscript.map((entry, i) => (
                    <div key={i} className="p-4 border rounded-lg bg-white shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
                          Call #{entry.call_id}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {entry.transcript}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                    <p className="text-slate-500 font-semibold text-sm">No transcript available</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function getMockStudents(): StudentInfo[] {
  return [
    { id: "1", lastName: "Nguyen", firstName: "Nguyen", netId: "abc123", grade: "A" },
    { id: "2", lastName: "Smith", firstName: "John", netId: "js456", grade: "B" },
    { id: "3", lastName: "Doe", firstName: "Jane", netId: "jd789", grade: "C" },
  ];
}