import "../styles/login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { setPersistence, browserSessionPersistence, onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/employeeDash", { replace: true }); // or auto-check role
      }
    });
  
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    
    e.preventDefault();
    setIsLoading(true);
    try {
      await setPersistence(auth, browserSessionPersistence);
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const role = userSnap.data().role;
        navigate(role === "admin" ? "/adminDash" : "/employeeDash", { replace: true });
      } else {
        alert("User data not found in Firestore.");
        setIsLoading(false);
      }
    } catch (err) {
      alert("Login failed: " + err.message);
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && (
        <div className="login-loading-screen">
          <div className="login-spinner"></div>
        </div>
      )}
      <div className="login-page">
        <div className="login-container">
          <div className="login-header">
            <h1>Welcome Back</h1>
            <p>Please login to your account</p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <input
              className="login-input"
              type="email"
              placeholder="Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="login-input"
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="forgot-text">Forgot password?</p>
            <button className="login-button" type="submit">Login</button>
          </form>
        </div>
      </div>
    </>
  );
}
