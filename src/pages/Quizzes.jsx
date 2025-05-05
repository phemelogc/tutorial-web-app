import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase"; 
import ModuleCard from "../components/ModuleCard"; 
import "../styles/quizzes.css";
import "../styles/moduleCard.css";
import NavBar from "../components/AdminNav";

const QuizzesPage = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "modules"));
        const modulesData = [];
        querySnapshot.forEach((doc) => {
          modulesData.push({
            id: doc.id,
            ...doc.data(),
            quizAvailable: doc.data().quizAvailable || false
          });
        });
        setModules(modulesData);
      } catch (error) {
        console.error("Error fetching modules:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  const handleGenerateQuiz = (moduleId) => {
    navigate(`/quiz-preview/${moduleId}`);
  };

  return (
    <div className="quizzes-page-container">
      <NavBar />
      <h1 className="page-header">Quizzes</h1>
      <p className="page-description">
        Select a module to generate a quiz or view its content.
      </p>

      {loading ? (
        <p>Loading modules...</p>
      ) : (
        <div className="modules-list">
          {modules.map((module) => (
            <ModuleCard
              key={module.id}
              title={module.title}
              department={module.department}
              description={module.description}
              moduleId={module.id}
              admin={true}
              mode="quiz"
              onGenerate={handleGenerateQuiz}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizzesPage;
