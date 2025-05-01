import { Link } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar({ role = "employee", name = "User" }) {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-logo">MechConnect</h1>
      </div>

      <div className="navbar-right">
        <span className="navbar-name">Hello, {name}</span>

        {role === "admin" ? (
          <>
            <Link to="/adminDash">Dashboard</Link>
            <Link to="/upload">Upload</Link>
            <Link to="/quiz">Quizzes</Link>
            <Link to="/progress">Progress</Link>
          </>
        ) : (
          <>
            <Link to="/employee">Dashboard</Link>
            <Link to="/profile">Profile</Link>
          </>
        )}
        <Link to="/">Logout</Link>
      </div>
    </header>
  );
}
