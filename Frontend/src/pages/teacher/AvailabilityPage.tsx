import React, { useState } from 'react';
import { FiCheck, FiX, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export const AvailabilityPage: React.FC = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = [
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '12:00 - 01:00',
    '02:00 - 03:00',
    '03:00 - 04:00',
    '04:00 - 05:00',
  ];

  const [availability, setAvailability] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const toggleAvailability = (day: string, slot: string) => {
    const key = `${day}-${slot}`;
    setAvailability((prev: any) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Availability updated successfully!');
    } catch (error) {
      toast.error('Failed to update availability');
    } finally {
      setIsLoading(false);
    }
  };

  const isAvailable = (day: string, slot: string) => {
    return availability[`${day}-${slot}`] || false;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Availability Management</h1>
          <p className="text-gray-600">Mark your available time slots for scheduling</p>
        </div>
        <Button
          variant="primary"
          onClick={handleSave}
          isLoading={isLoading}
          className="flex items-center gap-2"
        >
          <FiSave /> Save Changes
        </Button>
      </div>

      {/* Instructions */}
      <Card className="mb-6 bg-blue-50 border border-blue-200">
        <div className="flex items-start gap-3">
          <div className="text-blue-600 text-2xl">ℹ️</div>
          <div>
            <p className="font-medium text-blue-900 mb-1">How to use:</p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Click on a time slot to mark yourself as available (green) or unavailable (red)</li>
              <li>• Green slots indicate you are available for classes</li>
              <li>• Red slots indicate you are not available</li>
              <li>• Don't forget to save your changes!</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Availability Grid */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-primary-800 text-white">
                <th className="border border-gray-300 p-3 text-left font-semibold">Time</th>
                {days.map((day) => (
                  <th key={day} className="border border-gray-300 p-3 text-center font-semibold">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((slot) => (
                <tr key={slot}>
                  <td className="border border-gray-300 p-3 font-medium text-gray-700 bg-gray-50">
                    {slot}
                  </td>
                  {days.map((day) => {
                    const available = isAvailable(day, slot);
                    return (
                      <td key={`${day}-${slot}`} className="border border-gray-300 p-2">
                        <button
                          onClick={() => toggleAvailability(day, slot)}
                          className={`w-full h-20 rounded-lg transition-all flex items-center justify-center ${
                            available
                              ? 'bg-green-100 hover:bg-green-200 border-2 border-green-500'
                              : 'bg-red-100 hover:bg-red-200 border-2 border-red-500'
                          }`}
                        >
                          {available ? (
                            <div className="text-center">
                              <FiCheck className="w-8 h-8 text-green-600 mx-auto mb-1" />
                              <span className="text-xs font-medium text-green-700">Available</span>
                            </div>
                          ) : (
                            <div className="text-center">
                              <FiX className="w-8 h-8 text-red-600 mx-auto mb-1" />
                              <span className="text-xs font-medium text-red-700">Not Available</span>
                            </div>
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Button
          variant="outline"
          onClick={() => {
            const allAvailable: any = {};
            days.forEach((day) => {
              timeSlots.forEach((slot) => {
                allAvailable[`${day}-${slot}`] = true;
              });
            });
            setAvailability(allAvailable);
            toast.success('Marked all slots as available');
          }}
          className="w-full"
        >
          Mark All Available
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setAvailability({});
            toast.success('Cleared all availability');
          }}
          className="w-full"
        >
          Clear All
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            const workingHours: any = {};
            days.forEach((day) => {
              ['09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '02:00 - 03:00', '03:00 - 04:00'].forEach((slot) => {
                workingHours[`${day}-${slot}`] = true;
              });
            });
            setAvailability(workingHours);
            toast.success('Set standard working hours');
          }}
          className="w-full"
        >
          Standard Hours (9-12, 2-4)
        </Button>
      </div>
    </div>
  );
};
