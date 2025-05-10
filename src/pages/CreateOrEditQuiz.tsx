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
  const [loading, setLoading] = useState(true);

  const [quiz, setQuiz] = useState<QuizData>({
    title: '',
    description: '',
    moduleCode: '',
    questions: []
  });

  useEffect(() => {
    const fetchExistingQuiz = async () => {
      if (!moduleId) {
        setLoading(false);
        return;
      }
      
      try {
        const docRef = doc(db, 'quizzes', moduleId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setQuiz(docSnap.data() as QuizData);
        }
      } catch (error) {
        console.error('Error fetching quiz:', error);
      } finally {
        setLoading(false);
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

  const handleRemoveQuestion = (index: number) => {
    const updated = [...quiz.questions];
    updated.splice(index, 1);
    setQuiz({ ...quiz, questions: updated });
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
    
    // Basic validation
    if (!quiz.title.trim()) {
      alert('Quiz title is required');
      return;
    }
    
    if (!quiz.moduleCode.trim()) {
      alert('Module code is required');
      return;
    }
    
    if (quiz.questions.length === 0) {
      alert('Please add at least one question');
      return;
    }
    
    // Check each question
    for (let i = 0; i < quiz.questions.length; i++) {
      const q = quiz.questions[i];
      
      if (!q.question.trim()) {
        alert(`Question ${i+1} text is required`);
        return;
      }
      
      // Check if all options have content
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].trim()) {
          alert(`Option ${j+1} for Question ${i+1} is required`);
          return;
        }
      }
      
      if (!q.correctAnswer) {
        alert(`Please select a correct answer for Question ${i+1}`);
        return;
      }
    }
    
    try {
      await setDoc(doc(db, 'quizzes', moduleId), quiz);
      alert('Quiz saved successfully!');
      navigate(`/quiz-preview/${moduleId}`);
    } catch (error) {
      console.error('Error saving quiz:', error);
      alert('Failed to save quiz. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="section-spinner-wrapper">
        <div className="section-spinner" />
      </div>
    );
  }

  return (
    <div className="container">
      <div className="quiz-create-container">
        <NavBar />
        <h2>{quiz.title ? 'Edit Quiz' : 'Create Quiz'}</h2>
        
        <div className="form-group">
          <label>Quiz Title</label>
          <input 
            value={quiz.title} 
            onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
            placeholder="Enter quiz title" 
          />
        </div>
        
        <div className="form-group">
          <label>Module Code</label>
          <input 
            value={quiz.moduleCode} 
            onChange={(e) => setQuiz({ ...quiz, moduleCode: e.target.value })}
            placeholder="Enter module code" 
          />
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea 
            value={quiz.description} 
            onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
            placeholder="Enter quiz description" 
          />
        </div>

        <h3>Questions</h3>
        {quiz.questions.length === 0 ? (
          <p>No questions added yet. Click the button below to add questions.</p>
        ) : (
          quiz.questions.map((q, i) => (
            <div key={i} className="question-block">
              <div className="question-title">Question {i + 1}</div>
              <input
                placeholder="Enter question text"
                value={q.question}
                onChange={(e) => handleQuestionChange(i, 'question', e.target.value)}
              />
              
              {q.options.map((opt, j) => (
                <div key={j} className="option-container">
                  <input
                    placeholder={`Option ${j + 1}`}
                    value={opt}
                    onChange={(e) => handleOptionChange(i, j, e.target.value)}
                  />
                </div>
              ))}
              
              <div className="correct-answer-select">
                <label>Correct Answer</label>
                <select
                  value={q.correctAnswer}
                  onChange={(e) => handleQuestionChange(i, 'correctAnswer', e.target.value)}
                >
                  <option value="">Select Correct Answer</option>
                  {q.options.map((opt, idx) => (
                    opt && <option key={idx} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              
              <button 
                className="remove-btn" 
                onClick={() => handleRemoveQuestion(i)}
              >
                Remove Question
              </button>
            </div>
          ))
        )}

        <div className="button-row">
          <button onClick={handleAddQuestion}>+ Add Question</button>
          <button onClick={handleSubmit}>Save Quiz</button>
        </div>
      </div>
    </div>
  );
};

export default CreateOrEditQuiz;