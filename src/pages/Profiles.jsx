import "../styles/employeeProfile.css";
import AdminNav from "../components/AdminNav";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useParams } from "react-router-dom";

export default function Profiles() {
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        if (!id) return;
        const docRef = doc(db, "users", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const [firstName, lastName] = (data.fullName || " ").split(" ");
          setProfileData({
            firstName,
            lastName,
            email: data.email || "",
            department: data.department || "",
            role: data.role || "",
          });
        } else {
          console.warn("No user found with that ID.");
        }
      } catch (err) {
        console.error("Error fetching employee:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  if (loading) {
    return (
      <div className="section-spinner-wrapper">
        <div className="section-spinner"></div>
      </div>
    );
  }

  if (!profileData) {
    return <p className="employee-empty">Employee not found</p>;
  }

  return (
    <div className="profile-container">
      <AdminNav />

      <div className="profile-header">
        <h1>Employee Profile</h1>
        <p>Viewing employee information</p>
      </div>

      <div className="profile-content">
        <div className="profile-photo-section">
          <div className="profile-photo-container">
            <div className="profile-photo-placeholder">
              {profileData.firstName?.charAt(0)}
              {profileData.lastName?.charAt(0)}
            </div>
          </div>
        </div>

        <div className="profile-form-section">
          <div className="profile-section">
            <h2 className="profile-section-title">Personal Information</h2>
            <div className="profile-form-row">
              <div className="profile-form-group">
                <label>First Name</label>
                <input type="text" value={profileData.firstName} disabled />
              </div>
              <div className="profile-form-group">
                <label>Last Name</label>
                <input type="text" value={profileData.lastName} disabled />
              </div>
            </div>
          </div>

          <div className="profile-divider"></div>

          <div className="profile-section">
            <h2 className="profile-section-title">Contact & Role</h2>
            <div className="profile-form-row">
              <div className="profile-form-group">
                <label>Email</label>
                <input type="email" value={profileData.email} disabled />
              </div>
              <div className="profile-form-group">
                <label>Department</label>
                <input type="text" value={profileData.department} disabled />
              </div>
              <div className="profile-form-group">
                <label>Role</label>
                <input type="text" value={profileData.role} disabled />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
