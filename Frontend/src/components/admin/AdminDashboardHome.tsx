import React from 'react';
import { FiUsers, FiBook, FiGrid, FiCalendar } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { StatsCard } from '../dashboard/StatsCard';
import { Card } from '../common/Card';
import { useDashboardStats } from '../../hooks/useDashboardStats';

export const AdminDashboardHome: React.FC = () => {
  const navigate = useNavigate();
  const { stats, isLoading } = useDashboardStats();

  const quickActions = [
    { label: 'Add Department', icon: '🏢', path: '/admin/departments' },
    { label: 'Add Teacher', icon: '👨‍🏫', path: '/admin/teachers' },
    { label: 'Add Course', icon: '📚', path: '/admin/courses' },
    { label: 'Add Room', icon: '🏫', path: '/admin/rooms' },
  ];

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard 👑
        </h1>
        <p className="text-gray-600">Manage your timetable system efficiently</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Teachers"
          value={isLoading ? '...' : stats.totalTeachers}
          icon={FiUsers}
          color="blue"
        />
        <StatsCard
          title="Total Courses"
          value={isLoading ? '...' : stats.totalCourses}
          icon={FiBook}
          color="green"
        />
        <StatsCard
          title="Departments"
          value={isLoading ? '...' : stats.totalDepartments}
          icon={FiGrid}
          color="purple"
        />
        <StatsCard
          title="Academic Years"
          value={isLoading ? '...' : stats.totalAcademicYears}
          icon={FiCalendar}
          color="orange"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <h3 className="card-header">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                className="bg-gradient-to-br from-primary-50 to-primary-100 p-4 rounded-lg hover:shadow-md transition-all text-left"
              >
                <div className="text-2xl mb-2">{action.icon}</div>
                <p className="font-medium text-sm text-primary-900">{action.label}</p>
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="card-header">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { action: 'New teacher registered', time: '2 hours ago', type: 'success' },
              { action: 'Course updated', time: '5 hours ago', type: 'info' },
              { action: 'Department created', time: '1 day ago', type: 'success' },
              { action: 'Room added', time: '2 days ago', type: 'info' },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                <span
                  className={`w-2 h-2 rounded-full ${
                    activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* System Overview */}
      <Card>
        <h3 className="card-header">System Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-700 mb-2">
              {isLoading ? '...' : stats.totalTimeSlots}
            </p>
            <p className="text-sm text-gray-600">Time Slots</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-green-700 mb-2">
              {isLoading ? '...' : stats.totalRooms}
            </p>
            <p className="text-sm text-gray-600">Active Rooms</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-3xl font-bold text-purple-700 mb-2">
              {isLoading ? '...' : stats.totalDivisions}
            </p>
            <p className="text-sm text-gray-600">Divisions</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
