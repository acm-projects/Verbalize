import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
import { createClient } from "@/lib/supabase/server";

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function POST(req: Request) {
  try {
    const { assignmentId } = await req.json();
    const supabase = await createClient();

    
    const { data: submissions, error: fetchError } = await supabase
      .from("Submissions")
      .select("id, student_id")
      .eq("assignment_id", assignmentId);

    if (fetchError || !submissions) throw new Error("Submissions not found");

    
    for (const sub of submissions) {
      const randomPin = Math.floor(1000 + Math.random() * 9000);

      
      await supabase
        .from("Submissions")
        .update({ pin_id: randomPin })
        .eq('id', sub.id);

      
      const msg = {
        to: 'rupeshsenthil17@gmail.com', 
        from: 'rupeshsenthil17@gmail.com', 
        subject: `PIN Code for Student ${sub.student_id}`,
        html: `
          <p>Hello,</p>
          <p>Your oral assessment is ready. Student <strong>${sub.student_id}</strong> 
          should use PIN: <strong>${randomPin}</strong></p>
        `,
      };
      
      await sgMail.send(msg);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Worker Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}