import "../styles/EmployeeCard.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";


export default function EmployeeCard({ id, name, email, avatar, department }) {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  const handleView = () => {
    navigate(`/profiles/${id}`);
  };

  useEffect(() => {
    const fetchProgress = async () => {
      const progressRef = doc(db, "quizProgress", id);
      const snapshot = await getDoc(progressRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        const moduleIds = Object.keys(data);
        if (moduleIds.length > 0) {
          const latestModule = moduleIds[moduleIds.length - 1];
          const percent = data[latestModule].percent || 0;
          setProgress(percent);
        }
      }
    };

    fetchProgress();
  }, [id]);

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
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="progress-text">Progress: {progress}%</p>
        </div>

        <div className="employee-right-actions">
          <div className="arrow-icon">
            <FontAwesomeIcon icon={faArrowRightLong} />
          </div>
        </div>
      </div>
    </li>
  );
}
