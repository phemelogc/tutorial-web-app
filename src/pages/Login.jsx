import "../styles/login.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const role = userSnap.data().role;
        if (role === "admin") {
          navigate("./adminDash");
        } else {
          navigate("./employeeDash");
        }
      } else {
        alert("User record not found in Firestore.");
      }
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Please login to your account</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <input className="login-input" type="email" placeholder="Email Address" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="login-input" type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          <p className="forgot-text">Forgot password?</p>
          <button className="login-button" type="submit">Login</button>
        </form>

        <div className="divider"><span>OR</span></div>

        <div className="login-social-buttons">
          <button><FontAwesomeIcon icon={faGoogle} /></button>
          <button><FontAwesomeIcon icon={faFacebook} /></button>
        </div>

        <div className="login-footer">
          <p>Don’t have an account? <a href="/register">Sign up</a></p>
        </div>
      </div>
    </div>
  );
}
