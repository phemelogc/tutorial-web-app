import "../styles/employeeDash.css";
import Navbar from "../components/EmployeeNav";
import ModuleCard from "../components/moduleCard";
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";

export default function EnrolledModules() {
  const { user } = useAuth();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchEnrolledModules = async () => {
      try {
        const enrolledRef = collection(db, "users", user.uid, "enrolledModules");
        const snap = await getDocs(enrolledRef);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setModules(data);
      } catch (err) {
        console.error("Failed to fetch enrolled modules:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledModules();
  }, [user]);

  return (
    <div className="employee-dashboard">
      <Navbar role="employee" name="Lesh David" />
      <main className="employee-main">
        <h2 className="employee-main-title">My Enrolled Modules</h2>

        {loading ? (
          <div className="section-spinner-wrapper">
            <div className="section-spinner"></div>
          </div>
        ) : modules.length === 0 ? (
          <p className="employee-empty">You haven't enrolled in any modules yet. Go hustle 🏃</p>
        ) : (
          <div className="employee-course-grid">
            {modules.map((course, index) => (
              <ModuleCard
                key={course.id || index}
                moduleId={course.id}
                title={course.title}
                department={course.department}
                description={course.description}
                onQuiz={() => console.log(`Quiz started for ${course.title}`)}
                mode="enrolled"
              />
              
            ))}
          </div>
        )}
      </main>

    </div>
  );
}
