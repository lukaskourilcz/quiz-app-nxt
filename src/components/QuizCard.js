"use client";
import { useState } from "react";

export default function QuizCard() {
  const [answer, setAnswer] = useState("");

  const question = {
    id: 1,
    text: "What are computed properties in React?",
    current: 1,
    total: 50,
    score: 0,
    maxScore: 0,
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User answer:", answer);
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span role="img" aria-label="brain">🧠</span> React & JS Quiz
        </h1>
        <p className="text-sm flex items-center gap-1">
          <span role="img" aria-label="ticket">🎟️</span>
          Score: {question.score} / {question.maxScore} pts
        </p>
      </div>

      <p className="font-semibold mb-2">
        Question {question.current} / {question.total}
      </p>
      <h2 className="text-lg font-medium mb-4">{question.text}</h2>

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
    </div>
  );
}
