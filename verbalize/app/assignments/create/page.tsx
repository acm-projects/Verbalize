'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'

export default function CreateAssignment() {
  const router = useRouter()
  const supabase = createClient()
  const params = useSearchParams();
  const courseId = params.get('courseId');
  
  const [assignmentName, setAssignmentName] = useState('')
  const [createdAssignmentId, setCreatedAssignmentId] = useState<string | null>(null)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [zipFile, setZipFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const extractText = async (file: File) => {
    const pdfjs = await import('pdfjs-dist')
    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise
    let text = ''
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      text += content.items.map((item: any) => item.str).join(' ') + '\n'
    }
    return text
  }

  const handleSaveName = async () => {
    if (!assignmentName || !courseId) return alert("Missing Info")
    const { data, error } = await supabase
      .from('Assignments')
      .insert({ assignment_name: assignmentName, course_id: courseId })
      .select().single()

    if (error) return alert(error.message)
    setCreatedAssignmentId(data.id)
  }

  const handleNotifyStudents = async () => {
    if (!createdAssignmentId) return alert("No assignment ID found!");
    
    setIsProcessing(true);
    try {
      const res = await fetch("/api/notify-students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignmentId: createdAssignmentId }), 
      });

      if (res.ok) {
        alert(" Emails sent successfully with student PINs!");
      } else {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to send emails");
      }
    } catch (e: any) {
      alert("Email Error: " + e.message);
    } finally {
      setIsProcessing(false);
    }
  }

  const handleUploadFiles = async () => {
    if (!pdfFile || !zipFile || !createdAssignmentId) return alert("Missing files!")
    setIsProcessing(true);
    try {
      const aiText = await extractText(pdfFile)
      const zipPath = `master_zips/${Date.now()}-${zipFile.name}`
      const pdfPath = `pdf_instruction/${Date.now()}-${pdfFile.name}`
      
      await supabase.storage.from("AssignmentsBucket").upload(zipPath, zipFile)
      await supabase.storage.from("AssignmentsBucket").upload(pdfPath, pdfFile)

      const { error } = await supabase
        .from('Assignments')
        .update({ instruction_text: aiText, submissions: zipPath })
        .eq('id', createdAssignmentId)

      if (error) throw error;

      // Process Submissions
      await fetch("/api/processSubmissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zipPath, assignmentId: createdAssignmentId })
      });

      // Generate AI Questions
      const aiResponse = await fetch("/api/generate-questions", {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          assignmentId: createdAssignmentId, 
          instructionText: aiText 
        }),
      });

      if (!aiResponse.ok) throw new Error("AI Question generation failed.");

      alert("Full Success! PDF stored, ZIP processed, and 20 Questions generated.");
    } catch (e: any) {
      alert(e.message)
    } finally {
      setIsProcessing(false);
    }
  }
  
  return (
    <div style={{ padding: '40px' }}>
      <h1>New Assignment (Course: {courseId})</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <input 
          placeholder="Assignment Name" 
          disabled={!!createdAssignmentId}
          onChange={(e) => setAssignmentName(e.target.value)} 
          style={{ color: 'black', padding: '5px' }}
        />
        {!createdAssignmentId && <button onClick={handleSaveName}>Save Name</button>}
      </div>

      {createdAssignmentId && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <p>Instructions (PDF): <input type="file" accept=".pdf" onChange={(e) => setPdfFile(e.target.files?.[0] || null)} /></p>
          <p>Master ZIP: <input type="file" accept=".zip" onChange={(e) => setZipFile(e.target.files?.[0] || null)} /></p>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={handleUploadFiles} 
              disabled={isProcessing}
              style={{ backgroundColor: 'blue', color: 'white', padding: '10px 20px' }}
            >
              {isProcessing ? "Processing..." : "Upload & Process"}
            </button>

          
            <button 
              onClick={handleNotifyStudents}
              disabled={isProcessing}
              style={{ backgroundColor: '#5b92b9', color: 'white', padding: '10px 20px' }}
            >
              Email PIN codes to Students
            </button>
          </div>
        </div>
      )}
    </div>
  )
}