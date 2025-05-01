import "../styles/adminDash.css";
import AdminNav from "../components/AdminNav";

export default function DashboardAdmin() {
  return (
    <div className="admin-dashboard">
      <AdminNav name="Orapeleng" />

      <main className="admin-main">
        <h1 className="admin-welcome">Hello Orapeleng 👋</h1>
        <p className="admin-subtitle">Welcome to Admin Dashboard</p>

        <div className="admin-actions">
          <button className="admin-action-btn">Create Quiz</button>
          <button className="admin-action-btn">Upload Videos</button>
          <button className="admin-action-btn">Employee Progress</button>
        </div>

        <section className="admin-videos">
          <h2 className="admin-section-title">Training Modules</h2>
          <div className="admin-video-list">
            <div className="admin-video-card">Understanding Vehicle Systems</div>
            <div className="admin-video-card">Essential Spare Parts Terminology</div>
            <div className="admin-video-card">Common Auto Parts and Their Functions</div>
          </div>
        </section>
      </main>
    </div>
  );
}