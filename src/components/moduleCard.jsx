import "../styles/moduleCard.css";
import { auth, db } from "../firebase/firebase";
import { enrollUserInModule } from "../firebase/enrolledModules";
import { useNavigate } from "react-router-dom";
import { doc, deleteDoc } from "firebase/firestore";

export default function ModuleCard({
  title,
  department,
  description,
  admin = false,
  mode = "browse",
  moduleId,
}) {
  const navigate = useNavigate();

  const handleEnroll = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return alert("you're not logged in!");

    if (!moduleId) return alert("error: module ID missing");

    const result = await enrollUserInModule(userId, {
      title,
      department,
      description,
      id: moduleId,
    });

    if (result.success) {
      alert("Enrolled successfully!");
      navigate("/enrolledModules");
    } else {
      alert("Enrollment failed: " + result.message);
    }
  };

  const handleViewModule = () => {
    if (!moduleId) return alert("module ID missing.");

    if(admin){
      navigate(`/edit-module/${moduleId}`);
    } else{
      navigate(`/module/${moduleId}`);
    }
  };

  const handleTakeQuiz = () => {
    if (!moduleId) return alert("module ID missing.");
    navigate(`/quiz/${moduleId}`);
  };

  const handleDelete = async () => {
    if (!moduleId) return alert("module ID missing.");

    const confirmed = window.confirm(
      `are you sure you want to delete "${title}"? this can’t be undone.`
    );
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "modules", moduleId));
      alert("module deleted successfully!");
      window.location.reload();
    } catch (err) {
      console.error("delete failed:", err);
      alert("error deleting module: " + err.message);
    }
  };

  const renderButtons = () => {
    if (admin) {
      return (
        <>
          <button className="module-btn enroll" onClick={() => navigate(`/edit-module/${moduleId}`)}>Edit</button>
          <button className="module-btn quiz" onClick={handleDelete}>Delete</button>
        </>
      );
    }

    switch (mode) {
      case "enrolled":
        return (
          <>
            <button className="module-btn view" onClick={handleViewModule}>View</button>
            <button className="module-btn quiz" onClick={handleTakeQuiz}>Take Quiz</button>
          </>
        );
      case "quiz":
        return (
          <>
            <button className="module-btn quiz" onClick={handleTakeQuiz}>Generate Quiz</button>
            <button className="module-btn view" onClick={handleViewModule}>View Module</button>
          </>
        );
      default:
        return (
          <button className="module-btn enroll" onClick={handleEnroll}>Enroll</button>
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
