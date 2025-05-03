import "../styles/moduleCard.css";
import { auth } from "../firebase/firebase";
import { enrollUserInModule } from "../firebase/enrolledModules";
import { useNavigate } from "react-router-dom";

export default function ModuleCard({ 
  title, 
  department, 
  description, 
  admin = false, 
  mode = "browse",
  moduleId,
  onEdit, 
  onDelete 
}) {
  
  const navigate = useNavigate();
  
  const handleEnroll = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return alert("You're not logged in!");
    
    // Generate ID if not provided
    
    if(!moduleId){
      console.error("Missing moduleId fro enrollment");
      return alert("Error: Module ID not found");
    }
    
    const result = await enrollUserInModule(userId, { 
      title, 
      department, 
      description, 
      id: moduleId
    });
    
    if (result.success) {
      alert("Enrolled successfully!");
      navigate("/enrolledModules", { replace: false });
    } else {
      alert("Enrollment failed: " + result.message);
    }
  };
  
  const handleViewModule = () => {
    // Navigate to module content/details page
    navigate(`/module/${moduleId || title.toLowerCase().replace(/\s+/g, "_")}`);
  };
  
  const handleTakeQuiz = () => {
    // Navigate to quiz page for this module
    navigate(`/quiz/${moduleId || title.toLowerCase().replace(/\s+/g, "_")}`);
  };
  
  // Render different buttons based on mode
  const renderButtons = () => {
    if (admin) {
      return (
        <>
          <button className="module-btn enroll" onClick={onEdit}>Edit</button>
          <button className="module-btn quiz" onClick={onDelete}>Delete</button>
        </>
      );
    } else if (mode === "enrolled") {
      return (
        <>
          <button className="module-btn view" onClick={handleViewModule}>View</button>
          <button className="module-btn quiz" onClick={handleTakeQuiz}>Take Quiz</button>
        </>
      );
    } else {
      // Default "browse" mode
      return (
        <button
          className="module-btn enroll"
          onClick={handleEnroll}
        >
          Enroll
        </button>
      );
    }
  };
  
  return (
    <div className="module-card">
      <h3 className="module-card-title">{title}</h3>
      <p className="module-card-department">{department}</p>
      <p className="module-card-description">{description}</p>
      <div className="module-card-actions">
        {renderButtons()}
      </div>
    </div>
  );
}