import { processMasterZip } from "@/lib/ProcessingCodeFiles";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { zipPath, assignmentId } = await req.json();

  try {
    // 调用分离出去的核心解压逻辑
    await processMasterZip(assignmentId, zipPath);
    return NextResponse.json({ message: "Processed successfully" });
  } catch (error: any) {
    console.error("DETAILED_ERROR:", error); 
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}