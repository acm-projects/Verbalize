// "use client";
// import React, { useState } from 'react';

// export default function NotifyTestPage() {
//   const [targetId, setTargetId] = useState("37");

//   const handleNotifyStudents = async () => {
//     await fetch("/api/notify-students", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ assignmentId: parseInt(targetId) }),
//     });
//     alert("Process triggered. Check Supabase and Email.");
//   };

//   return (
//     <div style={{ padding: '20px' }}>
//       <h2>Test PIN & Email System</h2>
//       <input 
//         type="number" 
//         value={targetId} 
//         onChange={(e) => setTargetId(e.target.value)} 
//       />
//       <button onClick={handleNotifyStudents}>Send Now</button>
//     </div>
//   );
// }