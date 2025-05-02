import "../styles/register.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirm) return alert("Passwords don't match!");

    setIsLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCred.user, { displayName: fullName });

      await setDoc(doc(db, "users", userCred.user.uid), {
        fullName,
        email,
        role: "employee",
      });

      navigate("/employeeDash", { replace: true });
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
          <h1 className="register-title">Create an account...</h1>

          <form className="register-form" onSubmit={handleRegister}>
            <input className="register-input" type="text" placeholder="Full Name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
            <input className="register-input" type="email" placeholder="Email Address" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="register-input" type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            <input className="register-input" type="password" placeholder="Confirm Password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            <button className="register-button" type="submit">Sign Up</button>
          </form>

          <div className="divider"><span>OR</span></div>

          <div className="login-social-buttons">
            <button><FontAwesomeIcon icon={faGoogle} /></button>
            <button><FontAwesomeIcon icon={faFacebook} /></button>
          </div>

          <div className="register-footer">
            <p>Already have an account? <a href="/">Login</a></p>
          </div>
        </div>
      </div>
    </>
  );
}
