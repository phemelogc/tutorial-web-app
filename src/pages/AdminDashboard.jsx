import "../styles/adminDash.css";
import "../styles/moduleCard.css";
import AdminNav from "../components/AdminNav";
import ModuleCard from "../components/moduleCard";
import EmployeeCard from "../components/EmployeeCard";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function DashboardAdmin() {
  const [modules, setModules] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [modulesLoading, setModulesLoading] = useState(true);
  const [employeesLoading, setEmployeesLoading] = useState(true);

  useEffect(() => {
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
          .filter(user => user.role === "employee" || user.role === "user");
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
        <h1 className="admin-welcome">Hello Orapeleng 👋</h1>
        <p className="admin-subtitle">Here’s your admin overview.</p>

        <div className="admin-overview">
          <div className="admin-stat-card">Total Modules: {modules.length}</div>
          <div className="admin-stat-card">Total Employees: {employees.length}</div>
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
                  onEdit={() => alert(`Edit ${mod.title}`)}
                  onDelete={() => alert(`Delete ${mod.title}`)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Employees Section */}
        <section className="admin-employees">
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
                  name={emp.fullName}
                  email={emp.email}
                  avatar={emp.avatarUrl || null}
                  department={emp.department || "N/A"}
                />
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
