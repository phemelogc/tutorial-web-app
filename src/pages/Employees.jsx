import React, { useState, useEffect } from "react"
import "../styles/employees.css"
import Navbar from "../components/AdminNav"
import EmployeeCard from "../components/EmployeeCard"
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";


export default function Employees(){

    const [employeesLoading, setEmployeesLoading] = useState(true);
    const [employees, setEmployees] = useState([]);

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
    </div>
)
}
