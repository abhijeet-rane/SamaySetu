import React, { useState } from 'react';
import { FiUpload, FiDownload, FiUsers, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Button } from '../common/Button';
import { adminAPI } from '../../services/api';

export const StaffUploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
      } else {
        toast.error('Please upload a CSV file');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
      } else {
        toast.error('Please upload a CSV file');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a CSV file');
      return;
    }

    setIsUploading(true);
    try {
      const response = await adminAPI.uploadStaff(file);
      toast.success(response.data);
      setFile(null);
    } catch (error: any) {
      console.error('Upload error:', error);
      let message = 'Upload failed. Please try again.';
      
      if (error.response) {
        const data = error.response.data;
        if (typeof data === 'string') {
          message = data;
        } else if (data.message) {
          message = data.message;
        }
      }
      
      toast.error(message);
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const response = await adminAPI.downloadStaffTemplate();
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'staff_template.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('Template downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download template. Please try again.');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Management</h1>
        <p className="text-gray-600">Upload CSV file to add new staff members</p>
      </div>

      {/* Instructions Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6"
      >
        <div className="flex items-start gap-3">
          <FiAlertCircle className="text-blue-600 mt-1" size={20} />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Important Information</h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• All new staff will receive default password: <code className="bg-blue-100 px-1 rounded">mitaoe@123</code></li>
              <li>• Staff must change password on first login</li>
              <li>• Email addresses must end with @mitaoe.ac.in</li>
              <li>• Employee IDs must be unique</li>
              <li>• Weekly hours: Min (1-40), Max (1-50), Max ≥ Min</li>
            </ul>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiUpload className="text-primary-600" />
            Upload Staff CSV
          </h2>

          {/* Drag & Drop Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:border-primary-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <FiUsers className="mx-auto text-4xl text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">
              Drag and drop your CSV file here, or
            </p>
            <label className="inline-block">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <span className="text-primary-600 hover:text-primary-700 cursor-pointer font-medium">
                browse files
              </span>
            </label>
          </div>

          {/* Selected File */}
          {file && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Selected:</strong> {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </p>
            </div>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={!file || isUploading}
            isLoading={isUploading}
            className="w-full mt-4"
            variant="primary"
          >
            {isUploading ? 'Uploading...' : 'Upload Staff Data'}
          </Button>
        </motion.div>

        {/* Template Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FiDownload className="text-green-600" />
            CSV Template
          </h2>

          <div className="space-y-4">
            <p className="text-gray-600">
              Download the template to ensure your CSV file has the correct format.
            </p>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Required Columns:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>1. Name</li>
                <li>2. Employee ID</li>
                <li>3. Email</li>
                <li>4. Phone</li>
                <li>5. Specialization</li>
                <li>6. Min Weekly Hours</li>
                <li>7. Max Weekly Hours</li>
              </ul>
            </div>

            <Button
              onClick={downloadTemplate}
              variant="outline"
              className="w-full"
            >
              <FiDownload className="mr-2" />
              Download Template
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};