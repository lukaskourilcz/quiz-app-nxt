import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("Missing GEMINI_API_KEY in environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req) {
  try {
    const { question, userAnswer } = await req.json();

    if (!question || !userAnswer) {
      return NextResponse.json(
        { error: "Question and userAnswer are required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are a strict grader.

Question: ${question}
User Answer: ${userAnswer}

Task:
1. Score the user answer from 0 (bad) to 5 (excellent).
2. Provide the correct/ideal answer in 1–3 sentences.

Rules:
- Respond in *valid JSON only*
- No extra text, no explanations
- Format exactly like this:
{"score": 3, "correctAnswer": "Your correct answer here"}
`;

    const result = await model.generateContent(prompt);

    if (!result?.response) {
      throw new Error("No response from Gemini API.");
    }

    let text = result.response.text().trim();

    text = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let output;
    try {
      output = JSON.parse(text);
    } catch (parseErr) {
      console.error("Failed to parse Gemini response:", text);
      output = {
        score: 0,
        correctAnswer: "Error parsing Gemini response",
      };
    }

    return NextResponse.json(output);
  } catch (err) {
    console.error("Grade API error:", err);
    return NextResponse.json(
      { score: 0, correctAnswer: "Server error" },
      { status: 500 }
    );
  }
}
