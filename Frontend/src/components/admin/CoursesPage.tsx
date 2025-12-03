import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiBook } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { courseAPI, departmentAPI } from '../../services/api';
import { Modal } from '../common/Modal';

export const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    courseType: 'theory',
    credits: '',
    hoursPerWeek: '',
    departmentId: '',
    semester: '1',
    description: '',
  });
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    fetchCourses();
    fetchDepartments();
  }, []);

  const fetchCourses = async () => {
    // Mock data
    setCourses([
      { id: 1, name: 'Data Structures', code: 'CS301', courseType: 'theory', credits: 4, hoursPerWeek: 4, semester: 3, department: { name: 'Computer Science' } },
      { id: 2, name: 'Database Lab', code: 'CS302L', courseType: 'lab', credits: 2, hoursPerWeek: 4, semester: 3, department: { name: 'Computer Science' } },
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
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.code) newErrors.code = 'Code is required';
    if (!formData.credits) newErrors.credits = 'Credits is required';
    if (!formData.hoursPerWeek) newErrors.hoursPerWeek = 'Hours per week is required';
    if (!formData.departmentId) newErrors.departmentId = 'Department is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await courseAPI.create({
        ...formData,
        credits: parseInt(formData.credits),
        hoursPerWeek: parseInt(formData.hoursPerWeek),
        semester: parseInt(formData.semester),
        departmentId: parseInt(formData.departmentId),
      });
      toast.success('Course created successfully!');
      setShowModal(false);
      setFormData({
        name: '',
        code: '',
        courseType: 'theory',
        credits: '',
        hoursPerWeek: '',
        departmentId: '',
        semester: '1',
        description: '',
      });
      fetchCourses();
    } catch (error: any) {
      toast.error(error.response?.data || 'Failed to create course');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-600 mt-1">Manage courses and subjects</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2"
        >
          <FiPlus /> Add Course
        </Button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} hover>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${course.courseType === 'lab' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                  <FiBook size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{course.name}</h3>
                  <p className="text-sm text-gray-600">{course.code}</p>
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
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  course.courseType === 'lab' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {course.courseType.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Credits:</span>
                <span className="font-medium">{course.credits}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Hours/Week:</span>
                <span className="font-medium">{course.hoursPerWeek}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Semester:</span>
                <span className="font-medium">{course.semester}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Department:</span>
                <span className="font-medium text-xs">{course.department.name}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Course Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add New Course"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Course Name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                setErrors({ ...errors, name: '' });
              }}
              error={errors.name}
              placeholder="Data Structures"
            />

            <Input
              label="Course Code"
              value={formData.code}
              onChange={(e) => {
                setFormData({ ...formData, code: e.target.value });
                setErrors({ ...errors, code: '' });
              }}
              error={errors.code}
              placeholder="CS301"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Type
              </label>
              <select
                value={formData.courseType}
                onChange={(e) => setFormData({ ...formData, courseType: e.target.value })}
                className="input-field"
              >
                <option value="theory">Theory</option>
                <option value="lab">Lab</option>
              </select>
            </div>

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
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Credits"
              type="number"
              value={formData.credits}
              onChange={(e) => {
                setFormData({ ...formData, credits: e.target.value });
                setErrors({ ...errors, credits: '' });
              }}
              error={errors.credits}
              placeholder="4"
              min="1"
            />

            <Input
              label="Hours/Week"
              type="number"
              value={formData.hoursPerWeek}
              onChange={(e) => {
                setFormData({ ...formData, hoursPerWeek: e.target.value });
                setErrors({ ...errors, hoursPerWeek: '' });
              }}
              error={errors.hoursPerWeek}
              placeholder="4"
              min="1"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semester
              </label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="input-field"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
              rows={3}
              placeholder="Course description..."
            />
          </div>

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
              Create Course
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
