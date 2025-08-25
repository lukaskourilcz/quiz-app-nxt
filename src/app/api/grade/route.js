import { NextResponse } from "next/server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { question, userAnswer } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    Question: ${question}
    User Answer: ${userAnswer}
    
    Task:
    1. Score the user answer from 1 (bad) to 5 (excellent).
    2. Provide the correct/ideal answer in 1-2 sentences.
    
    Respond in JSON only with keys: "score" and "correctAnswer".
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    let output;
    try {
      output = JSON.parse(text);
    } catch {
      output = { score: 0, correctAnswer: "Error parsing Gemini response." };
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
