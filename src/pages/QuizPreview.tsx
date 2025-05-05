import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/quizPreview.css"; // Style this as needed

const SAMPLE_QUESTIONS = [
  {
    question: "What is the purpose of a firewall?",
    options: ["To cook data", "To secure a network", "To print documents", "To backup files"],
    correct: "To secure a network",
  },
  {
    question: "Which language runs in a web browser?",
    options: ["Java", "C", "Python", "JavaScript"],
    correct: "JavaScript",
  },
  {
    question: "What does CPU stand for?",
    options: ["Central Processing Unit", "Computer Personal Unit", "Central Power Unit", "Computing Peripheral Unit"],
    correct: "Central Processing Unit",
  },
  // ... Add up to 30 dummy/sample questions
];

function getRandomQuestions(fullSet, count) {
  const shuffled = [...fullSet].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

const QuizPreview = () => {
  const { moduleId } = useParams();
  const [quizQuestions, setQuizQuestions] = useState<{ question: string; options: string[]; correct: string }[]>([]);

  useEffect(() => {
    const selected = getRandomQuestions(SAMPLE_QUESTIONS, 20);
    setQuizQuestions(selected);
  }, []);

  const handleSaveQuiz = () => {
    // Later: save to Firestore under a quizzes/{moduleId} doc
    console.log("Saving quiz for module:", moduleId);
    console.log("Questions:", quizQuestions);
    alert("Quiz saved (not really, just mocked 😎)");
  };

  return (
    <div className="quiz-preview-container">
      <h1>Quiz Preview</h1>
      <p>Module ID: {moduleId}</p>

      {quizQuestions.map((q, index) => (
        <div key={index} className="quiz-question-block">
          <h4>Q{index + 1}: {q.question}</h4>
          <ul className="quiz-options">
            {q.options.map((opt, i) => (
              <li key={i}>
                <input type="radio" name={`q${index}`} disabled />
                <label>{opt}</label>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <button onClick={handleSaveQuiz} className="save-quiz-btn">Save Quiz</button>
    </div>
  );
};

export default QuizPreview;
