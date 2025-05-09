import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import EmployeeDash from "../pages/EmployeeDash";
import AdminDashboard from "../pages/AdminDashboard";
import UploadModule from "../pages/UploadModule";
import EmployeeProfile from "../pages/EmployeeProfile";
import AdminProfile from "../pages/AdminProfile";
import EnrolledModules from "../pages/enrolledModules";
import ModuleView from "../pages/ModuleView";
import EditModule from "../pages/EditModule";
import QuizzesPage from "../pages/Quizzes.jsx";
import QuizPreview from "../pages/QuizPreview";
import Profiles from "../pages/Profiles";
import Employees from "../pages/Employees.jsx";
import CreateOrEditQuiz from "../pages/CreateOrEditQuiz";
import QuizAttemptPage from "../pages/QuizAttemptPage";
import QuizResultsPage from "../pages/QuizResultsPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/employeeDash" element={<EmployeeDash />} />
      <Route path="/adminDash" element={<AdminDashboard />} />
      <Route path="/upload" element={<UploadModule />} />
      <Route path="/employeeProfile/:employeeId" element={< EmployeeProfile />}/>
      <Route path="/profiles/:id" element={<Profiles/>}/>
      <Route path="/adminProfile" element={<AdminProfile />} />
      <Route path="/enrolledModules" element={<EnrolledModules />} />
      <Route path="/module/:moduleId" element={<ModuleView />} />
      <Route path="/edit-module/:moduleId" element={<EditModule/>}/>
      <Route path="/quizzes" element={<QuizzesPage/>}/>
      <Route path="/quiz-preview/:moduleId" element={<QuizPreview />} />
      <Route path="/employees" element={<Employees />} />
      <Route path="/create-quiz/:moduleId" element={<CreateOrEditQuiz />} />
      <Route path="/quiz-attempt/:moduleId" element={<QuizAttemptPage />} />
      <Route path="/quiz-results" element={<QuizResultsPage />} />

    </Routes>
  );
}
