import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiClock, FiCoffee } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Modal } from '../common/Modal';
import { timeSlotAPI } from '../../services/api';
import { getErrorMessage } from '../../utils/errorHandler';

export const TimeSlotsPage: React.FC = () => {
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState<any>(null);
  const [formData, setFormData] = useState({ slotName: '', startTime: '', endTime: '', isBreak: false, type: 'TYPE_1' });
  const [errors, setErrors] = useState<any>({});

  useEffect(() => { fetchTimeSlots(); }, []);

  const fetchTimeSlots = async () => {
    try {
      const response = await timeSlotAPI.getAll();
      setTimeSlots(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error('Failed to fetch time slots');
    }
  };

  const handleEdit = (slot: any) => {
    setEditingSlot(slot);
    setFormData({ slotName: slot.slotName, startTime: slot.startTime, endTime: slot.endTime, isBreak: slot.isBreak, type: slot.type || 'TYPE_1' });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({ slotName: '', startTime: '', endTime: '', isBreak: false, type: 'TYPE_1' });
    setEditingSlot(null);
    setErrors({});
  };

  const calculateDuration = (start: string, end: string) => {
    if (!start || !end) return 0;
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    return (endHour * 60 + endMin) - (startHour * 60 + startMin);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: any = {};
    if (!formData.slotName) newErrors.slotName = 'Required';
    if (!formData.startTime) newErrors.startTime = 'Required';
    if (!formData.endTime) newErrors.endTime = 'Required';
    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) newErrors.endTime = 'Must be after start';
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setIsLoading(true);
    try {
      const slotData = { ...formData, durationMinutes: calculateDuration(formData.startTime, formData.endTime) };
      if (editingSlot) { await timeSlotAPI.update(editingSlot.id, slotData); toast.success('Updated!'); }
      else { await timeSlotAPI.create(slotData); toast.success('Created!'); }
      setShowModal(false);
      resetForm();
      fetchTimeSlots();
    } catch (error: any) { toast.error(getErrorMessage(error)); }
    finally { setIsLoading(false); }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try { await timeSlotAPI.delete(id); toast.success('Deleted!'); fetchTimeSlots(); }
    catch (error: any) { toast.error(getErrorMessage(error)); }
  };

  const formatTime = (time: string) => {
    const [hour, min] = time.split(':');
    const h = parseInt(hour);
    return `${h > 12 ? h - 12 : h === 0 ? 12 : h}:${min} ${h >= 12 ? 'PM' : 'AM'}`;
  };

  const type1Slots = timeSlots.filter(s => s.type === 'TYPE_1' || !s.type).sort((a, b) => a.startTime.localeCompare(b.startTime));
  const type2Slots = timeSlots.filter(s => s.type === 'TYPE_2').sort((a, b) => a.startTime.localeCompare(b.startTime));

  const SlotRow = ({ slot }: { slot: any }) => (
    <div className={`flex items-center gap-4 p-3 rounded-lg border ${slot.isBreak ? 'bg-orange-50 border-orange-200' : slot.type === 'TYPE_2' ? 'bg-purple-50 border-purple-200' : 'bg-blue-50 border-blue-200'}`}>
      <div className={`p-2 rounded-lg ${slot.isBreak ? 'bg-orange-100 text-orange-600' : slot.type === 'TYPE_2' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
        {slot.isBreak ? <FiCoffee size={18} /> : <FiClock size={18} />}
      </div>
      <div className="w-28 text-sm font-medium text-gray-700">{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</div>
      <div className="flex-1">
        <span className="font-medium text-gray-900">{slot.slotName}</span>
        {slot.isBreak && <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs">Break</span>}
      </div>
      <span className="text-sm text-gray-500">{slot.durationMinutes} min</span>
      <div className="flex gap-1">
        <button onClick={() => handleEdit(slot)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded"><FiEdit2 size={16} /></button>
        <button onClick={() => handleDelete(slot.id, slot.slotName)} className="p-1.5 text-red-600 hover:bg-red-100 rounded"><FiTrash2 size={16} /></button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Time Slots</h1>
          <p className="text-gray-600 mt-1">Manage class periods with different slot types for overlapping schedules</p>
        </div>
        <Button variant="primary" onClick={() => { resetForm(); setShowModal(true); }} className="flex items-center gap-2">
          <FiPlus /> Add Time Slot
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
            <h3 className="text-lg font-bold text-gray-900">Schedule 1</h3>
            <span className="text-sm text-gray-500">({type1Slots.length} slots)</span>
          </div>
          <div className="space-y-2">
            {type1Slots.length === 0 ? (
              <p className="text-gray-500 text-center py-6">No Schedule 1 slots defined</p>
            ) : (
              type1Slots.map((slot) => <SlotRow key={slot.id} slot={slot} />)
            )}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
            <h3 className="text-lg font-bold text-gray-900">Schedule 2</h3>
            <span className="text-sm text-gray-500">({type2Slots.length} slots)</span>
          </div>
          <div className="space-y-2">
            {type2Slots.length === 0 ? (
              <p className="text-gray-500 text-center py-6">No Schedule 2 slots defined</p>
            ) : (
              type2Slots.map((slot) => <SlotRow key={slot.id} slot={slot} />)
            )}
          </div>
        </Card>
      </div>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); resetForm(); }} title={editingSlot ? "Edit Time Slot" : "Add Time Slot"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Slot Name" value={formData.slotName} onChange={(e) => { setFormData({ ...formData, slotName: e.target.value }); setErrors({ ...errors, slotName: '' }); }} error={errors.slotName} placeholder="Period 1" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Time" type="time" value={formData.startTime} onChange={(e) => { setFormData({ ...formData, startTime: e.target.value }); setErrors({ ...errors, startTime: '' }); }} error={errors.startTime} />
            <Input label="End Time" type="time" value={formData.endTime} onChange={(e) => { setFormData({ ...formData, endTime: e.target.value }); setErrors({ ...errors, endTime: '' }); }} error={errors.endTime} />
          </div>
          {formData.startTime && formData.endTime && formData.startTime < formData.endTime && (
            <div className="p-2 bg-gray-50 rounded text-sm text-gray-600">Duration: {calculateDuration(formData.startTime, formData.endTime)} minutes</div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Schedule Type</label>
            <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="input-field">
              <option value="TYPE_1">Schedule 1</option>
              <option value="TYPE_2">Schedule 2</option>
            </select>
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={formData.isBreak} onChange={(e) => setFormData({ ...formData, isBreak: e.target.checked })} className="w-4 h-4 text-primary-600 rounded" />
            <span className="text-sm text-gray-700">This is a break period</span>
          </label>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
            <Button type="submit" variant="primary" isLoading={isLoading} className="flex-1">{editingSlot ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
