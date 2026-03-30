import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
import { createClient } from "@/lib/supabase/server";

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function POST(req: Request) {
  try {
    const { assignmentId } = await req.json();
    
    // 防御性编程：如果没有收到 ID，直接报错拦截
    if (!assignmentId) {
      return NextResponse.json({ error: "Missing assignmentId" }, { status: 400 });
    }

    const supabase = await createClient();

    // 1. 查找属于这个作业的所有提交记录 (也就是所有学生)
    const { data: submissions, error: fetchError } = await supabase
      .from("Submissions")
      .select("id, student_id")
      .eq("assignment_id", assignmentId);

    if (fetchError || !submissions || submissions.length === 0) {
      throw new Error("No submissions found for this assignment");
    }

    let sentCount = 0;

    // 2. 遍历每一个学生，生成 PIN 码并发邮件
    for (const sub of submissions) {
      if (!sub.student_id) continue;

      // 🔴 核心搬迁与升级：去 Students 表查这个学生的真实邮箱和名字！
      const { data: studentData, error: studentError } = await supabase
        .from("Students")
        .select("email, first_name, last_name")
        .eq("id", sub.student_id)
        .single(); // 我们确信一个 ID 对应一个学生

      // 如果查不到这个学生的邮箱，就跳过不发
      if (studentError || !studentData || !studentData.email) {
        console.warn(`Skipping student ${sub.student_id} due to missing email.`);
        continue;
      }

      // 生成随机 4 位 PIN 码
      const randomPin = Math.floor(1000 + Math.random() * 9000);

      // 将 PIN 码更新到数据库
      await supabase
        .from("Submissions")
        .update({ pin_id: randomPin })
        .eq('id', sub.id);

      // 构建邮件内容，使用真实的姓名和邮箱
      const msg = {
        to: studentData.email, // 🌟 真实的收件人邮箱！不再是 hardcode！
        from: 'noreply@verbalize.com', // 最好换成你们真正在 SendGrid 里验证过的发件域名
        subject: `Your Oral Assessment PIN Code`,
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>Hello ${studentData.first_name || 'Student'},</h2>
            <p>Your oral assessment is ready.</p>
            <p>Please use the following unique PIN code when prompted:</p>
            <h1 style="color: #5b92b9; letter-spacing: 2px;">${randomPin}</h1>
            <p>Good luck!</p>
          </div>
        `,
      };
      
      // 发送邮件
      await sgMail.send(msg);
      sentCount++;
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully sent emails to ${sentCount} students.` 
    });

  } catch (error: any) {
    console.error("Worker Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}