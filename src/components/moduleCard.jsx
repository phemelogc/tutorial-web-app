import "../styles/moduleCard.css";

export default function ModuleCard({ title, department, description, onEnroll, onQuiz, admin = false, onEdit, onDelete }) {
  return (
    <div className="module-card">
      <h3 className="module-card-title">{title}</h3>
      <p className="module-card-department">{department}</p>
      <p className="module-card-description">{description}</p>
      <div className="module-card-actions">
        {admin ? (
          <>
            <button className="module-btn enroll" onClick={onEdit}>Edit</button>
            <button className="module-btn quiz" onClick={onDelete}>Delete</button>
          </>
        ) : (
          <>
            <button className="module-btn enroll" onClick={onEnroll}>Enroll</button>
            <button className="module-btn quiz" onClick={onQuiz}>Take Quiz</button>
          </>
        )}
      </div>
    </div>
  );
}
