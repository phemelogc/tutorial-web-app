// src/pages/CreateOrEditQuiz.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import '../styles/createQuiz.css';
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

const CreateOrEditQuiz: React.FC = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<QuizData>({
    title: '',
    description: '',
    moduleCode: '',
    questions: []
  });

  useEffect(() => {
    const fetchExistingQuiz = async () => {
      if (!moduleId) return;
      const docRef = doc(db, 'quizzes', moduleId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setQuiz(docSnap.data() as QuizData);
      }
    };
    fetchExistingQuiz();
  }, [moduleId]);

  const handleAddQuestion = () => {
    setQuiz((prev) => ({
      ...prev,
      questions: [...prev.questions, { question: '', options: ['', '', '', ''], correctAnswer: '' }]
    }));
  };

  const handleQuestionChange = (index: number, field: string, value: string) => {
    const updated = [...quiz.questions];
    if (field === 'question') {
      updated[index].question = value;
    } else if (field === 'correctAnswer') {
      updated[index].correctAnswer = value;
    }
    setQuiz({ ...quiz, questions: updated });
  };

  const handleOptionChange = (qIndex: number, optIndex: number, value: string) => {
    const updated = [...quiz.questions];
    updated[qIndex].options[optIndex] = value;
    setQuiz({ ...quiz, questions: updated });
  };

  const handleSubmit = async () => {
    if (!moduleId) return alert('Module ID missing');
    try {
      await setDoc(doc(db, 'quizzes', moduleId), quiz);
      alert('Quiz saved successfully!');
      navigate(`/quiz-preview/${moduleId}`);
    } catch (error) {
      console.error('Error saving quiz:', error);
    }
  };

  return (
    <div className="quiz-create-container">
      <NavBar />
      <h2>{quiz.title ? 'Edit Quiz' : 'Create Quiz'}</h2>
      <div className="form-group">
        <label>Quiz Title</label>
        <input value={quiz.title} onChange={(e) => setQuiz({ ...quiz, title: e.target.value })} />
      </div>
      <div className="form-group">
        <label>Module Code</label>
        <input value={quiz.moduleCode} onChange={(e) => setQuiz({ ...quiz, moduleCode: e.target.value })} />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea value={quiz.description} onChange={(e) => setQuiz({ ...quiz, description: e.target.value })} />
      </div>

      <h3>Questions</h3>
      {quiz.questions.map((q, i) => (
        <div key={i} className="question-block">
          <input
            placeholder={`Question ${i + 1}`}
            value={q.question}
            onChange={(e) => handleQuestionChange(i, 'question', e.target.value)}
          />
          {q.options.map((opt, j) => (
            <input
              key={j}
              placeholder={`Option ${j + 1}`}
              value={opt}
              onChange={(e) => handleOptionChange(i, j, e.target.value)}
            />
          ))}
          <select
            value={q.correctAnswer}
            onChange={(e) => handleQuestionChange(i, 'correctAnswer', e.target.value)}
          >
            <option value="">Select Correct Answer</option>
            {q.options.map((opt, idx) => (
              <option key={idx} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      ))}

      <div className="button-row">
        <button onClick={handleAddQuestion}>+ Add Question</button>
        <button onClick={handleSubmit}>Save Quiz</button>
      </div>
    </div>
  );
};

export default CreateOrEditQuiz;
