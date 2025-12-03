import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { authAPI } from '../services/api';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/Loading';
import logo from '../assets/logo.png';

export const VerifyEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }

    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      await authAPI.verifyEmail(token!);
      setStatus('success');
      setMessage('Email verified successfully! You can now login.');
    } catch (error: any) {
      setStatus('error');
      setMessage(error.response?.data || 'Verification failed. The link may have expired.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-strong p-8 text-center">
          <img src={logo} alt="MIT AOE" className="h-16 mx-auto mb-6" />
          
          {status === 'loading' && (
            <div className="py-8">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-600">Verifying your email...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="py-4">
              <FiCheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <Button
                variant="primary"
                className="w-full"
                onClick={() => navigate('/login')}
              >
                Go to Login
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="py-4">
              <FiXCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="space-y-3">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => navigate('/register')}
                >
                  Register Again
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/login')}
                >
                  Back to Login
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
