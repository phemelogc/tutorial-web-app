import "../styles/EmployeeCard.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";

export default function EmployeeCard({ id, name, email, avatar, department }) {
  return (
    <li className="admin-employee-item">
      <Link to={`/employeeProfile/${id}`} className="employee-link-wrapper">
        <div className="employee-card-left">
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
            <p className="employee-department">{department}</p>
          </div>
        </div>

        <FontAwesomeIcon icon={faArrowRightLong} className="employee-card-arrow"/>

      </Link>
    </li>
  );
}
