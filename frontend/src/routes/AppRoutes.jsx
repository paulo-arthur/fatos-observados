/* eslint-disable no-unused-vars */
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import FO from "../pages/FO.jsx";
import Instructors from "../pages/Instructors.jsx";
import Student from "../pages/Student.jsx";

export default function AppRoutes () {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/fo" element={<FO />} />
            <Route path="/instructors" element={<Instructors />} />
            <Route path="/students" element={<Student />} />
        </Routes>
    );
}