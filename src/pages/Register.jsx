import "../styles/register.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, updateProfile, onAuthStateChanged } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const snap = await getDoc(doc(db, "users", user.uid));
        const role = snap.exists() ? snap.data().role : "employee";
        navigate(role === "admin" ? "/adminDash" : "/employeeDash", { replace: true });
      }
    });
    return () => unsub();
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirm) return alert("Passwords don't match!");

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCred.user, { displayName: fullName });

      await setDoc(doc(db, "users", userCred.user.uid), {
        fullName,
        email,
        role: "employee",
      });

      navigate("./employeeDash");
    } catch (err) {
      alert("Registration failed: " + err.message);
    }
  };

  return (
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
  );
}
