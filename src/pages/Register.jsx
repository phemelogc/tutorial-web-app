import "../styles/register.css";
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
  e.preventDefault();

  const fullName = `${firstName} ${lastName}`;
  const randomPassword = "123456";

  setIsLoading(true);
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, randomPassword);
    await updateProfile(userCred.user, { displayName: fullName });

    await setDoc(doc(db, "users", userCred.user.uid), {
      fullName,
      email,
      department,
      role: "Employee",
    });

    alert("Employee registered successfully!");
    window.close();
  } catch (err) {
    alert("Registration failed: " + err.message);
    setIsLoading(false);
  }
};


  return (
    <>
      {isLoading && (
        <div className="register-loading-screen">
          <div className="register-spinner"></div>
        </div>
      )}
      <div className="register-page">
        <div className="register-container">
          <h1 className="register-title">Register an employee</h1>

          <form className="register-form" onSubmit={handleRegister}>
            <input className="register-input" type="text" placeholder="First Name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <input className="register-input" type="text" placeholder="Last Name" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
            <input className="register-input" type="email" placeholder="Email Address" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <select className="register-input" value={department} onChange={(e) => setDepartment(e.target.value)} required>
              <option value="" disabled>Select Department</option>
              <option value="Marketing">Marketing</option>
              <option value="HR">HR</option>
              <option value="Quality Assurance">Quality Assurance</option>
              <option value="Sales">Sales</option>
              <option value="Support">Support</option>
              <option value="Engineering">Engineering</option>
            </select>

            <button className="register-button" type="submit">Sign Up</button>
          </form>
        </div>
      </div>
    </>
  );
}
