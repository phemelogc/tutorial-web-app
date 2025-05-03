import "../styles/EmployeeCard.css"
import { Link } from "react-router-dom";

export default function EmployeeCard({ name, email, avatar, department, onView, onReport }) {
  return (
    <li className="admin-employee-item">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          {avatar ? (
            <img
              src={avatar}
              alt={`${name}'s avatar`}
              className="employee-avatar"
            />
          ) : (
            <div className="employee-avatar-empty">
              {name?.charAt(0)?.toUpperCase() || "?"}
            </div>
          )}
          <div className="employee-info">
            <p className="employee-name">{name}</p>
            <p className="employee-detail">{email}</p>
            <p style={{ fontSize: "0.9rem", color: "#777" }}>{department}</p>
          </div>
        </div>

        <div className="employee-btn-group">
          <button className="employee-view-btn" onClick={onView}>View</button>
          <button className="employee-report-btn" onClick={onReport}>Generate Report</button>
        </div>
      </div>
    </li>
  );
}