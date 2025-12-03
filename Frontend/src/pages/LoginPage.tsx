import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { authAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import logo from '../assets/logo.png';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors: any = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Validate college email
    if (!formData.email.endsWith('@mitaoe.ac.in')) {
      toast.error('Please use your college email (@mitaoe.ac.in)', { duration: 5000 });
      setErrors({ email: 'Only college email addresses are allowed' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await authAPI.login(formData);
      const { email, token, role } = response.data;
      
      // Extract name from email (before @)
      const name = email.split('@')[0].replace(/\./g, ' ').replace(/\d+/g, '').trim();
      
      login({ email, token, role, name });
      toast.success('Login successful!');
      
      // Navigate based on role
      if (role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      let message = 'Login failed. Please check your credentials.';
      
      // Handle specific error cases
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 401) {
          message = '❌ Incorrect password. Please try again.';
        } else if (status === 404) {
          message = '❌ Account not found. Please check your email or register.';
        } else if (status === 403) {
          if (typeof data === 'string' && data.toLowerCase().includes('verify')) {
            message = '⚠️ Email not verified. Please check your inbox and verify your email.';
          } else {
            message = '⚠️ Account not verified. Please verify your email first.';
          }
        } else if (typeof data === 'string') {
          message = data;
        } else if (data.message) {
          message = data.message;
        }
      } else if (error.message) {
        message = error.message;
      }
      
      toast.error(message, { duration: 6000 });
      setErrors({ email: ' ', password: ' ' }); // Show error state on inputs
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
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <img src={logo} alt="MIT AOE" className="h-20 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-primary-900">SamaySetu</h1>
            <p className="text-gray-600 mt-2">Timetable Management System</p>
            <p className="text-sm text-gray-500 mt-1">MIT Academy of Engineering</p>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={<FiMail />}
              placeholder="your.email@mitaoe.ac.in"
              autoComplete="email"
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                icon={<FiLock />}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 rounded" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-primary-800 hover:text-primary-900 font-medium"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-primary-800 hover:text-primary-900 font-medium"
              >
                Register Now
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>© 2025 MIT Academy of Engineering</p>
            <p className="mt-1">Alandi(D), Pune - 412 105, Maharashtra (India)</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
