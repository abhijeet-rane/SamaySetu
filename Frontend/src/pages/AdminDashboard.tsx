import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { AdminDashboardHome } from '../components/admin/AdminDashboardHome';
import { DepartmentsPage } from '../components/admin/DepartmentsPage';
import { TeachersPageComplete } from '../components/admin/TeachersPageComplete';
import { CoursesPage } from '../components/admin/CoursesPage';
import { RoomsPage } from '../components/admin/RoomsPage';
import { AcademicYearsPage } from '../components/admin/AcademicYearsPage';
import { DivisionsPage } from '../components/admin/DivisionsPage';
import { TimeSlotsPage } from '../components/admin/TimeSlotsPage';
import { AdminProfilePage } from './admin/AdminProfilePage';

export const AdminDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          isAdmin={true}
        />
        
        <main className="flex-1 p-6 lg:p-8">
          <Routes>
            <Route path="dashboard" element={<AdminDashboardHome />} />
            <Route path="departments" element={<DepartmentsPage />} />
            <Route path="teachers" element={<TeachersPageComplete />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="rooms" element={<RoomsPage />} />
            <Route path="academic-years" element={<AcademicYearsPage />} />
            <Route path="divisions" element={<DivisionsPage />} />
            <Route path="time-slots" element={<TimeSlotsPage />} />
            <Route path="profile" element={<AdminProfilePage />} />
            <Route path="/" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};
