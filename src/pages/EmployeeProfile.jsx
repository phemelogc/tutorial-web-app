import "../styles/employeeProfile.css";
import NavBar from "../components/EmployeeNav";
import { useEffect, useState } from "react";
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function EmployeeProfile() {
    const [profileData, setProfileData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        role: "",
        department: ""
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const auth = getAuth();
                const user = auth.currentUser;

                if (!user) {
                    console.log("No user logged in");
                    return;
                }

                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const data = userSnap.data();
                    const fullName = data.fullName || "";
                    const [firstName, lastName] = fullName.split(" ");
                    const role = data.role || "";
                    const department = data.department || "";

                    setProfileData((prev) => ({
                        ...prev,
                        firstName: firstName || "",
                        lastName: lastName || "",
                        email: user.email || "",
                        role,
                        department
                    }));
                } else {
                    console.log("No document found for the user");
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const auth = getAuth();
        const user = auth.currentUser;

        if (profileData.role !== "admin") {
            if (
                profileData.newPassword &&
                profileData.newPassword === profileData.confirmPassword
            ) {
                try {
                    const credential = EmailAuthProvider.credential(
                        user.email,
                        profileData.currentPassword
                    );
                    await reauthenticateWithCredential(user, credential);
                    await updatePassword(user, profileData.newPassword);
                    alert("Password changed successfully!");
                } catch (err) {
                    console.error("Password change error:", err);
                    alert("Failed to change password. Check current password.");
                    return;
                }
            } else if (profileData.newPassword || profileData.confirmPassword) {
                alert("Passwords do not match.");
                return;
            }
        }

        alert("Profile updated successfully!");
        // you'd do a db update here if editing names/department
    };

    if (loading) {
        return (
            <div className="profile-loading">
                <div className="spinner"></div>
                <p>Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <NavBar />

            <div className="profile-header">
                <h1>My Profile</h1>
                <p>Manage your personal information</p>
            </div>

            <div className="profile-content">
                <div className="profile-photo-section">
                    <div className="profile-photo-container">
                        <div className="profile-photo-placeholder">
                            {profileData.firstName?.charAt(0)}
                            {profileData.lastName?.charAt(0)}
                        </div>
                        {profileData.role !== "admin" && (
                            <button className="profile-photo-upload-btn">
                                Upload Photo
                            </button>
                        )}
                    </div>
                </div>

                <div className="profile-form-section">
                    <form onSubmit={handleSubmit}>
                        {/* Personal Info */}
                        <div className="profile-section">
                            <h2 className="profile-section-title">Personal Information</h2>
                            <div className="profile-form-row">
                                <div className="profile-form-group">
                                    <label>First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={profileData.firstName}
                                        onChange={handleChange}
                                        placeholder="First Name"
                                    />
                                </div>
                                <div className="profile-form-group">
                                    <label>Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={profileData.lastName}
                                        onChange={handleChange}
                                        placeholder="Last Name"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="profile-divider"></div>

                        {/* Contact Info */}
                        <div className="profile-section">
                            <h2 className="profile-section-title">Contact Information</h2>
                            <div className="profile-form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={profileData.email}
                                    readOnly
                                    className="profile-input-readonly"
                                />
                                <p className="profile-input-hint">Email cannot be changed</p>
                            </div>
                        </div>

                        <div className="profile-divider"></div>

                        {/* Employment Info */}
                        <div className="profile-section">
                            <h2 className="profile-section-title">Employment Info</h2>
                            <div className="profile-form-group">
                                <label>Role</label>
                                <input
                                    type="text"
                                    value={profileData.role}
                                    readOnly
                                    className="profile-input-readonly"
                                />
                            </div>
                            <div className="profile-form-group">
                                <label>Department</label>
                                <input
                                    type="text"
                                    value={profileData.department}
                                    readOnly
                                    className="profile-input-readonly"
                                />
                            </div>
                        </div>

                        {profileData.role !== "admin" && (
                            <>
                                <div className="profile-divider"></div>

                                {/* Security */}
                                <div className="profile-section">
                                    <h2 className="profile-section-title">Security</h2>
                                    <div className="profile-form-group">
                                        <label>Current Password</label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={profileData.currentPassword}
                                            onChange={handleChange}
                                            placeholder="Enter current password"
                                        />
                                    </div>
                                    <div className="profile-form-row">
                                        <div className="profile-form-group">
                                            <label>New Password</label>
                                            <input
                                                type="password"
                                                name="newPassword"
                                                value={profileData.newPassword}
                                                onChange={handleChange}
                                                placeholder="Enter new password"
                                            />
                                        </div>
                                        <div className="profile-form-group">
                                            <label>Confirm Password</label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={profileData.confirmPassword}
                                                onChange={handleChange}
                                                placeholder="Confirm new password"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="profile-actions">
                            <button type="submit" className="profile-save-btn">Save Changes</button>
                            <button type="button" className="profile-cancel-btn">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
