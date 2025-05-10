import "../styles/adminDash.css";
import "../styles/moduleCard.css";
import AdminNav from "../components/AdminNav";
import ModuleCard from "../components/moduleCard";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function DashboardAdmin() {
  const [adminName, setAdminName] = useState("");
  const [modules, setModules] = useState([]);
  const [modulesLoading, setModulesLoading] = useState(true);
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [selectedDept, setSelectedDept] = useState("all")

  const filteredModules =
    selectedDept === "all"
      ? modules
      : modules.filter((mod) => mod.department === selectedDept);

  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const snap = await getDocs(collection(db, "users"));
          const employeesOnly = snap.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter((user) => user.role === "Employee" || user.role === "user");

          setEmployees(employeesOnly);
          
          const currentUser = snap.docs.find((doc) => doc.id === user.uid);
          if (currentUser) {
            setAdminName(currentUser.data().fullName || "Admin");
          }
        } catch (err) {
          console.error("Error fetching admin name:", err);
        }
      } else {
        navigate("/login");
      }
    });

    const fetchModules = async () => {
      try {
        const snap = await getDocs(collection(db, "modules"));
        const fetchedModules = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setModules(fetchedModules);
      } catch (err) {
        console.error("Error fetching modules:", err);
      } finally {
        setModulesLoading(false);
      }
    };

    const fetchEmployees = async () => {
      try {
        const snap = await getDocs(collection(db, "users"));
        setEmployees(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching employees:", err);
      } finally {
        setEmployeesLoading(false);
      }
    };
    

    fetchModules();
    fetchEmployees();

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="admin-dashboard">
      <AdminNav />

      <main className="admin-main">
        <div className="admin-header">
          <div className="admin-welcome">
            <h1>Hello {adminName || "Admin"} 👋</h1>
          </div>
          <button className="add-employee" onClick={() => navigate("/upload")}>
            <FontAwesomeIcon icon={faPlus} className="add-icon" /> Add Module
          </button>
        </div>

        <p className="admin-subtitle">Here’s your admin overview.</p>

        <div className="admin-module-controls">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="admin-filter"
          >
          
          <option value="all">All Departments</option>
            {[...new Set(modules.map((mod) => mod.department).filter(Boolean))].map(
              (dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              )
            )}
          </select>
        </div>

        <div className="admin-overview">
          <div className="admin-stat-card">Total Modules: {modules.length}</div>
          <div className="admin-stat-card_admin-clickable">
            {employeesLoading ? (
              <span>Loading Employees...</span>
            ) : (
              <span>Total Employees: {employees.length}</span>
            )}
          </div>
          
        </div>

        <section className="admin-videos">
          <h2 className="admin-section-title">Training Modules</h2>
          {modulesLoading ? (
            <div className="section-spinner-wrapper">
              <div className="section-spinner"></div>
            </div>
          ) : modules.length === 0 ? (
            <p className="admin-empty">No training modules available.</p>
          ) : (
            <div className="admin-video-list">
              {filteredModules.map((mod) => (
                <ModuleCard
                  key={mod.id}
                  admin
                  title={mod.title}
                  department={mod.department}
                  description={mod.description}
                  moduleId={mod.id}
                  onEdit={() => alert(`Edit ${mod.title}`)}
                  onDelete={() => alert(`Delete ${mod.title}`)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
