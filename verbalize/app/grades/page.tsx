"use client";
import { useState } from 'react';
import ClassroomHeader from '../addassignmentPublic';
import DashboardSidebar from '../dashboard/dashboardSidebar'; 

// Mock grades data
const gradesData = [
  {
    id: 1, lastName: "nguyen", firstName: "nguyen", netId: "abc123", assignment: "assignment1", callStatus: "Completed", grade: "100",
    details: [{ id: 'd1', color: 'yellow' }, { id: 'd2', color: 'green' }, { id: 'd3', color: 'red' }, { id: 'd4', color: 'green' }]
  },
  {
    id: 2, lastName: "smith", firstName: "john", netId: "js456", assignment: "assignment1", callStatus: "Pending", grade: "0",
    details: [{ id: 'd5', color: 'blue' }, { id: 'd6', color: 'blue' }]
  }
];

// Student row component
function StudentRow({ student }: { student: any }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const getGlowStyle = (color: string) => {
    switch (color) {
      case 'yellow': return 'border-[#FFE587] shadow-[0_0_10px_rgba(255,229,135,0.4)]';
      case 'green': return 'border-[#8DFFB1] shadow-[0_0_10px_rgba(141,255,177,0.4)]';
      case 'red': return 'border-[#FF8A8A] shadow-[0_0_10px_rgba(255,138,138,0.4)]';
      case 'blue': return 'border-[#86D7FF] shadow-[0_0_10px_rgba(134,215,255,0.4)]';
      default: return 'border-gray-200';
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center gap-4">
        <button onClick={() => setIsExpanded(!isExpanded)} className="w-6 h-6 bg-[#5087A9] rounded flex items-center justify-center text-white text-xs shadow-md hover:bg-[#3d6a87] transition-colors">
          {isExpanded ? '▼' : '▶'}
        </button>
        <div className="flex-1 bg-white border-2 border-[#86D7FF] shadow-[0_0_12px_rgba(134,215,255,0.4)] rounded-lg p-3 grid grid-cols-6 items-center font-bold text-sm">
          <div>{student.lastName}</div>
          <div>{student.firstName}</div>
          <div className="text-gray-500 font-medium">{student.netId}</div>
          <div className="text-[#5087A9]">{student.assignment}</div>
          <div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${student.callStatus === 'Completed' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-yellow-50 text-yellow-600 border-yellow-200'}`}>
              {student.callStatus}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xl font-black text-[#1E293B]">{student.grade}</span>
            <button className="text-gray-300 hover:text-[#5087A9] transition-colors p-1">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className={`grid transition-all duration-300 ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="pl-10 flex flex-col gap-2">
            {student.details.map((detail: any) => (
              <div key={detail.id} className={`bg-white border-2 rounded-lg p-3 h-10 w-full ${getGlowStyle(detail.color)}`}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GradesPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden">
      

      {/* 2. Right content area: pushed 300px */}
      <div className="flex-1 flex flex-col relative min-h-screen">
        
        {/* Top Header */}
        <ClassroomHeader activePage="grades" />

        {/* 3. Main content: Use the modified left-aligned width ratio */}
        <main className="max-w flex flex-col items-center py-10 pl-20 pr-20">
          <div className="bg-[#EAEAEA] rounded-t-xl p-6 grid grid-cols-6 font-extrabold text-[#1E293B] mb-8 shadow-sm ml-10 text-sm">
            <div>Last Name</div>
            <div>First Name</div>
            <div>Net ID</div>
            <div>Assignments</div>
            <div>Call Status</div>
            <div>AVG Grade</div>
          </div>

          <div className="flex flex-col">
            {gradesData.map((student) => (
              <StudentRow key={student.id} student={student} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}