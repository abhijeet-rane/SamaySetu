import React, { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiBriefcase, FiLock, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuthStore } from '../../store/authStore';

export const ProfilePage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: user?.email || '',
    phone: '1234567890',
    employeeId: 'EMP001',
    specialization: 'Computer Science',
    weeklyHoursLimit: '25',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
        <p className="text-gray-600">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture */}
        <Card>
          <div className="text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-primary-800 to-primary-900 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold">
              {profileData.name.charAt(0)}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{profileData.name}</h3>
            <p className="text-gray-600 mb-2">{profileData.email}</p>
            <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
              {user?.role}
            </span>
          </div>
        </Card>

        {/* Profile Information */}
        <Card className="lg:col-span-2">
          <h3 className="card-header">Personal Information</h3>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                icon={<FiUser />}
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              />
              <Input
                label="Employee ID"
                icon={<FiBriefcase />}
                value={profileData.employeeId}
                disabled
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              icon={<FiMail />}
              value={profileData.email}
              disabled
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                icon={<FiPhone />}
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              />
              <Input
                label="Weekly Hours Limit"
                type="number"
                value={profileData.weeklyHoursLimit}
                onChange={(e) => setProfileData({ ...profileData, weeklyHoursLimit: e.target.value })}
              />
            </div>

            <Input
              label="Specialization"
              icon={<FiBriefcase />}
              value={profileData.specialization}
              onChange={(e) => setProfileData({ ...profileData, specialization: e.target.value })}
            />

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="flex items-center gap-2"
            >
              <FiSave /> Save Changes
            </Button>
          </form>
        </Card>
      </div>

      {/* Change Password */}
      <Card className="mt-6">
        <h3 className="card-header">Change Password</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-2xl">
          <Input
            label="Current Password"
            type="password"
            icon={<FiLock />}
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
            placeholder="Enter current password"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="New Password"
              type="password"
              icon={<FiLock />}
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              placeholder="Enter new password"
            />
            <Input
              label="Confirm New Password"
              type="password"
              icon={<FiLock />}
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              placeholder="Confirm new password"
            />
          </div>

          <Button
            type="submit"
            variant="secondary"
            isLoading={isLoading}
            className="flex items-center gap-2"
          >
            <FiLock /> Change Password
          </Button>
        </form>
      </Card>

      {/* Account Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary-800 mb-1">24</p>
            <p className="text-sm text-gray-600">Classes/Week</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600 mb-1">5</p>
            <p className="text-sm text-gray-600">Courses</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600 mb-1">3</p>
            <p className="text-sm text-gray-600">Divisions</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600 mb-1">16</p>
            <p className="text-sm text-gray-600">Hours/Week</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
