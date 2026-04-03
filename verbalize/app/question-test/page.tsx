// "use client";
// import React, { useState } from 'react';

// export default function NotifyTestPage() {
//   const [asgnId, setAsgnId] = useState("50");
//   const [stId, setStId] = useState("142"); 

//   const handleGenerateAISpecific = async () => {
//     const res = await fetch("/api/generate-student-questions", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ 
//         assignmentId: parseInt(asgnId), 
//         studentId: stId 
//       }),
//     });

//     const data = await res.json();
//     if (res.ok) {
//       alert(" AI Questions Generated!\n\n" + JSON.stringify(data.questions, null, 2));
//     } else {
//       alert(" Error: " + data.error);
//     }
//   };

//   return (
//     <div style={{ padding: '20px' }}>
//       <h2>AI Student-Specific Test</h2>
//       <input type="number" placeholder="Assignment ID" value={asgnId} onChange={(e)=>setAsgnId(e.target.value)} />
//       <input type="text" placeholder="Student NetID" value={stId} onChange={(e)=>setStId(e.target.value)} />
//       <button onClick={handleGenerateAISpecific}>Generate 2 Questions</button>
//     </div>
//   );
// }