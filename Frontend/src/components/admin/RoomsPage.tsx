import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiHome } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { roomAPI, departmentAPI } from '../../services/api';
import { Modal } from '../common/Modal';

export const RoomsPage: React.FC = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    roomNumber: '',
    capacity: '',
    roomType: 'classroom',
    departmentId: '',
    hasProjector: false,
    hasAc: false,
    equipment: '',
  });
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    fetchRooms();
    fetchDepartments();
  }, []);

  const fetchRooms = async () => {
    // Mock data
    setRooms([
      { id: 1, name: 'Room 101', roomNumber: '101', capacity: 60, roomType: 'classroom', hasProjector: true, hasAc: true, department: { name: 'Computer Science' } },
      { id: 2, name: 'Lab 1', roomNumber: 'L1', capacity: 30, roomType: 'lab', hasProjector: true, hasAc: false, department: { name: 'Computer Science' } },
      { id: 3, name: 'Auditorium', roomNumber: 'AUD', capacity: 200, roomType: 'auditorium', hasProjector: true, hasAc: true, department: { name: 'General' } },
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
    if (!formData.roomNumber) newErrors.roomNumber = 'Room number is required';
    if (!formData.capacity) newErrors.capacity = 'Capacity is required';
    if (!formData.departmentId) newErrors.departmentId = 'Department is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await roomAPI.create({
        ...formData,
        capacity: parseInt(formData.capacity),
        departmentId: parseInt(formData.departmentId),
      });
      toast.success('Room created successfully!');
      setShowModal(false);
      setFormData({
        name: '',
        roomNumber: '',
        capacity: '',
        roomType: 'classroom',
        departmentId: '',
        hasProjector: false,
        hasAc: false,
        equipment: '',
      });
      fetchRooms();
    } catch (error: any) {
      toast.error(error.response?.data || 'Failed to create room');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoomTypeColor = (type: string) => {
    switch (type) {
      case 'lab': return 'bg-purple-100 text-purple-800';
      case 'auditorium': return 'bg-orange-100 text-orange-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getRoomTypeIcon = (type: string) => {
    switch (type) {
      case 'lab': return '🔬';
      case 'auditorium': return '🎭';
      default: return '🏫';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rooms</h1>
          <p className="text-gray-600 mt-1">Manage classrooms, labs, and auditoriums</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2"
        >
          <FiPlus /> Add Room
        </Button>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <Card key={room.id} hover>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start gap-3">
                <div className="text-3xl">
                  {getRoomTypeIcon(room.roomType)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{room.name}</h3>
                  <p className="text-sm text-gray-600">Room #{room.roomNumber}</p>
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
                <span className="text-gray-600">Type:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoomTypeColor(room.roomType)}`}>
                  {room.roomType.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Capacity:</span>
                <span className="font-medium">{room.capacity} students</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Department:</span>
                <span className="font-medium text-xs">{room.department.name}</span>
              </div>
              <div className="flex gap-2 mt-3">
                {room.hasProjector && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                    📽️ Projector
                  </span>
                )}
                {room.hasAc && (
                  <span className="px-2 py-1 bg-cyan-100 text-cyan-800 rounded text-xs">
                    ❄️ AC
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Room Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add New Room"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Room Name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                setErrors({ ...errors, name: '' });
              }}
              error={errors.name}
              placeholder="Room 101"
            />

            <Input
              label="Room Number"
              value={formData.roomNumber}
              onChange={(e) => {
                setFormData({ ...formData, roomNumber: e.target.value });
                setErrors({ ...errors, roomNumber: '' });
              }}
              error={errors.roomNumber}
              placeholder="101"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Type
              </label>
              <select
                value={formData.roomType}
                onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                className="input-field"
              >
                <option value="classroom">Classroom</option>
                <option value="lab">Lab</option>
                <option value="auditorium">Auditorium</option>
              </select>
            </div>

            <Input
              label="Capacity"
              type="number"
              value={formData.capacity}
              onChange={(e) => {
                setFormData({ ...formData, capacity: e.target.value });
                setErrors({ ...errors, capacity: '' });
              }}
              error={errors.capacity}
              placeholder="60"
              min="1"
            />
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

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Facilities
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.hasProjector}
                  onChange={(e) => setFormData({ ...formData, hasProjector: e.target.checked })}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Projector</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.hasAc}
                  onChange={(e) => setFormData({ ...formData, hasAc: e.target.checked })}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Air Conditioning</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Equipment (Optional)
            </label>
            <textarea
              value={formData.equipment}
              onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
              className="input-field"
              rows={2}
              placeholder="Whiteboard, Smart board, etc."
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
              Create Room
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
