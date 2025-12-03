import React, { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiBook, FiCheckCircle, FiInfo } from 'react-icons/fi';
import { StatsCard } from '../components/dashboard/StatsCard';
import { Card } from '../components/common/Card';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';

export const DashboardPage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const [teacherData, setTeacherData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        setIsLoading(true);
        // Try to fetch teacher data by email
        const response = await api.get('/api/teachers');
        const teachers = response.data;
        const currentTeacher = teachers.find((t: any) => t.email === user?.email);
        setTeacherData(currentTeacher);
      } catch (error) {
        console.error('Error fetching teacher data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.email) {
      fetchTeacherData();
    }
  }, [user?.email]);

  const getUserName = () => {
    if (user?.name) return user.name;
    if (user?.email) {
      const emailName = user.email.split('@')[0];
      return emailName.replace(/\./g, ' ').replace(/\d+/g, '').trim();
    }
    return 'User';
  };

  const formatName = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {formatName(getUserName())}! 👋
        </h1>
        <p className="text-gray-600">Here's what's happening with your schedule today.</p>
      </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Classes"
              value={isLoading ? '...' : '0'}
              icon={FiBook}
              color="blue"
            />
            <StatsCard
              title="This Week"
              value={isLoading ? '...' : '0'}
              icon={FiCalendar}
              color="green"
            />
            <StatsCard
              title="Hours/Week"
              value={isLoading ? '...' : teacherData?.weeklyHoursLimit || '0'}
              icon={FiClock}
              color="orange"
            />
            <StatsCard
              title="Completed"
              value={isLoading ? '...' : '0'}
              icon={FiCheckCircle}
              color="purple"
            />
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's Schedule */}
            <Card>
              <h3 className="card-header">Today's Schedule</h3>
              <div className="flex items-center justify-center p-8 text-center">
                <div>
                  <FiInfo className="mx-auto text-4xl text-gray-400 mb-3" />
                  <p className="text-gray-600 mb-2">No classes scheduled yet</p>
                  <p className="text-sm text-gray-500">
                    Timetable will be generated in Phase 2
                  </p>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card>
              <h3 className="card-header">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'View Timetable', icon: '📅', color: 'bg-blue-50 text-blue-700' },
                  { label: 'Update Availability', icon: '⏰', color: 'bg-green-50 text-green-700' },
                  { label: 'My Courses', icon: '📚', color: 'bg-purple-50 text-purple-700' },
                  { label: 'Profile Settings', icon: '⚙️', color: 'bg-orange-50 text-orange-700' },
                ].map((action, index) => (
                  <button
                    key={index}
                    className={`${action.color} p-4 rounded-lg hover:shadow-md transition-all text-left`}
                  >
                    <div className="text-2xl mb-2">{action.icon}</div>
                    <p className="font-medium text-sm">{action.label}</p>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Upcoming Classes */}
          <Card className="mt-6">
            <h3 className="card-header">Upcoming This Week</h3>
            <div className="flex items-center justify-center p-12 text-center">
              <div>
                <FiCalendar className="mx-auto text-5xl text-gray-400 mb-4" />
                <p className="text-lg text-gray-600 mb-2">No timetable generated yet</p>
                <p className="text-sm text-gray-500">
                  The timetable generation feature will be available in Phase 2 of the project.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  For now, you can manage your availability and profile settings.
                </p>
              </div>
            </div>
          </Card>
    </div>
  );
};
