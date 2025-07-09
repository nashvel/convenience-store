import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios-config';

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setIsSuccess(false);
      return;
    }

    setIsLoading(true);
    setError('');
    setIsSuccess(false);

    try {
            const response = await api.post('/auth/signup', {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone
      });

      if (response.data.status === 'success') {
        setError('Verification email sent! Please check your email.');
        setIsSuccess(true);
        setTimeout(() => navigate('/login', { replace: true }), 2000);
      } else {
        setError(response.data?.message || 'An error occurred during signup');
        setIsSuccess(false);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred during signup');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm";

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-lg rounded-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <input name="firstName" type="text" required className={`${inputClass} rounded-t-md`} placeholder="First Name" value={formData.firstName} onChange={handleChange} />
            <input name="lastName" type="text" required className={inputClass} placeholder="Last Name" value={formData.lastName} onChange={handleChange} />
            <input name="email" type="email" autoComplete="email" required className={inputClass} placeholder="Email address" value={formData.email} onChange={handleChange} />
            <input name="phone" type="tel" autoComplete="tel" required className={inputClass} placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
            <input name="password" type="password" autoComplete="new-password" required className={inputClass} placeholder="Password" value={formData.password} onChange={handleChange} />
            <input name="confirmPassword" type="password" autoComplete="new-password" required className={`${inputClass} rounded-b-md`} placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
          </div>

          {error && 
            <div className={`p-4 rounded-md text-sm ${isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <p>{error}</p>
            </div>
          }

          <div>
            <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400">
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
