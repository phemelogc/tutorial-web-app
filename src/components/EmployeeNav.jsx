import { Link } from "react-router-dom";
import "../styles/employeeNav.css";
import { signOut, getAuth } from "firebase/auth";
import { useEffect } from "react";

export default function Navbar(id) {
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    
      window.replace("/");
      
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        // If no user is logged in and we're on a protected page, redirect
        if (!window.location.pathname.includes("/login") && 
            !window.location.pathname === "/") {
          window.location.replace("/");
        }
      }
    });

    return () => unsubscribe(); // Clean up subscription
  }, []);

  return (
    <header className="navbar">
      <div className="navbar-left">
        <Link to="/employeeDash" className="navbar-logo-link">
          <h1 className="navbar-logo">MechConnect</h1>
        </Link>
      </div>

      <div className="navbar-right">
        <span className="navbar-name"></span>

        <Link to="/employeeDash">Available Modules</Link>
        <Link to="/enrolledModules">My Modules</Link>
        <Link to={`/employeeProfile/${id}`}>Profile</Link>
        <Link onClick={handleLogout}>Logout</Link> 
      </div>
    </header>
  );
}