import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import Layout from '../components/Layout.jsx';
import Login from '../pages/Login.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import FO from '../pages/FO.jsx';
import FODetail from '../pages/FODetail.jsx';
import Instructors from '../pages/Instructors.jsx';
import Student from '../pages/Student.jsx';
import StudentDetail from '../pages/StudentDetail.jsx';
import InstructorDetail from '../pages/InstructorDetail.jsx';

function ProtectedRoute() {
  const { signed } = useAuth();
  const location = useLocation();
  return signed ? <Outlet /> : <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="fo" element={<FO />} />
          <Route path="fo/:id" element={<FODetail />} />
          <Route path="students" element={<Student />} />
          <Route path="students/:id" element={<StudentDetail />} />
          <Route path="instructors" element={<Instructors />} />
          <Route path="instructors/:id" element={<InstructorDetail />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}
