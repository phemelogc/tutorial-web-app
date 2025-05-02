import "../styles/employeeCard.css";

export default function EmployeeCard({ name, email, department = "General", avatar }) {
  return (
    <div className="employee-card">
      <img src={avatar || "/default-avatar.png"} alt="profile" className="employee-avatar" />
      <div className="employee-info">
        <h4 className="employee-name">{name}</h4>
        <p className="employee-detail">{department}</p>
        <p className="employee-detail">{email}</p>
      </div>
    </div>
  );
}
