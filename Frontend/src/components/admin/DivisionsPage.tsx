import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiUsers } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { divisionAPI, departmentAPI } from '../../services/api';
import { Modal } from '../common/Modal';

export const DivisionsPage: React.FC = () => {
  const [divisions, setDivisions] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    year: '1',
    branch: '',
    departmentId: '',
    academicYearId: '1',
    totalStudents: '',
  });
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    fetchDivisions();
    fetchDepartments();
  }, []);

  const fetchDivisions = async () => {
    // Mock data
    setDivisions([
      { id: 1, name: 'A', year: 2, branch: 'Computer Science', totalStudents: 60, department: { name: 'Computer Science' }, academicYear: { yearName: '2024-25' } },
      { id: 2, name: 'B', year: 2, branch: 'Computer Science', totalStudents: 58, department: { name: 'Computer Science' }, academicYear: { yearName: '2024-25' } },
      { id: 3, name: 'A', year: 3, branch: 'Information Technology', totalStudents: 55, department: { name: 'Information Technology' }, academicYear: { yearName: '2024-25' } },
    ]);
  };

  const fetchDepartments = async () => {
    try {
      const response = await departmentAPI.getAll();
      setDepartments(response.data);
    } catch (error) {
      console.error('Failed to fetch departments');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: any = {};
    if (!formData.name) newErrors.name = 'Division name is required';
    if (!formData.branch) newErrors.branch = 'Branch is required';
    if (!formData.departmentId) newErrors.departmentId = 'Department is required';
    if (!formData.totalStudents) newErrors.totalStudents = 'Total students is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await divisionAPI.create({
        ...formData,
        year: parseInt(formData.year),
        departmentId: parseInt(formData.departmentId),
        academicYearId: parseInt(formData.academicYearId),
        totalStudents: parseInt(formData.totalStudents),
      });
      toast.success('Division created successfully!');
      setShowModal(false);
      setFormData({
        name: '',
        year: '1',
        branch: '',
        departmentId: '',
        academicYearId: '1',
        totalStudents: '',
      });
      fetchDivisions();
    } catch (error: any) {
      toast.error(error.response?.data || 'Failed to create division');
    } finally {
      setIsLoading(false);
    }
  };

  const getYearLabel = (year: number) => {
    switch (year) {
      case 1: return 'FE (First Year)';
      case 2: return 'SE (Second Year)';
      case 3: return 'TE (Third Year)';
      case 4: return 'BE (Final Year)';
      default: return `Year ${year}`;
    }
  };

  const getYearColor = (year: number) => {
    switch (year) {
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-blue-100 text-blue-800';
      case 3: return 'bg-purple-100 text-purple-800';
      case 4: return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Divisions</h1>
          <p className="text-gray-600 mt-1">Manage student divisions and sections</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2"
        >
          <FiPlus /> Add Division
        </Button>
      </div>

      {/* Divisions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {divisions.map((division) => (
          <Card key={division.id} hover>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-primary-100 text-primary-600 rounded-lg">
                  <FiUsers size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {getYearLabel(division.year).split(' ')[0]}-{division.name}
                  </h3>
                  <p className="text-sm text-gray-600">{division.branch}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                  <FiEdit2 size={18} />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Year:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getYearColor(division.year)}`}>
                  {getYearLabel(division.year)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Students:</span>
                <span className="font-medium">{division.totalStudents}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Department:</span>
                <span className="font-medium text-xs">{division.department.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Academic Year:</span>
                <span className="font-medium text-xs">{division.academicYear.yearName}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Division Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add New Division"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Division Name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value.toUpperCase() });
                setErrors({ ...errors, name: '' });
              }}
              error={errors.name}
              placeholder="A"
              maxLength={2}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="input-field"
              >
                <option value="1">FE (First Year)</option>
                <option value="2">SE (Second Year)</option>
                <option value="3">TE (Third Year)</option>
                <option value="4">BE (Final Year)</option>
              </select>
            </div>
          </div>

          <Input
            label="Branch"
            value={formData.branch}
            onChange={(e) => {
              setFormData({ ...formData, branch: e.target.value });
              setErrors({ ...errors, branch: '' });
            }}
            error={errors.branch}
            placeholder="Computer Science"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <select
              value={formData.departmentId}
              onChange={(e) => {
                setFormData({ ...formData, departmentId: e.target.value });
                setErrors({ ...errors, departmentId: '' });
              }}
              className={`input-field ${errors.departmentId ? 'input-error' : ''}`}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
            {errors.departmentId && (
              <p className="mt-1 text-sm text-red-600">{errors.departmentId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Academic Year
            </label>
            <select
              value={formData.academicYearId}
              onChange={(e) => setFormData({ ...formData, academicYearId: e.target.value })}
              className="input-field"
            >
              <option value="1">2024-25 (Current)</option>
              <option value="2">2023-24</option>
            </select>
          </div>

          <Input
            label="Total Students"
            type="number"
            value={formData.totalStudents}
            onChange={(e) => {
              setFormData({ ...formData, totalStudents: e.target.value });
              setErrors({ ...errors, totalStudents: '' });
            }}
            error={errors.totalStudents}
            placeholder="60"
            min="1"
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
              Create Division
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
