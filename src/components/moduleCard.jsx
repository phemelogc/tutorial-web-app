import "../styles/moduleCard.css";
import { auth, db } from "../firebase/firebase";
import { getDoc, doc } from "firebase/firestore";
import { enrollUserInModule } from "../firebase/enrolledModules";
import { useNavigate } from "react-router-dom";

export default function ModuleCard({
  title,
  department,
  description,
  admin = false,
  mode = "browse",
  moduleId,
 // onGenerate,
}) {
  const navigate = useNavigate();

  const handleEnroll = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return alert("you're not logged in!");

    if (!moduleId) return alert("error: module ID missing");

    try {
      const moduleSnap = await getDoc(doc(db, "modules", moduleId));
      if (!moduleSnap.exists()) throw new Error("Module not found");

      const fullModuleData = moduleSnap.data();
      console.log("Full module data:", fullModuleData);

      const result = await enrollUserInModule(userId, {
        ...fullModuleData,
        id: moduleId,
      });

      if (result.success) {
        alert("Enrolled successfully!");
        navigate("/enrolledModules");
      } else {
        alert("Enrollment failed: " + result.message);
      }
    } catch (err) {
      alert("Something went wrong: " + err.message);
    }
  };

  const handleViewModule = () => {
    if (!moduleId) return alert("module ID missing.");

    if (admin) {
      navigate(`/edit-module/${moduleId}`);
    } else {
      navigate(`/module/${moduleId}`);
    }
  };

  const handleTakeQuiz = () => {
    if (!moduleId) return alert("module ID missing.");
    navigate(`/quiz-attempt/${moduleId}`);
  };
  const handleGenerateQuiz = () => {
    if (!moduleId) return alert("module ID missing.");
    navigate(`/quiz-preview/${moduleId}`);
  }
  

  const renderButtons = () => {
    if (admin) {
      if (mode === "quiz") {
        return (
          <button className="module-btn quiz" onClick={handleGenerateQuiz}>
            Generate Quiz
          </button>
        );
      }

      return (
        <button className="module-btn enroll" onClick={() => navigate(`/edit-module/${moduleId}`)}>
          Edit
        </button>
      );
    }

    switch (mode) {
      case "enrolled":
        return (
          <>
            <button className="module-btn view" onClick={handleViewModule}>
              View
            </button>
            <button className="module-btn quiz" onClick={handleTakeQuiz}>
              Take Quiz
            </button>
          </>
        );
      case "quiz":
        return (
          <>
            <button className="module-btn quiz" onClick={handleTakeQuiz}>
              Generate Quiz
            </button>
            <button className="module-btn view" onClick={handleViewModule}>
              View Module
            </button>
          </>
        );
      default:
        return (
          <button className="module-btn enroll" onClick={handleEnroll}>
            Enroll
          </button>
        );
    }
  };

  return (
    <div className="module-card">
      <div className="module-card-title">
        <h3>{title}</h3>
        <span className="module-card-department">{department}</span>
      </div>
      <p className="module-card-description">{description}</p>
      <div className="module-card-actions">{renderButtons()}</div>
    </div>
  );
}
