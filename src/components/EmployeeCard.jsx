import "../styles/EmployeeCard.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";

export default function EmployeeCard({ id, name, email, avatar, department }) {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/profiles/${id}`);
  };

  return (
    <li className="employee-card" onClick={handleView}>
  <div className="employee-card-left">
    {avatar ? (
      <img src={avatar} alt={`${name}'s avatar`} className="employee-avatar" />
    ) : (
      <div className="employee-avatar-empty">
        {name?.charAt(0)?.toUpperCase() || "?"}
      </div>
    )}
  </div>

  <div className="employee-card-details">
    <div className="employee-info">
      <h3 className="employee-name">{name}</h3>
      <p className="employee-department">{department}</p>
      <p className="employee-email">{email}</p>
    </div>
    <div className="arrow-icon">
      <FontAwesomeIcon icon={faArrowRightLong} />
    </div>
  </div>
</li>

  );
}
