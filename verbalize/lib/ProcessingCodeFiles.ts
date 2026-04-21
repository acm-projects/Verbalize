import JSZip from "jszip";
import { createClient } from "@/lib/supabase/server";

export async function processMasterZip(assignmentId: number, zipPath: string) {
    const supabase = await createClient();

    // 1. 下载老师传的总包
    const { data: zipBlob, error: dlError } = await supabase.storage
        .from("AssignmentsBucket")
        .download(zipPath);

    if (dlError || !zipBlob) throw new Error("Master ZIP not found");
    const masterZip = await JSZip.loadAsync(await zipBlob.arrayBuffer());

    // 2. 获取所有学生字典
    const { data: allStudents } = await supabase.from("Students").select("id, netID");
    if (!allStudents) throw new Error("No students found in database");

    const newSubmissions = [];
    const seenInThisBatch = new Set();

    // 3. 循环拆解总包
    for (const filePath of Object.keys(masterZip.files)) {
        const fileEntry = masterZip.files[filePath];

        // 过滤无关紧要的系统垃圾和外层文件夹
        if (fileEntry.dir || filePath.includes("__MACOSX") || !filePath.toLowerCase().endsWith(".zip")) {
            continue;
        }

        // 获取 NetID
        const fileName = filePath.split('/').pop() || "";
        const currentNetId = fileName.replace(".zip", "").toLowerCase();

        if (seenInThisBatch.has(currentNetId)) continue;

        const student = allStudents.find(s => s.netID?.toLowerCase() === currentNetId);
        if (!student) {
            console.log(`No student found in DB for netId: ${currentNetId}`);
            continue;
        }

        // 4. 关键点：进入学生的私人 ZIP 包
        const studentZipData = await fileEntry.async("arraybuffer");
        const innerZip = await JSZip.loadAsync(studentZipData);

        console.log(`🔍 Checking contents of ${currentNetId}.zip:`, Object.keys(innerZip.files));

        // 🌟 暴力的 "流氓搜索"：只要是代码后缀，不管嵌套在哪个文件夹，直接抓！
        const codeFileName = Object.keys(innerZip.files).find(f => {
            const fName = f.toLowerCase().trim();
            const isTargetFile = 
                   fName.endsWith(".java") || 
                   fName.endsWith(".py") ||
                   fName.endsWith(".h") || 
                   fName.endsWith(".cpp") || 
                   fName.endsWith(".c") || 
                   fName.endsWith(".js") || 
                   fName.endsWith(".ts") || 
                   fName.endsWith(".txt");
            
            // 必须满足：是目标后缀，不是 Mac 缓存，且它本身不是一个文件夹
            return isTargetFile && !f.includes("__MACOSX") && !innerZip.files[f].dir;
        });

        if (codeFileName) {
            // 🌟 最核心的一句：把代码文件转成纯文本字符串！
            const codeText = await innerZip.file(codeFileName)?.async("string");

            newSubmissions.push({
                assignment_id: assignmentId,
                student_id: student.id,
                code_text: codeText, // <=== AI 的弹药库！必须有这个！
                student_submission: filePath,
                submitted_at: new Date().toISOString()
            });

            seenInThisBatch.add(currentNetId);
            console.log(`✅ [SUCCESS] Extracted CODE for ${currentNetId} from ${codeFileName}`);
        } else {
            console.warn(`⚠️ [EMPTY] No code file found in ${currentNetId}.zip`);
        }
    }

    // 5. 批量写入数据库
    if (newSubmissions.length > 0) {
        console.log(`🚀 Ready to insert ${newSubmissions.length} submissions with CODE.`);
        const { error } = await supabase
            .from("Submissions")
            .upsert(newSubmissions, { onConflict: 'assignment_id, student_id' });

        if (error) throw error;
    }
}