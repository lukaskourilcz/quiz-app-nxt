import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("Missing GEMINI_API_KEY in environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req) {
  try {
    const { question } = await req.json();

    if (!question) {
      return NextResponse.json(
        { hint: "No question provided" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
Provide a short helpful hint for this quiz question.
Do not give the full answer, just a clue that helps recall the concept.

Question: ${question}

Respond in plain text only (1–2 sentences).
`;

    const result = await model.generateContent(prompt);

    if (!result?.response) {
      throw new Error("No response from Gemini API.");
    }

    let hint = result.response.text().trim();

    hint = hint.replace(/```/g, "").trim();

    return NextResponse.json({ hint });
  } catch (err) {
    console.error("Hint API error:", err);
    return NextResponse.json(
      { hint: "Error fetching hint." },
      { status: 500 }
    );
  }
}
