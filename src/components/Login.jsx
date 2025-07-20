import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { slideIn } from '../utils/motion';
import { styles } from '../styles';

const Login = ({ onClose }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const { login, register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await login(formData.username, formData.password);
    
    if (result.success) {
      onClose();
    } else {
      setError(result.error);
    }
    
    setIsLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    const result = await register(registerData.username, registerData.email, registerData.password);
    
    if (result.success) {
      alert('Registration successful! You can now login.');
      setIsRegistering(false);
      setRegisterData({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    } else {
      setError(result.error);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        variants={slideIn('up', 'tween', 0, 0.3)}
        initial="hidden"
        animate="show"
        className="bg-tertiary rounded-2xl p-8 max-w-md w-full mx-4 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-secondary transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <h2 className="text-white font-bold text-2xl">
            {isRegistering ? 'Register' : 'Login'}
          </h2>
          <p className="text-secondary text-sm mt-2">
            {isRegistering ? 'Create your account' : 'Access admin panel'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {!isRegistering ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-primary border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-secondary"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-primary border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-secondary"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-secondary hover:bg-secondary/80 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsRegistering(true)}
                className="text-secondary hover:text-white text-sm transition-colors"
              >
                Don't have an account? Register here
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={registerData.username}
                onChange={handleRegisterChange}
                className="w-full bg-primary border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-secondary"
                placeholder="Choose a username"
                required
                minLength={3}
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={registerData.email}
                onChange={handleRegisterChange}
                className="w-full bg-primary border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-secondary"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={registerData.password}
                onChange={handleRegisterChange}
                className="w-full bg-primary border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-secondary"
                placeholder="Choose a password"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={registerData.confirmPassword}
                onChange={handleRegisterChange}
                className="w-full bg-primary border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-secondary"
                placeholder="Confirm your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-secondary hover:bg-secondary/80 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Creating account...' : 'Register'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsRegistering(false)}
                className="text-secondary hover:text-white text-sm transition-colors"
              >
                Already have an account? Sign in here
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
