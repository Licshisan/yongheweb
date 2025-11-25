import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";
import MainLayout from "./components/MainLayout";
import DashboardPage from "./pages/dashboard";
import WorkerListPage from "./pages/worker/list";
import WorkerCreatePage from "./pages/worker/create";
import ProcessListPage from "./pages/process/list";
import ProcessCreatePage from "./pages/process/create";
import SpecModelListPage from "./pages/spec-model/list";
import SpecModelCreatePage from "./pages/spec-model/create";

import WageLogListPage from "./pages/wage_log/list"
import WageLogCreatePage from "./pages/wage_log/create";
import WageLogImportPage from "./pages/wage_log/import";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/worker/list" element={<WorkerListPage />} />
          <Route path="/worker/create" element={<WorkerCreatePage />} />

          <Route path="/process/list" element={<ProcessListPage />} />
          <Route path="/process/create" element={<ProcessCreatePage />} />

          <Route path="/spec-model/list" element={<SpecModelListPage />} />
          <Route path="/spec-model/create" element={<SpecModelCreatePage />} />

          <Route path="/wage_log/list" element={<WageLogListPage />} />
          <Route path="/wage_log/create" element={<WageLogCreatePage />} />
          <Route path="/wage_log/import" element={<WageLogImportPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
