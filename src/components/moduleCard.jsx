import "../styles/moduleCard.css";

export default function ModuleCard({ title, description, onEnroll, onQuiz }) {
  return (
    <div className="module-card">
      <h3 className="module-card-title">{title}</h3>
      <p className="module-card-description">{description}</p>
      <div className="module-card-actions">
        <button className="module-btn enroll" onClick={onEnroll}>Enroll</button>
        <button className="module-btn quiz" onClick={onQuiz}>Take Quiz</button>
      </div>
    </div>
  );
}
