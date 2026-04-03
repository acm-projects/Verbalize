import AdmZip from "adm-zip"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {

  const supabase = await createClient()

  const { zipPath, assignmentId } = await req.json()

  const { data, error } = await supabase
  .storage
  .from("AssignmentsBucket")
  .download(zipPath)

  if (!data) {
     throw new Error(error?.message || "Zip file not found")
  }

  const buffer = Buffer.from(await data.arrayBuffer())

  const zip = new AdmZip(buffer)

  const entries = zip.getEntries()

  for (const entry of entries) {
    if (entry.isDirectory) continue

  if (!entry.entryName.includes('/')) continue

  console.log("Processing file:", entry.entryName)

  // Now ONLY handle student zip files
  if (!entry.entryName.endsWith(".zip")) continue

  const studentZipBuffer = entry.getData()

  // Extract netID from filename
  const fileName = entry.entryName.split('/').pop()!
  const netID = fileName.replace(".zip", "")

  console.log("NetID:", netID)

    const { data: student, error } = await supabase
      .from("Students")
      .select("id")
      .eq("netID", netID)
      .maybeSingle()

    console.log("Student query result:", student)
    console.log("Student query error:", error)
    if (!student) { console.log("hi"); continue; }

    console.log(assignmentId)

    
    const { error: upsertError } = await supabase
  .from("Submissions")
  .upsert({
    student_id: student.id,
    assignment_id: assignmentId,
    student_submission: entry.entryName,
    submitted_at: new Date()
  })

if (upsertError) {
  console.error("Submission upsert failed:", upsertError)
}
  

  }


  return NextResponse.json({ success: true })
}
