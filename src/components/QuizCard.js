"use client";
import { useState, useEffect } from "react";
import questions from "@/data/questions";

export default function QuizCard() {
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const [hint, setHint] = useState(null);
  const [loadingHint, setLoadingHint] = useState(false);

  useEffect(() => {
    setQuizQuestions(
      [...questions].sort(() => 0.5 - Math.random()).slice(0, 10)
    );
  }, []);

  const question = quizQuestions[current];

  let progress = ((current + 1) / quizQuestions.length) * 100;
  if (current === 0 && !feedback) {
    progress = 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback("Grading...");

    const res = await fetch("/api/grade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: question.text,
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
    setHint(null);
    setCurrent((prev) => prev + 1);
  };

  const handleRestart = () => {
    setQuizQuestions(getRandomQuestions(questions, 10));
    setCurrent(0);
    setAnswer("");
    setFeedback(null);
    setTotalScore(0);
  };

  const handleHint = async () => {
    setLoadingHint(true);
    const res = await fetch("/api/hint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: question.text }),
    });

    const data = await res.json();
    setHint(data.hint);
    setLoadingHint(false);
  };

  if (!question) {
    return (
      <div className="p-6 bg-white rounded-xl shadow w-full max-w-2xl text-center">
        <h1 className="text-2xl font-bold mb-4">Quiz Finished 🎉</h1>
        <p className="text-lg mb-4">Your total score: {totalScore}</p>
        <button
          onClick={handleRestart}
          className="mt-2 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
        >
          🔄 Try Another 10 Questions
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span role="img" aria-label="brain">
            🧠
          </span>
          React & JS Quiz (AI powered)
        </h1>
        <p className="text-sm flex items-center gap-1">
          <span role="img" aria-label="ticket">
            🎟️
          </span>
          Score: {totalScore}
        </p>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div
          className="bg-blue-500 h-3 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between mb-2">
        <p className="font-semibold">
          Question {current + 1} / {quizQuestions.length}
        </p>
        <button
          onClick={handleHint}
          className="flex items-center gap-1 text-yellow-600 hover:text-yellow-700 font-medium"
          disabled={loadingHint}
        >
          💡 {loadingHint ? "Loading..." : "Hint"}
        </button>
      </div>

      <h2 className="text-lg font-medium mb-4">{question.text}</h2>

      {hint && (
        <p className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-gray-800">
          {hint}
        </p>
      )}

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
        <div
          className={`mt-4 p-4 rounded-md ${
            feedback.score < 3
              ? "bg-red-200"
              : feedback.score === 3
              ? "bg-orange-200"
              : "bg-green-200"
          }`}
        >
          {" "}
          <p className="font-semibold">AI Score: {feedback.score}/5</p>
          <p className="mt-2 text-gray-700">
            <span className="font-bold">✅ Correct Answer:</span>{" "}
            {feedback.correctAnswer}
          </p>
          <button
            onClick={handleNext}
            className="mt-4 w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition"
          >
            Next Question →
          </button>
        </div>
      )}

      {feedback === "Grading..." && <p className="mt-4">⏳ Grading...</p>}
    </div>
  );
}
