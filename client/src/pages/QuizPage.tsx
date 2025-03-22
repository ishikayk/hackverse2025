import React, { useState } from "react";

interface QuizQuestion {
  id: number;
  type: "text" | "checkbox";
  question: string;
  options?: string[]; // Only for checkbox type
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    type: "text",
    question: "What is the capital of France?",
  },
  {
    id: 2,
    type: "checkbox",
    question: "Which of the following are programming languages?",
    options: ["JavaScript", "HTML", "CSS", "Python"],
  },
  {
    id: 3,
    type: "checkbox",
    question: "A sample MCQ",
    options: ["JavaScript", "HTML", "CSS", "Python"],
  },
  {
    id: 4,
    type: "text",
    question: "fill something into this",
  },
];

const Quiz: React.FC = () => {
  const [answers, setAnswers] = useState<{ [key: number]: string | string[] }>({});

  const handleTextChange = (id: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (id: number, option: string) => {
    setAnswers((prev) => {
      const currentAnswers = prev[id] || [];
      const updatedAnswers = Array.isArray(currentAnswers)
        ? currentAnswers.includes(option)
          ? currentAnswers.filter((item) => item !== option) // Uncheck
          : [...currentAnswers, option] // Check
        : [option];
      return { ...prev, [id]: updatedAnswers };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("User Answers:", answers);
    alert("Quiz submitted! Check the console for answers.");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 w-2xl">
      <form onSubmit={handleSubmit} className="mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Answer all questions to the best of your Ability</h1>
        {quizQuestions.map((question) => (
          <div key={question.id} className="mb-6">
            <p className="text-lg font-semibold mb-2">{question.question}</p>
            {question.type === "text" && (
              <input
                type="text"
                value={(answers[question.id] as string) || ""}
                onChange={(e) => handleTextChange(question.id, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your answer here..."
              />
            )}
            {question.type === "checkbox" && (
              <div className="space-y-2">
                {question.options?.map((option) => (
                  <label key={option} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={(answers[question.id] as string[])?.includes(option) || false}
                      onChange={() => handleCheckboxChange(question.id, option)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit Quiz
        </button>
      </form>
    </div>
  );
};

export default Quiz;