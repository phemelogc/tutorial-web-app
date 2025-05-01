import { Link } from "react-router-dom";
import "../styles/adminNav.css";

export default function AdminNav({ name = "Admin" }) {
  return (
    <header className="admin-navbar">
      <h1 className="admin-logo">MechConnect</h1>

      <nav className="admin-links">
        <span className="admin-name">Welcome, {name}</span>
        <Link to="/adminDash">Dashboard</Link>
        <Link to="/upload">Upload</Link>
        <Link to="/quiz">Quizzes</Link>
        <Link to="/progress">Progress</Link>
        <Link to="/">Logout</Link>
      </nav>
    </header>
  );
}
