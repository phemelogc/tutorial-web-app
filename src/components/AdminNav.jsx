import { Link } from "react-router-dom";
import "../styles/adminNav.css";

export default function AdminNav() {
  return (
    <header className="admin-navbar">
      <Link to="/adminDash">
      <h1 className="admin-logo">MechConnect</h1>
      </Link>

      <nav className="admin-links">
        <Link to="/upload">Upload</Link>
        <Link to="/quiz">Quizzes</Link>
        <Link to="/progress">Progress</Link>
        <Link to="/">Logout</Link>
      </nav>
    </header>
  );
}
