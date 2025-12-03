import React, { useState } from 'react';
import { FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';
import { Card } from '../../components/common/Card';

export const TimetablePage: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState('current');

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

  // Sample timetable data with year information
  const timetable: any = {
    Monday: {
      '09:00 - 10:00': { subject: 'Data Structures', room: 'CS-101', division: 'A', year: 'SE' },
      '10:00 - 11:00': { subject: 'Algorithms', room: 'CS-102', division: 'B', year: 'TE' },
      '02:00 - 03:00': { subject: 'Database Systems', room: 'CS-103', division: 'A', year: 'TE' },
    },
    Tuesday: {
      '09:00 - 10:00': { subject: 'Operating Systems', room: 'CS-104', division: 'C', year: 'TE' },
      '11:00 - 12:00': { subject: 'Computer Networks', room: 'CS-105', division: 'A', year: 'BE' },
      '03:00 - 04:00': { subject: 'Data Structures Lab', room: 'CS-Lab1', division: 'A', year: 'SE' },
    },
    Wednesday: {
      '10:00 - 11:00': { subject: 'Software Engineering', room: 'CS-106', division: 'B', year: 'TE' },
      '02:00 - 03:00': { subject: 'Web Technologies', room: 'CS-107', division: 'A', year: 'BE' },
    },
    Thursday: {
      '09:00 - 10:00': { subject: 'Data Structures', room: 'CS-101', division: 'B', year: 'SE' },
      '11:00 - 12:00': { subject: 'Algorithms', room: 'CS-102', division: 'A', year: 'TE' },
      '03:00 - 04:00': { subject: 'Database Systems', room: 'CS-103', division: 'C', year: 'TE' },
    },
    Friday: {
      '10:00 - 11:00': { subject: 'Operating Systems', room: 'CS-104', division: 'A', year: 'TE' },
      '02:00 - 03:00': { subject: 'Computer Networks', room: 'CS-105', division: 'B', year: 'BE' },
      '04:00 - 05:00': { subject: 'Project Work', room: 'CS-108', division: 'All', year: 'BE' },
    },
    Saturday: {
      '09:00 - 10:00': { subject: 'Seminar', room: 'Auditorium', division: 'All', year: 'All' },
    },
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Timetable</h1>
        <p className="text-gray-600">View your weekly class schedule</p>
      </div>

      {/* Week Selector */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setSelectedWeek('previous')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedWeek === 'previous'
              ? 'bg-primary-800 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Previous Week
        </button>
        <button
          onClick={() => setSelectedWeek('current')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedWeek === 'current'
              ? 'bg-primary-800 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Current Week
        </button>
        <button
          onClick={() => setSelectedWeek('next')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedWeek === 'next'
              ? 'bg-primary-800 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Next Week
        </button>
      </div>

      {/* Timetable Grid */}
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
                <tr key={slot} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-3 font-medium text-gray-700 bg-gray-50">
                    <div className="flex items-center gap-2">
                      <FiClock className="text-primary-800" />
                      {slot}
                    </div>
                  </td>
                  {days.map((day) => {
                    const classInfo = timetable[day]?.[slot];
                    return (
                      <td key={`${day}-${slot}`} className="border border-gray-300 p-2">
                        {classInfo ? (
                          <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-3 rounded-lg">
                            <p className="font-semibold text-primary-900 mb-1">
                              {classInfo.subject}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                              <FiMapPin size={12} />
                              <span>{classInfo.room}</span>
                            </div>
                            <div className="flex gap-1">
                              <span className="inline-block px-2 py-1 bg-primary-800 text-white text-xs rounded">
                                {classInfo.year}
                              </span>
                              <span className="inline-block px-2 py-1 bg-primary-800 text-white text-xs rounded">
                                Div {classInfo.division}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center text-gray-400 py-4">-</div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card>
          <div className="text-center">
            <FiCalendar className="w-12 h-12 text-primary-800 mx-auto mb-3" />
            <p className="text-3xl font-bold text-gray-900 mb-1">24</p>
            <p className="text-gray-600">Total Classes/Week</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <FiClock className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <p className="text-3xl font-bold text-gray-900 mb-1">16</p>
            <p className="text-gray-600">Hours/Week</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <FiMapPin className="w-12 h-12 text-orange-600 mx-auto mb-3" />
            <p className="text-3xl font-bold text-gray-900 mb-1">8</p>
            <p className="text-gray-600">Different Rooms</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
