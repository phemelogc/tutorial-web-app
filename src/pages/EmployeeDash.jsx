import "../styles/employeeDash.css";
import Navbar from "../components/EmployeeNav";
import ModuleCard from "../components/moduleCard";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";

export default function DashboardEmployee() {
  const { user } = useAuth();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    console.log("Logged in as:", user.uid);

    const fetchModules = async () => {
      try {
        const [allSnap, enrolledSnap] = await Promise.all([
          getDocs(collection(db, "modules")),
          getDocs(collection(db, "users", user.uid, "enrolledModules"))
        ]);
  
        const allModules = allSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const enrolledModuleIds = new Set(enrolledSnap.docs.map(doc => doc.id));
  
        const availableModules = allModules.filter(module => !enrolledModuleIds.has(module.id));
        setModules(availableModules);
      } catch (err) {
        console.error("Failed to fetch modules:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchModules();
  }, [user]);

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
                department={course.department || "General"}
                description={course.description}
                moduleId={course.id}
                mode="browse"
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
