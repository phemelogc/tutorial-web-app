import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase"; 
import ModuleCard from "../components/moduleCard"; 
import "../styles/quizzes.css"
import "../styles/moduleCard.css"
import NavBar from "../components/AdminNav";

type Module = {
  id: string;
  title: string;
  description: string;
  department: string;
  videoUrl: string;
  quizAvailable: boolean; // Flag to determine if a quiz exists for the module
};

const QuizzesPage = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch modules from Firestore
    const fetchModules = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "modules"));
        const modulesData: Module[] = [];
        querySnapshot.forEach((doc) => {
          modulesData.push({
            id: doc.id,
            ...doc.data(),
            quizAvailable: doc.data().quizAvailable || false
          } as Module);
          
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

  const handleGenerateQuiz = (moduleId: string) => {
    
    console.log(`Generating quiz for module ID: ${moduleId}`);
    
  };

  return (
    <div className="quizzes-page-container">
        <NavBar/>
      <h1 className="page-header">Quizzes</h1>
      <p className="page-description">Select a module to generate a quiz or view its content.</p>

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
            
          />
          
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizzesPage;
