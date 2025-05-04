import { Link } from "react-router-dom";
import "../styles/adminNav.css";
import { signOut, getAuth } from "firebase/auth";
import { useEffect } from "react";

export default function AdminNav() {

  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);

      window.location.replace("/");
      
    } catch (error) {
      console.error("Admin logout error:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
       
        if (!window.location.pathname.includes("/login") && 
            !window.location.pathname === "/") {
          window.location.replace("/");
        }
      }
    });

    return () => unsubscribe(); // Clean up subscription
  }, []);

  return (
    <header className="admin-navbar">
      <Link to="/adminDash">
        <h1 className="admin-logo">MechConnect</h1>
      </Link>

      <nav className="admin-links">
        <Link to="/upload">Upload</Link>
        <Link to="/quizzes">Quizzes</Link>
        <Link onClick={handleLogout}>Logout</Link> 
      </nav>
    </header>
  );
}