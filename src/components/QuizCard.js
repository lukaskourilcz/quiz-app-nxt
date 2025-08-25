"use client";
import { useState } from "react";
import questions from "@/data/questions";

export default function QuizCard() {
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [totalScore, setTotalScore] = useState(0);

  const question = questions[current];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback("Grading...");

    const res = await fetch("/api/grade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: questions[current].text,
        userAnswer: answer,
      }),
    });

    const data = await res.json();
    setFeedback(data);
    setTotalScore((prev) => prev + (data.score || 0));
  };

  const handleNext = () => {
    setFeedback(null);
    setAnswer("");
    setCurrent((prev) => prev + 1);
  };

  if (!question) {
    return (
      <div className="p-6 bg-white rounded-xl shadow w-full max-w-2xl text-center">
        <h1 className="text-2xl font-bold mb-4">Quiz Finished 🎉</h1>
        <p className="text-lg">Your total score: {totalScore}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span role="img" aria-label="brain">
            🧠
          </span>{" "}
          React & JS Quiz (AI powered)
        </h1>
        <p className="text-sm flex items-center gap-1">
          <span role="img" aria-label="ticket">
            🎟️
          </span>
          Score: {totalScore}
        </p>
      </div>

      <p className="font-semibold mb-2">
        Question {current + 1} / {questions.length}
      </p>
      <h2 className="text-lg font-medium mb-4">{question.text}</h2>

      {!feedback && (
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full p-3 border rounded-md mb-4 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            rows={4}
            placeholder="Type your answer here..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </form>
      )}

      {feedback && typeof feedback === "object" && (
        <div className="mt-4">
          <p className="font-semibold">AI Score: {feedback.score}/5</p>
          <p className="mt-2 text-gray-700">
            ✅ Correct Answer: {feedback.correctAnswer}
          </p>
          <button
            onClick={handleNext}
            className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition"
          >
            Next Question →
          </button>
        </div>
      )}

      {feedback === "Grading..." && <p className="mt-4">⏳ Grading...</p>}
    </div>
  );
}
