import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import EmployeeDash from "../pages/EmployeeDash";
import AdminDashboard from "../pages/AdminDashboard";
import UploadModule from "../pages/UploadModule";
import EmployeeProfile from "../pages/EmployeeProfile";
import AdminProfile from "../pages/AdminProfile";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/employeeDash" element={<EmployeeDash />} />
      <Route path="/adminDash" element={<AdminDashboard />} />
      <Route path="/upload" element={<UploadModule />} />
      <Route path="employeeProfile" element={< EmployeeProfile />}/>
      <Route path="adminProfile" element={<AdminProfile />} />

    </Routes>
  );
}
