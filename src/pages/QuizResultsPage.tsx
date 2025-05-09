// Phemelo Gaborone
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/quizPreview.css";

export default function QuizResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { quizTitle, quizData, answers } = location.state || {};

  if (!quizData || !answers) {
    return <div className="error-message">No quiz data found.</div>;
  }

  const total = quizData.length;
  const score = quizData.reduce((acc: number, q: any, idx: number) => {
    return acc + (answers[idx] === q.correctAnswer ? 1 : 0);
  }, 0);

  const percentage = Math.round((score / total) * 100);

  return (
    <div className="quiz-preview-container">
      <div className="quiz-header">
        <h2>{quizTitle} — Results</h2>
        <p className="quiz-description">You scored {score}/{total} ({percentage}%)</p>
      </div>

      {quizData.map((q: any, idx: number) => (
        <div className="quiz-question-block" key={idx}>
          <h3>{q.questionText}</h3>
          <ul className="quiz-options">
            {q.options.map((opt: string, i: number) => (
              <li key={i} style={{ color: getOptionColor(opt, q.correctAnswer, answers[idx]) }}>
                {opt}
                {opt === q.correctAnswer && " ✅"}
                {opt === answers[idx] && opt !== q.correctAnswer && " ❌"}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="button-row">
        <button className="save-quiz-btn" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

function getOptionColor(option: string, correct: string, userAnswer: string) {
  if (option === correct) return "#00ff95";
  if (option === userAnswer) return "#ff7675";
  return "#ccc";
}
