import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ethers, Contract } from "ethers"; // Import Contract type
import NFTCertificate from "../../NFTCertificate.json";

const CONTRACT_ADDRESS = "0x737489CcFC57bC25391Ea1CA1c830388C1320267";

interface QuizQuestion {
  id: number;
  question: string;
}

interface ExpAns {
  id: number;
  answer: string;
}

interface UserAns {
  id: number;
  answer: string;
}

interface Roadmap {
  id: number;
  title: string;
  resources: {
    id: string;
    title: string;
    type: string;
    duration: string;
    icon: null;
  }[];
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

const Quiz: React.FC = () => {
  const location = useLocation();
  const roadmap = location.state?.roadmapData as Roadmap[] || [];

  const [status, setStatus] = useState(""); 
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [expectedAns, setExpectedAns] = useState<ExpAns[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState<{ score: number; feedback: string[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contract, setContract] = useState<Contract | null>(null); 

  // Initialize contract
  useEffect(() => {
    if (!window.ethereum) {
      setStatus("MetaMask is not installed.");
      return;
    }

    const initContract = async () => {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, NFTCertificate.abi, signer);
        setContract(contractInstance);
      } catch (error) {
        console.error("Contract Initialization Failed:", error);
        setStatus("Failed to connect to the contract.");
      }
    };
    
    initContract();
  }, []);

  // Fetch quiz questions
  useEffect(() => {
    if (!roadmap) {
      setError("Roadmap not provided. Please go back and try again.");
      setIsLoading(false);
      return;
    }

    fetch("http://localhost:8080/generate-quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roadmap }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setIsLoading(false);
          return;
        }

        const { questions, answers } = data.result || {};
        if (!questions || !Array.isArray(questions) || !answers || !Array.isArray(answers)) {
          setError("Invalid data format received from the server.");
          setIsLoading(false);
          return;
        }

        setQuizQuestions(questions.map((q: string, index: number) => ({ id: index + 1, question: q })) || []);
        setExpectedAns(answers.map((a: string, index: number) => ({ id: index + 1, answer: a })) || []);
        setTimeLeft(questions.length * 2 * 60); 
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setError("Failed to fetch questions. Please try again later.");
        setIsLoading(false);
      });
  }, [roadmap]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  // Handle input change
  const handleTextChange = (id: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  // Handle quiz submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentQuestionIndex < quizQuestions.length - 1) {
      // Move to the next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Submit the quiz
      const userAnswers: UserAns[] = Object.keys(answers).map((key) => ({
        id: parseInt(key),
        answer: answers[parseInt(key)],
      }));

      const payload = {
        expected: expectedAns,
        user: userAnswers,
      };

      try {
        const response = await fetch("http://localhost:8080/check-answers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Failed to submit quiz");
        }

        const resultData = await response.json();
        setResult(resultData.result);
        if (resultData.result.score >= 10) {
          mintNFT();
        }
      } catch (error) {
        console.error("Submission error:", error);
        setError("An error occurred while submitting the quiz.");
      }
    }
  };

  // Mint NFT
  async function mintNFT() {
    if (!contract) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner(); 
      const recipient = await signer.getAddress(); 
      const tokenURI = "ipfs://bafkreifsu7lwxu4o2mwdns6t6ci327slciq3rr3fptak46yzqeuywmz45e";
      const courseId = Math.floor(10000 + Math.random() * 90000).toString();

      const transaction = await contract.mintCertificate(recipient, tokenURI, courseId);
      await transaction.wait();

      setStatus(`Certificate Minted! Transaction: ${transaction.hash}`);
    } catch (error: any) {
      console.error("Minting error:", error);
      setStatus(`Error: ${error.message || "Minting failed"}`);
    }
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen w-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold text-red-600">Error</h2>
          <p className="mt-2 text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen w-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold text-blue-600">Loading...</h2>
          <p className="mt-2 text-gray-700">Please wait while we load the quiz questions.</p>
        </div>
      </div>
    );
  }

  // Render result state
  if (result) {
    return (
      <div className="min-h-screen w-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold text-green-600">Quiz Submitted!</h2>
          <p className="mt-2 text-gray-700">Your Score: {result.score}</p>
          {result.feedback && Array.isArray(result.feedback) && result.feedback.length > 0 ? (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Feedback:</h3>
              <ul className="list-disc list-inside">
                {result.feedback.map((fb, index) => (
                  <li key={index} className="mt-2 text-gray-700">{fb}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-4 text-gray-700">No feedback available.</p>
          )}

          {status && <p className="mt-4 text-lg font-bold text-blue-600">{status}</p>}
        </div>
      </div>
    );
  }

  // Render quiz questions
  const currentQuestion = quizQuestions[currentQuestionIndex];

  return (
    <div className="min-h-screen w-screen bg-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Answer all questions to the best of your Ability</h1>
        <div className="text-center mb-4">
          <p className="text-xl font-semibold text-red-500">Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}</p>
        </div>

        <div className="bg-white mt-32 p-6 rounded-lg shadow-md">
          <p className="text-xl font-semibold mb-6">{currentQuestion.question}</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <input
                type="text"
                value={answers[currentQuestion.id] || ""}
                onChange={(e) => handleTextChange(currentQuestion.id, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your answer here..."
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 w-full text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {currentQuestionIndex < quizQuestions.length - 1 ? "Next Question" : "Finish Test"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Quiz;