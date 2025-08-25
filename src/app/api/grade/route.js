import { NextResponse } from "next/server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { question, userAnswer } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are a strict grader.

Question: ${question}
User Answer: ${userAnswer}

Task:
1. Score the user answer from 0 (bad) to 5 (excellent).
2. Provide the correct/ideal answer in 1–2 sentences.

Rules:
- Respond in *valid JSON only*
- No extra text, no explanations
- Format exactly like this:
{"score": 3, "correctAnswer": "Your correct answer here"}
`;

    const result = await model.generateContent(prompt);
    let text = result.response.text();

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let output;
    try {
      output = JSON.parse(text);
    } catch {
      output = {
        score: 0,
        correctAnswer: "Error parsing Gemini response: " + text,
      };
    }

    return NextResponse.json(output);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { score: 0, correctAnswer: "Server error" },
      { status: 500 }
    );
  }
}
