import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase'; // Update path if needed
import '../styles/quizPreview.css';
import NavBar from '../components/AdminNav';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizData {
  title: string;
  description: string;
  moduleCode: string;
  questions: QuizQuestion[];
}

const QuizPreview: React.FC = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const docRef = doc(db, 'quizzes', moduleId as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setQuiz(docSnap.data() as QuizData);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching quiz:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (moduleId) fetchQuiz();
  }, [moduleId]);

  const handleEdit = () => navigate(`/create-quiz/${moduleId}`);
 // const handleEdit = () => navigate(`/CreateOrEditQuiz`);


  const handleSubmit = () => alert('Quiz published successfully!');

  if (loading) {
    return (
      <div className="section-spinner-wrapper">
        <div className="section-spinner" />
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="quiz-preview-container">
        <NavBar />
        <div className="quiz-header">
          <h2>Quiz Preview</h2>
          <p>Module ID: <strong>{moduleId}</strong></p>
        </div>
        <div className="quiz-info">
          <p className="error-message">No quiz found for this module.</p>
          <button className="save-quiz-btn" onClick={handleEdit}>
            Create/Edit Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-preview-container">
      <NavBar />
      <div className="quiz-header">
        <h2>Quiz Preview</h2>
        <p>Module ID: <strong>{moduleId}</strong></p>
      </div>

      <div className="quiz-info">
        <p><strong>Quiz Title:</strong> {quiz.title}</p>
        <p><strong>Module Code:</strong> {quiz.moduleCode}</p>
        <p><strong>Description:</strong></p>
        <p className="quiz-description">{quiz.description}</p>
      </div>

      <div className="quiz-question-list">
        {quiz.questions.length > 0 ? (
          quiz.questions.map((q, index) => (
            <div key={index} className="quiz-question-block">
              <h4>Q{index + 1}: {q.question}</h4>
              <ul className="quiz-options">
                {q.options.map((opt, i) => (
                  <li key={i}>
                    <label>
                      <input
                        type="radio"
                        name={`q${index}`}
                        disabled
                        checked={opt === q.correctAnswer}
                        readOnly
                      />
                      {opt}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p>No questions added yet.</p>
        )}
      </div>

      <div className="button-row">
        <button className="save-quiz-btn" onClick={handleEdit}>Edit Quiz</button>
        <button className="save-quiz-btn" onClick={handleSubmit}>Publish Quiz</button>
      </div>
    </div>
  );
};

export default QuizPreview;
