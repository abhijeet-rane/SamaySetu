import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { authAPI } from '../services/api';
import logo from '../assets/logo.png';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }

    // Validate college email
    if (!email.endsWith('@mitaoe.ac.in')) {
      setError('Only college email addresses are allowed');
      toast.error('Please use your college email (@mitaoe.ac.in)', { duration: 5000 });
      return;
    }

    setIsLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setIsSubmitted(true);
      toast.success('Password reset link sent to your email!');
    } catch (error: any) {
      let message = 'Failed to send reset link. Please try again.';
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 404) {
          message = '❌ Account not found. Please check your email or register.';
        } else if (typeof data === 'string') {
          message = data;
        } else if (data.message) {
          message = data.message;
        }
      }
      
      setError(message);
      toast.error(message, { duration: 5000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-strong p-8">
          <div className="text-center mb-8">
            <img src={logo} alt="MIT AOE" className="h-16 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-primary-900">Forgot Password?</h1>
            <p className="text-gray-600 mt-2">
              {isSubmitted 
                ? 'Check your email for reset instructions'
                : 'Enter your email to receive a password reset link'
              }
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="College Email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                error={error}
                icon={<FiMail />}
                placeholder="your.email@mitaoe.ac.in"
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                isLoading={isLoading}
              >
                Send Reset Link
              </Button>

              <Link
                to="/login"
                className="flex items-center justify-center gap-2 text-primary-800 hover:text-primary-900 font-medium"
              >
                <FiArrowLeft />
                Back to Login
              </Link>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
                <p className="font-medium">✉️ Email Sent!</p>
                <p className="text-sm mt-1">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
              </div>

              <p className="text-sm text-gray-600">
                Didn't receive the email? Check your spam folder or{' '}
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-primary-800 hover:text-primary-900 font-medium"
                >
                  try again
                </button>
              </p>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-primary-800 hover:text-primary-900 font-medium"
              >
                <FiArrowLeft />
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
