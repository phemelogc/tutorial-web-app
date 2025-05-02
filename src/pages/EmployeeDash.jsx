import "../styles/employeeDash.css";
import Navbar from "../components/EmployeeNav";
import ModuleCard from "../components/moduleCard";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function DashboardEmployee() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const modulesRef = collection(db, "modules");
        const snap = await getDocs(modulesRef);
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setModules(data);
      } catch (err) {
        console.error("Failed to fetch modules:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  return (
    <div className="employee-dashboard">
      <Navbar role="employee" name="Lesh David" />

      <main className="employee-main">
        <h2 className="employee-main-title">Available Training Modules</h2>

        {loading ? (
          <div className="section-spinner-wrapper">
            <div className="section-spinner"></div>
          </div>
        ) : modules.length === 0 ? (
          <p className="employee-empty">No modules available.</p>
        ) : (
          <div className="employee-course-grid">
            {modules.map((course, index) => (
              <ModuleCard
                key={course.id || index}
                title={course.title}
                department={course.department || "General" }
                description={course.description}
                onEnroll={() => console.log(`Enrolled in ${course.title}`)}
                onQuiz={() => console.log(`Quiz started for ${course.title}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
