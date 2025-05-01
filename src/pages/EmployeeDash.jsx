import "../styles/employeeDash.css";
import Navbar from "../components/EmployeeNav";
import ModuleCard from "../components/moduleCard";

export default function DashboardEmployee() {

    const dummyCourses = [
        {
          title: "Understanding Vehicle Systems",
          description: "Explore the major systems of a car and how they work together.",
        },
        {
          title: "Spare Parts Terminology",
          description: "Master the lingo used in automotive parts & industry.",
        },
        {
          title: "Auto Parts 101",
          description: "A beginner-friendly guide to common car components.",
        },
        {
          title: "Customer Service Training",
          description: "Best practices for handling clients and service inquiries.",
        },
        {
          title: "Electrical Systems in Automobiles",
          description: "Learn the basics of automotive wiring and power systems.",
        },
      ];
      
  return (
    
    <div className="employee-dashboard">
      <Navbar role="employee" name="Lesh David" />

      <main className="employee-main">
        <h2 className="employee-main-title">Available Training Modules</h2>
        <div className="employee-course-grid">
            {dummyCourses.map((course, index) => (
                <ModuleCard
                    key={index}
                    title={course.title}
                    description={course.description}
                    onEnroll={() => console.log(`Enrolled in ${course.title}`)}
                    onQuiz={() => console.log(`Quiz started for ${course.title}`)}
                />
            ))}
        </div>
      </main>
    </div>
  );
}
