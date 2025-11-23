import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SpecModelPage from "./pages/SpecModelPage";
import WageLogSearchPage from "./pages/WageLogSearchPage";
import WageLogPage from "./pages/WageLogPage";
import LoginPage from "./pages/LoginPage";
import SalaryImportPage from "./pages/SalaryImportPage";
import Register from "./pages/Register";
import MainLayout from "./components/MainLayout";
import DashboardPage from "./pages/dashboard";
import WorkerListPage from "./pages/worker/list";
import WorkerCreatePage from "./pages/worker/create";
import ProcessListPage from "./pages/process/list";
import ProcessCreatePage from "./pages/process/create";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/worker" element={<WorkerListPage />} />
          <Route path="/worker/create" element={<WorkerCreatePage />} />

          <Route path="/process" element={<ProcessListPage />} />
          <Route path="/process/create" element={<ProcessCreatePage />} />
          <Route path="/spec-model" element={<SpecModelPage />} />
          <Route path="/wage_log" element={<WageLogPage />} />
          <Route path="/wage_log_check" element={<WageLogSearchPage />} />
          <Route path="/salary_import" element={<SalaryImportPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
