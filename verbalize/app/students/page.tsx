"use client";
import ClassroomHeader from '../addassignmentPublic';
import DashboardSidebar from '../dashboard/dashboardSidebar';
// 1. Mock student data
const studentsData = [
  { id: 1, lastName: "nguyen", firstName: "nguyen", netId: "abc123", aiEval: "A" },
  { id: 2, lastName: "smith", firstName: "john", netId: "js456", aiEval: "B" },
  { id: 3, lastName: "doe", firstName: "jane", netId: "jd789", aiEval: "C" },
  { id: 4, lastName: "lee", firstName: "bruce", netId: "bl001", aiEval: "A" },
  { id: 5, lastName: "wang", firstName: "david", netId: "dw222", aiEval: "D" },
];
// Helper function: Return different badge colors based on AI evaluation
const getBadgeStyle = (grade: string) => {
  switch (grade) {
    case 'A': return 'bg-green-100 text-green-700 border-green-200';
    case 'B': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'C': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'D': return 'bg-red-100 text-red-700 border-red-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

export default function StudentsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] relative">
      
      

      {/* 2. Right content area: Pushed 300px to make room for the sidebar */}
      <div className="flex-1 flex flex-col relative min-h-screen">
        
        {/* Top Header */}
        <ClassroomHeader activePage="students" />

        {/* 3. Main content: Use the modified left-aligned width ratio */}
        <main className="w-full py-10 pl-10 pr-4 flex flex-col items-center">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            
            {/* Table Header */}
            <div className="bg-[#EAEAEA] rounded-lg p-4 grid grid-cols-6 font-extrabold text-[#1E293B] mb-4 text-sm">
              <div>Last Name</div>
              <div>First Name</div>
              <div>Net ID</div>
              <div>Uploaded Code</div>
              <div>AI Transcript</div>
              <div>AI Evaluation</div>
            </div>

            {/* Student List */}
            <div className="flex flex-col gap-3">
              {studentsData.map((student) => (
                <div key={student.id} className="bg-white border-2 border-[#86D7FF] shadow-[0_0_12px_rgba(134,215,255,0.4)] rounded-lg p-3 grid grid-cols-6 items-center font-bold text-sm transition-all hover:scale-[1.01] hover:shadow-[0_0_16px_rgba(134,215,255,0.6)] cursor-pointer">
                  <div>{student.lastName}</div>
                  <div>{student.firstName}</div>
                  <div className="text-gray-500 font-medium">{student.netId}</div>
                  
                  <div>
                    <button className="text-[#5087A9] hover:text-[#3d6a87] underline decoration-1 underline-offset-2 flex items-center gap-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                      View Code
                    </button>
                  </div>

                  <div>
                    <button className="text-[#5087A9] hover:text-[#3d6a87] underline decoration-1 underline-offset-2 flex items-center gap-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                      Transcript
                    </button>
                  </div>
                  
                  <div>
                    <span className={`px-3 py-1 rounded-full border font-black text-sm ${getBadgeStyle(student.aiEval)}`}>
                      {student.aiEval}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}