import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { course_name, section_num, student_info } = body;

    const { data, error } = await supabase
      .from("Course_Details")
      .insert({
        course_name: course_name,
        section_num: section_num,
        student_info: student_info,
        professor_id: user.id,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
   console.error(error);

  return NextResponse.json(
    { error: "Failed to create course", details: String(error) },
    { status: 500 }
  );
}
}