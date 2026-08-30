import { NextResponse } from "next/server";
import { answerQuestion } from "@/lib/engine";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { question?: string };
    const question = body.question ?? "";
    return NextResponse.json(answerQuestion(question));
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
