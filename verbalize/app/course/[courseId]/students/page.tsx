"use client";

import { useState, useEffect, use } from "react";
import CreateModal from "@/app/components/shared/CreateModal";
import { createClient } from "@/lib/supabase/client";

// student structure
type StudentInfo = {
  id?: string;
  lastName: string;
  firstName: string;
  netId: string;
  grade: string;
};


export default function StudentsPage({ params }: { params: Promise<{ courseId: number }> }) {
  const [openModal, setOpenModal] = useState(false);

  const [students, setStudents] = useState<StudentInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [selectedTranscript, setSelectedTranscript] = useState<any[]>([]);
  const [modalType, setModalType] = useState<"code" | "transcript" | null>(null);

  const handleViewCode = async (studentId?: string) => {
  if (!studentId) return;

  const { data, error } = await supabase
    .from("Submissions")
    .select("code_text")
    .eq("student_id", studentId)
    .order("submitted_at", { ascending: false })
    .limit(1);

  if (error) {
    console.log(error);
    return;
  }

  setSelectedCode(data?.[0]?.code_text || "No code found");
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
        console.error("Error fetching students:", error);
        
        setStudents(getMockStudents());
      } else if (data && data.length > 0) {
     
        const mappedStudents = data.map((record: any) => {
        // Access the nested student object
              const s = record.Students; 
              
              return {
                id: s?.id || record.id,
                lastName: s?.last_name || "Unknown",
                firstName: s?.first_name || "Unknown",
                netId: s?.netID || "N/A",
                grade: record.grade || "A" // Grade usually lives on the join table
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

  const badgeStyle = (grade: string) => {
    if (grade === "A") return "bg-green-100 text-green-700";
    if (grade === "B") return "bg-blue-100 text-blue-700";
    if (grade === "C") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <>
      
      <div className="h-full">
        
        <div className="flex justify-between items-center px-2 py-4 border-b border-gray-100 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Students</h1>
           
            <p className="text-sm text-slate-500">Course ID: {courseId}</p>
          </div>
          <button
            onClick={() => setOpenModal(true)}
            className="rounded-xl bg-[#5b92b9] px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-[#4a7a9c] transition-colors"
          >
            + Add Assignment
          </button>
        </div>

        <div className="px-2 py-2">
          <div className="overflow-hidden rounded-xl border border-[#edf2f7]">
            {/* Table Header */}
            <div className="grid grid-cols-6 gap-4 bg-[#f3f4f6] px-6 py-5 text-[14px] font-semibold text-[#1f2a44]">
              <div>Last Name</div>
              <div>First Name</div>
              <div>Net ID</div>
              <div>Uploaded Code</div>
              <div>AI Transcript</div>
              <div>AI Evaluation</div>
            </div>

            {/* Table Body */}
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
                    className="grid grid-cols-6 items-center gap-4 px-6 py-2 text-[13px]"
                  >
                    <div className="font-semibold text-[#1d1d1f]">{student.lastName}</div>
                    <div className="font-semibold text-[#1d1d1f]">{student.firstName}</div>
                    <div className="text-[#6e6e73]">{student.netId}</div>

                    <div>
                      <span
                          onClick={() => handleViewCode(student.id)}
                          className="font-semibold text-[#4f87b0] cursor-pointer hover:text-blue-700 underline"
                        >
                          View Code
                      </span>
                    </div>

                    <div>
                      <span
                        //onClick={() => handleViewTranscript(student.id)}
                        className="font-semibold text-[#4f87b0] cursor-pointer hover:text-blue-700 underline"
                      >
                        Transcript
                      </span>
                    </div>

                    <div>
                      <span
                        className={`inline-flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-[15px] font-bold ${badgeStyle(
                          student.grade
                        )}`}
                      >
                        {student.grade}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <CreateModal
        open={openModal}
        mode="assignment"
       
        courseId={courseId}
        onClose={() => setOpenModal(false)}
      />

      {modalType && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-[700px] max-h-[80vh] overflow-y-auto shadow-xl">
      
      {/* CLOSE */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">
          {modalType === "code" ? "Student Code" : "AI Transcript"}
        </h2>
        <button onClick={() => setModalType(null)}>✕</button>
      </div>

      {/* CODE VIEW */}
      {modalType === "code" && (
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
          {selectedCode}
        </pre>
      )}

      {/* TRANSCRIPT VIEW */}
      {modalType === "transcript" && (
        <div className="space-y-4">
          {selectedTranscript.map((entry, i) => (
            <div key={i} className="border p-3 rounded">
              <p className="font-bold text-sm mb-1">
                Question {i + 1}
              </p>
              <p className="text-sm text-gray-700">
                {entry.student_response}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Summary: {entry.summary}
              </p>
            </div>
          ))}
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
    { lastName: "nguyen", firstName: "nguyen", netId: "abc123", grade: "A" },
    { lastName: "smith", firstName: "john", netId: "js456", grade: "B" },
    { lastName: "doe", firstName: "jane", netId: "jd789", grade: "C" },
  ];
}