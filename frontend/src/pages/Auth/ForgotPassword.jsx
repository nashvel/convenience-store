import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios-config';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);

    try {
            await api.post('/auth/forgot-password', { email });
      setMessage('A password reset link has been sent to your email. Please check your inbox.');
      setIsError(false);
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred. Please try again.');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-lg rounded-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Forgot your password?</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input 
                id="email-address"
                name="email"
                type="email" 
                autoComplete="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {message && 
            <div className={`p-4 rounded-md text-sm ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              <p>{message}</p>
            </div>
          }

          <div>
            <button 
              type="submit" 
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {loading ? 'Sending Link...' : 'Send Password Reset Link'}
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
          <p className="text-gray-600">
            Remember your password?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
