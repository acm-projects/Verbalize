import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
import { createClient } from "@/lib/supabase/server";

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function POST(req: Request) {
  try {
    const { assignmentId } = await req.json();
    
    if (!assignmentId) {
      return NextResponse.json({ error: "Missing assignmentId" }, { status: 400 });
    }

    const supabase = await createClient();

  
    const { data: submissions, error: fetchError } = await supabase
      .from("Submissions")
      .select("id, student_id")
      .eq("assignment_id", assignmentId);

    if (fetchError || !submissions || submissions.length === 0) {
      throw new Error("No submissions found for this assignment");
    }

    let sentCount = 0;

    for (const sub of submissions) {
      if (!sub.student_id) continue;

     
      const { data: studentData, error: studentError } = await supabase
        .from("Students")
        .select("email, first_name, last_name")
        .eq("id", sub.student_id)
        .single(); 

      
      if (studentError || !studentData || !studentData.email) {
        console.warn(`Skipping student ${sub.student_id} due to missing email.`);
        continue;
      }

      
      const randomPin = Math.floor(1000 + Math.random() * 9000);

     
      await supabase
        .from("Submissions")
        .update({ pin_id: randomPin })
        .eq('id', sub.id);

      
      const msg = {
        to: studentData.email, 
        from: process.env.SENDGRID_SENDER_EMAIL || 'test@example.com', 
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