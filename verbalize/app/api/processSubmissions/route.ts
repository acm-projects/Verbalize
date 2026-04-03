import { processMasterZip } from "@/lib/ProcessingCodeFiles";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { zipPath, assignmentId } = await req.json();

  try {
    // In your route handler
try {
  await processMasterZip(assignmentId, zipPath);
  return NextResponse.json({ message: "Processed successfully" });
} catch (error: any) {
  console.error("DETAILED_ERROR:", error); // Check your terminal logs for this!
  return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
}

    return NextResponse.json({ message: "Processed successfully" });
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}