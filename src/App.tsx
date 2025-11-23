import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProcessPage from './pages/ProcessPage';
import SpecModelPage from './pages/SpecModelPage';
import WageLogSearchPage from './pages/WageLogSearchPage';
import WageLogPage from './pages/WageLogPage';
import LoginPage from './pages/LoginPage';
import SalaryImportPage from './pages/SalaryImportPage';
import Register from './pages/Register';
import MainLayout from './components/MainLayout';
import WorkerPage from './pages/WorkerPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />

        <Route element={<MainLayout />}>
          <Route path="/workers" element={<WorkerPage />} />
          <Route path="/processes" element={<ProcessPage />} />
          <Route path="/spec-models" element={<SpecModelPage />} />
          <Route path="/wage_logs" element={<WageLogPage />} />
          <Route path="/wage_logs_check" element={<WageLogSearchPage />} />
          <Route path="/salary_import" element={<SalaryImportPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
