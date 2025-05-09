// Phemelo gaborone
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "../styles/quizPreview.css";

export default function QuizAttemptPage() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  interface Question {
    questionText: string;
    options: string[];
  }

  const [quizData, setQuizData] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(30);
  const [quizTitle, setQuizTitle] = useState("");

  useEffect(() => {
    async function fetchQuiz() {
      const quizRef = doc(db, "quizzes", moduleId!);
      const snapshot = await getDoc(quizRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        setQuizTitle(data.title || "Quiz");
        setQuizData(data.questions || []);
      }
      setLoading(false);
    }

    fetchQuiz();
  }, [moduleId]);

  useEffect(() => {
    if (!quizData.length) return;
    if (timer === 0) {
      handleNext();
      return;
    }

    const countdown = setTimeout(() => setTimer((prev) => prev - 1), 1000);
    return () => clearTimeout(countdown);
  }, [timer, currentIndex, quizData]);

  const handleSelect = (selectedOption: string) => {
    setAnswers({ ...answers, [currentIndex]: selectedOption });
  };

  const handleNext = () => {
    if (currentIndex < quizData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setTimer(30);
    } else {
      handleFinish();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setTimer(30);
    }
  };

  const handleFinish = async () => {
    if (!currentUser) {
      alert("You must be logged in to submit a quiz.");
      return;
    }

    const score = Object.keys(answers).length;
    const total = quizData.length;
    const percent = Math.round((score / total) * 100);

    await setDoc(
      doc(db, "quizProgress", currentUser.uid),
      {
        [moduleId!]: {
          score,
          total,
          percent,
          completedAt: new Date()
        }
      },
      { merge: true }
    );

    navigate("/quiz-results", {
      state: {
        quizTitle,
        quizData,
        answers,
      },
    });
  };

  if (loading) {
    return (
      <div className="section-spinner-wrapper">
        Loading...
      </div>
    );
  }

  const currentQuestion = quizData[currentIndex];
  const progress = ((currentIndex + 1) / quizData.length) * 100;

  return (
    <div className="quiz-preview-container">
      <div className="quiz-header">
        <h2>{quizTitle} — Attempt</h2>
        <p className="quiz-description">Module ID: {moduleId}</p>
      </div>

      <div className="quiz-info">
        <p>Question {currentIndex + 1} of {quizData.length}</p>
        <p>Time Left: <strong>{timer}s</strong></p>
        <div style={{ background: "#444", height: "8px", borderRadius: "4px" }}>
          <div
            style={{
              background: "#00cec9",
              height: "100%",
              width: `${progress}%`,
              borderRadius: "4px",
              transition: "width 0.3s ease"
            }}
          />
        </div>
      </div>

      <div className="quiz-question-block">
        <h3>{currentQuestion.questionText}</h3>
        <ul className="quiz-options">
          {currentQuestion.options.map((opt: string, idx: number) => (
            <li key={idx}>
              <label>
                <input
                  type="radio"
                  name="option"
                  value={opt}
                  checked={answers[currentIndex] === opt}
                  onChange={() => handleSelect(opt)}
                />
                {opt}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="button-row">
        <button className="save-quiz-btn" onClick={handlePrevious} disabled={currentIndex === 0}>
          Previous
        </button>
        {currentIndex < quizData.length - 1 ? (
          <button className="save-quiz-btn" onClick={handleNext}>
            Next
          </button>
        ) : (
          <button className="save-quiz-btn" onClick={handleFinish}>
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  );
}
