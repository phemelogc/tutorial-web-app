import "../styles/adminDash.css";
import "../styles/moduleCard.css";
import AdminNav from "../components/AdminNav";
import ModuleCard from "../components/moduleCard";
import EmployeeCard from "../components/EmployeeCard";
import { useEffect, useState, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

export default function DashboardAdmin() {
  const [adminName, setAdminName] = useState("");
  const [modules, setModules] = useState([]);
  const [employees, setEmployees] = useState([]);
  const employeeRef = useRef(null);
  const [modulesLoading, setModulesLoading] = useState(true);
  const [employeesLoading, setEmployeesLoading] = useState(true);

  const scrollToEmployees = () => {
    if (employeeRef.current) {
      employeeRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {

    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
    
    if (user) {
      try {
        const snap = await getDocs(collection(db, "users"));
        const currentUser = snap.docs.find(doc => doc.id === user.uid);
        
        if (currentUser) {
          setAdminName(currentUser.data().fullName);
        }
      } catch (err) {
      console.error("Error fetching admin name:", err);
      }
    }
  });

    const fetchModules = async () => {
      try {
        const snap = await getDocs(collection(db, "modules"));
        setModules(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching modules:", err);
      } finally {
        setModulesLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const snap = await getDocs(collection(db, "users"));
        const employeesOnly = snap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(user => user.role === "Employee" || user.role === "user");
        setEmployees(employeesOnly);
      } catch (err) {
        console.error("Error fetching employees:", err);
      } finally {
        setEmployeesLoading(false);
      }
    };

    fetchModules();
    fetchUsers();
  }, []);

  return (
    <div className="admin-dashboard">
      <AdminNav/>

      <main className="admin-main">
        <h1 className="admin-welcome">Hello {adminName || "Admin"} 👋</h1>
        <p className="admin-subtitle">Here’s your admin overview.</p>

        <div className="admin-overview">
          <div className="admin-stat-card">Total Modules: {modules.length}</div>
          <div
            className="admin-stat-card_admin-clickable"
            onClick={scrollToEmployees}
          >
            <span>Total Employees: {employees.length}</span>
            <FontAwesomeIcon icon={faArrowDown} className="arrow-icon" />
          </div>
          <div className="admin-stat-card">Completed Trainings: 0</div>
        </div>

        {/* Modules Section */}
        <section className="admin-videos">
          <h2 className="admin-section-title">Training Modules</h2>
          {modulesLoading ? (
            <div className="section-spinner-wrapper">
              <div className="section-spinner"></div>
            </div>
          ) : modules.length === 0 ? (
            <p className="admin-empty"> No training modules available.</p>
          ) : (
            <div className="admin-video-list">
              {modules.map((mod, i) => (
                <ModuleCard
                  key={mod.id || i}
                  admin
                  title={mod.title}
                  description={mod.description}
                  moduleId={mod.id}
                  onEdit={() => alert(`Edit ${mod.title}`)}
                  onDelete={() => alert(`Delete ${mod.title}`)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Employees Section */}
        <section className="admin-employees" ref={employeeRef}>
          <h2 className="admin-section-title">Employees</h2>
          {employeesLoading ? (
            <div className="section-spinner-wrapper">
              <div className="section-spinner"></div>
            </div>
          ) : employees.length === 0 ? (
            <p className="admin-empty">No employees found.</p>
          ) : (
            <ul className="admin-employee-list">
              {employees.map((emp) => (
                <EmployeeCard
                key={emp.id}
                id={emp.id}
                name={emp.fullName}
                email={emp.email}
                avatar={emp.avatarUrl || null}
                department={emp.department || "N/A"}
                onView={() => alert(`Viewing ${emp.fullName}`)}
                onReport={() => alert(`Reporting ${emp.fullName}`)}
              />
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
