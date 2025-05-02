import { Link } from "react-router-dom";
import "../styles/employeeNav.css";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <Link to="/employeeDash" className="navbar-logo-link">
        <h1 className="navbar-logo">MechConnect</h1>
        </Link>
      </div>

      <div className="navbar-right">
        <span className="navbar-name"></span>

        <Link to="/employeeProfile">Profile</Link>
        <Link to="/">Logout</Link>
      </div>
    </header>
  );
}
