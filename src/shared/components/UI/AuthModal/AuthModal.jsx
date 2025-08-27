import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { close } from '../../../assets';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const { login, register } = useAuth();
  const { showSuccess, showError } = useToast();

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const result = await login(formData.username, formData.password);
        if (result.success) {
          showSuccess('Login successful!');
          onClose();
          setFormData({ username: '', email: '', password: '', confirmPassword: '' });
        } else {
          showError(result.error || 'Login failed');
        }
      } else {
        // Signup mode
        if (formData.password !== formData.confirmPassword) {
          showError('Passwords do not match');
          setIsLoading(false);
          return;
        }
        
        const result = await register(formData.username, formData.email, formData.password);
        if (result.success) {
          showSuccess('Registration successful!');
          setMode('login');
          setFormData({ username: '', email: '', password: '', confirmPassword: '' });
        } else {
          showError(result.error || 'Registration failed');
        }
      }
    } catch (error) {
      showError('An error occurred. Please try again.');
    }
    
    setIsLoading(false);
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setFormData({ username: '', email: '', password: '', confirmPassword: '' });
  };

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-2 xs:p-3 sm:p-4"
        onClick={onClose}
        style={{ 
          zIndex: 9999,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-tertiary rounded-xl p-4 xs:p-5 sm:p-6 w-full max-w-xs xs:max-w-sm sm:max-w-md relative border border-white/20 shadow-xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 xs:top-4 xs:right-4 w-7 h-7 xs:w-8 xs:h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            <img src={close} alt="close" className="w-4 h-4 xs:w-5 xs:h-5" />
          </button>

          {/* Header */}
          <div className="mb-4 xs:mb-5 sm:mb-6">
            <h2 className="text-white text-xl xs:text-xl sm:text-2xl font-bold mb-2">
              {mode === 'login' ? 'Login' : 'Sign Up'}
            </h2>
            <p className="text-secondary text-xs xs:text-sm">
              {mode === 'login' 
                ? 'Welcome back!' 
                : 'Create a new account to get started'
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 xs:space-y-3.5 sm:space-y-4">
            <div>
              <label className="block text-white text-xs xs:text-sm font-medium mb-1.5 xs:mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 xs:px-4 xs:py-3 bg-primary border border-white/20 rounded-lg text-white placeholder-secondary text-sm xs:text-base focus:outline-none focus:border-white/40 transition-colors"
                placeholder="Enter username"
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-white text-xs xs:text-sm font-medium mb-1.5 xs:mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 xs:px-4 xs:py-3 bg-primary border border-white/20 rounded-lg text-white placeholder-secondary text-sm xs:text-base focus:outline-none focus:border-white/40 transition-colors"
                  placeholder="Enter email"
                />
              </div>
            )}

            <div>
              <label className="block text-white text-xs xs:text-sm font-medium mb-1.5 xs:mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 xs:px-4 xs:py-3 bg-primary border border-white/20 rounded-lg text-white placeholder-secondary text-sm xs:text-base focus:outline-none focus:border-white/40 transition-colors"
                placeholder="Enter password"
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-white text-xs xs:text-sm font-medium mb-1.5 xs:mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 xs:px-4 xs:py-3 bg-primary border border-white/20 rounded-lg text-white placeholder-secondary text-sm xs:text-base focus:outline-none focus:border-white/40 transition-colors"
                  placeholder="Confirm password"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-primary py-2.5 xs:py-3 rounded-lg text-sm xs:text-base font-semibold hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Processing...' : (mode === 'login' ? 'Login' : 'Sign Up')}
            </button>
          </form>

          {/* Switch Mode */}
          <div className="mt-4 xs:mt-5 sm:mt-6 text-center">
            <p className="text-secondary text-xs xs:text-sm">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
              <button
                type="button"
                onClick={switchMode}
                className="text-white font-medium ml-1 hover:underline text-xs xs:text-sm"
              >
                {mode === 'login' ? 'Sign up now' : 'Login'}
              </button>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  // Render modal using portal to bypass stacking context issues
  return createPortal(modalContent, document.body);
};

export default AuthModal;
