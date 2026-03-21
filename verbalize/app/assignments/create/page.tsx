'use client'


import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'


export default function CreateAssignment() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = createClient()
  
  const courseId = searchParams.get('courseId') 

  const [assignmentName, setAssignmentName] = useState('')
  const [createdAssignmentId, setCreatedAssignmentId] = useState<string | null>(null)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [zipFile, setZipFile] = useState<File | null>(null)
  

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

  // Name First
  const handleSaveName = async () => {
    if (!assignmentName || !courseId) return alert("Missing Info")

    const { data, error } = await supabase
      .from('Assignments')
      .insert({assignment_name : assignmentName, course_id: courseId})
      .select().single()

    if (error) return alert(error.message)
    setCreatedAssignmentId(data.id)
  }

  // STEP 2 :The Files
  const handleUploadFiles = async () => {
    if (!pdfFile || !zipFile || !createdAssignmentId) return alert("Missing files!")

    try {
      const aiText = await extractText(pdfFile)
      const zipPath = `master_zips/${Date.now()}-${zipFile.name}`
      const pdfPath = `pdf_instruction/${Date.now()}-${pdfFile.name}`
      await supabase.storage.from("AssignmentsBucket").upload(zipPath, zipFile)
      await supabase.storage.from("AssignmentsBucket").upload(pdfPath,pdfFile)

      const { error } = await supabase
        .from('Assignments')
        .update({ instruction_text: aiText, submissions: zipPath })
        .eq('id', createdAssignmentId)

      if (error) throw error
      alert("Upload complete! Staying here for now.");
      const aiResponse = await fetch("/api/generate-questions", {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          assignmentId: createdAssignmentId, 
          instructionText: aiText 
        }),
      });

      if (!aiResponse.ok) throw new Error("AI Question generation failed.");

      alert("Full Success! PDF stored, ZIP uploaded, and 20 AI questions generated.");
    } catch (e: any) {
      alert(e.message)
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
        <div>
          <p>Instructions (PDF): <input type="file" accept=".pdf" onChange={(e) => setPdfFile(e.target.files?.[0] || null)} /></p>
          <p>Master ZIP: <input type="file" accept=".zip" onChange={(e) => setZipFile(e.target.files?.[0] || null)} /></p>
          <button onClick={handleUploadFiles} style={{ backgroundColor: 'blue', color: 'white' }}>Upload & Process</button>
        </div>
      )}
    </div>
  )
}