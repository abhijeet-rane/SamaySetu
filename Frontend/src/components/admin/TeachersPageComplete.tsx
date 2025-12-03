import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiMail, FiPhone } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Modal } from '../common/Modal';
import { teacherAPI } from '../../services/api';

export const TeachersPageComplete: React.FC = () => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    email: '',
    phone: '',
    password: '',
    specialization: '',
    weeklyHoursLimit: '25',
  });
  const [errors, setErrors] = useState<any>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: any = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.employeeId) newErrors.employeeId = 'Employee ID is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await teacherAPI.create(formData);
      toast.success('Teacher created successfully!');
      setShowModal(false);
      setFormData({
        name: '',
        employeeId: '',
        email: '',
        phone: '',
        password: '',
        specialization: '',
        weeklyHoursLimit: '25',
      });
      // Refresh list
    } catch (error: any) {
      toast.error(error.response?.data || 'Failed to create teacher');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teachers</h1>
          <p className="text-gray-600 mt-1">Manage teaching staff</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2"
        >
          <FiPlus /> Add Teacher
        </Button>
      </div>

      {/* Teachers Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Employee ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Phone</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Specialization</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 1, name: 'Dr. John Smith', employeeId: 'EMP001', email: 'john@mitaoe.ac.in', phone: '1234567890', specialization: 'Data Structures' },
                { id: 2, name: 'Prof. Jane Doe', employeeId: 'EMP002', email: 'jane@mitaoe.ac.in', phone: '9876543210', specialization: 'Algorithms' },
              ].map((teacher) => (
                <tr key={teacher.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{teacher.name}</td>
                  <td className="py-3 px-4 text-gray-600">{teacher.employeeId}</td>
                  <td className="py-3 px-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <FiMail size={14} />
                      {teacher.email}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <FiPhone size={14} />
                      {teacher.phone}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{teacher.specialization}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <FiEdit2 size={18} />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Teacher Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add New Teacher"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                setErrors({ ...errors, name: '' });
              }}
              error={errors.name}
              placeholder="Dr. John Smith"
            />

            <Input
              label="Employee ID"
              value={formData.employeeId}
              onChange={(e) => {
                setFormData({ ...formData, employeeId: e.target.value });
                setErrors({ ...errors, employeeId: '' });
              }}
              error={errors.employeeId}
              placeholder="EMP001"
            />
          </div>

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              setErrors({ ...errors, email: '' });
            }}
            error={errors.email}
            placeholder="teacher@mitaoe.ac.in"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="1234567890"
            />

            <Input
              label="Weekly Hours Limit"
              type="number"
              value={formData.weeklyHoursLimit}
              onChange={(e) => setFormData({ ...formData, weeklyHoursLimit: e.target.value })}
            />
          </div>

          <Input
            label="Specialization"
            value={formData.specialization}
            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
            placeholder="Data Structures, Algorithms"
          />

          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              setErrors({ ...errors, password: '' });
            }}
            error={errors.password}
            placeholder="Temporary password"
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="flex-1"
            >
              Create Teacher
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
