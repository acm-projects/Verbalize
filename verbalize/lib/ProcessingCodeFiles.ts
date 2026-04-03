import JSZip from "jszip";
import { createClient } from "@/lib/supabase/server";

export async function processMasterZip(assignmentId: number, zipPath: string) {
    const supabase = await createClient();

    //Download Master ZIP
    const { data: zipBlob, error: dlError } = await supabase.storage
        .from("AssignmentsBucket")
        .download(zipPath);

    if (dlError || !zipBlob) throw new Error("Master ZIP not found");
    const masterZip = await JSZip.loadAsync(await zipBlob.arrayBuffer());

    //Get all students in the system
    const { data: allStudents } = await supabase
        .from("Students")
        .select("id, netID");

    if (!allStudents) throw new Error("No students found in database");

    //Prepare the new submission rows
    const newSubmissions = [];

    //Use a Set to track NetIDs we've already processed in this batch
    const seenInThisBatch = new Set();

    for (const filePath of Object.keys(masterZip.files)) {
        const fileEntry = masterZip.files[filePath];

        //SKIP directories, hidden metadata, and non-zip files
        if (fileEntry.dir || !filePath.toLowerCase().endsWith(".zip") || filePath.includes("__MACOSX")) {
            continue;
        }

        //Extract netId strictly from the current filePath
        const fileName = filePath.split('/').pop() || "";
        const currentNetId = fileName.replace(".zip", "").toLowerCase();

        //Prevent processing the same student twice if there are duplicate files
        if (seenInThisBatch.has(currentNetId)) {
            console.log(`Skipping duplicate file for ${currentNetId} at ${filePath}`);
            continue;
        }

        //Find the matching student record
        const student = allStudents.find(s => s.netID.toLowerCase() === currentNetId);
        if (!student) {
            console.log(`No student found in DB for netId: ${currentNetId}`);
            continue;
        }

        //Extract inner ZIP content
        const studentZipData = await fileEntry.async("arraybuffer");
        const innerZip = await JSZip.loadAsync(studentZipData);

        const codeFileName = Object.keys(innerZip.files).find(f =>
            (f.toLowerCase().endsWith(".java")
                || f.toLowerCase().endsWith(".py")
                || f.toLowerCase().endsWith(".cpp")
                || f.toLowerCase().endsWith(".h")
                || f.toLowerCase().endsWith(".txt"))
            && !f.includes("__MACOSX")
        );

        if (codeFileName) {
            const codeText = await innerZip.file(codeFileName)?.async("string");

            newSubmissions.push({
                assignment_id: assignmentId,
                student_id: student.id, //Make sure this matches the found student's ID
                code_text: codeText,
                student_submission: filePath,
                submitted_at: new Date().toISOString()
            });

            seenInThisBatch.add(currentNetId);
            console.log(`Successfully queued ${currentNetId} from ${filePath}`);
        }
    }

    //Final Batch Insert
    if (newSubmissions.length > 0) {
        //Use upsert to handle cases where a row might already exist

        console.log("FINAL submissions payload:", newSubmissions);

        const { error } = await supabase
            .from("Submissions")
            .upsert(newSubmissions, { onConflict: 'assignment_id, student_id' });

        if (error) throw error;
    }
}