import React, { useState, useEffect } from "react"
import "../styles/employees.css"
import Navbar from "../components/AdminNav"
import EmployeeCard from "../components/EmployeeCard"
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";


export default function Employees(){

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDept, setSelectedDept] = useState("all");
    const [employeesLoading, setEmployeesLoading] = useState(true);
    const [employees, setEmployees] = useState([]);

    const filteredEmployees = employees.filter((emp) => {
      const matchesSearch =
        emp.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.department?.toLowerCase().includes(searchQuery.toLowerCase());
    
      const matchesDept =
        selectedDept === "all" || emp.department === selectedDept;
    
      return matchesSearch && matchesDept;
      });
    
      const uniqueDepartments = [
        "all",
        ...new Set(employees.map((emp) => emp.department).filter(Boolean)),
      ];

    useEffect(() => {

        const fetchUsers = async () => {
            try {
                const snap = await getDocs(collection(db, "users"));
                const employeesOnly = snap.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(user => user.role === "Employee" || user.role === "user");
                setEmployees(employeesOnly);
            } catch (err) {
                console.error("Error fetching employees:", err);
            }finally {
                setEmployeesLoading(false);
            }
        };

        fetchUsers();
    }, [])

    return(

        <div className="employees_page">
            <Navbar />

        <div className="admin-section-title">
            <h2>Employees</h2>
            <button className="add-employee" onClick={() => window.open("/register", "_blank")}>
            <FontAwesomeIcon icon={faPlus} className="add-icon" /> Add Employee
          </button>
        </div>

        <input
            type="text"
            placeholder="Search by name or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-search"
        />
        
        <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="admin-filter"
        >
        {uniqueDepartments.map((dept) => (
            <option key={dept} value={dept}>
                {dept === "all" ? "All Departments" : dept}
            </option>
        ))}
        </select>
        
        {employeesLoading ? (
            <div className="section-spinner-wrapper">
                <div className="section-spinner"></div>
            </div>
        ) : employees.length === 0 ? (
            <p className="admin-empty">No employees found.</p>
            ) : (
                <ul className="admin-employee-list">
                    {filteredEmployees.map((emp) => (
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
        </div>
    )
}
