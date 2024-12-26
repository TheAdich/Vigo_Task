'use client';

import React, { useState, useEffect } from 'react';
import Loading from '../loading/loading';
import axios from 'axios';
import { safeLocalStorage } from '../../utils/jwt';
import authStore from '../../utils/zustandUserState';
import { useRouter } from 'next/navigation';
import toastType from '../../utils/toastify';
import { ToastContainer } from "react-toastify";

const Login = () => {
  const router = useRouter();
  const setUser = authStore((state) => state.setUser);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    referedCode: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Ensure client-side-only logic
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_PATH}/auth/Login`, {
        email: formData.email,
        password: formData.password,
      });

      if (res.data) {
        toastType('Login Successful', 'success');
        safeLocalStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        router.push('/dashboard');
      }
    } catch (error) {
      toastType(error.response?.data?.message || 'Login Failed', 'error');
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer />
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg space-y-6"
      >
        <h2 className="text-2xl font-semibold text-gray-800 text-center">Login</h2>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-1 text-black block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="mt-1 text-black block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 flex items-center justify-center text-white font-semibold rounded-lg ${
            isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isLoading ? <Loading /> : 'Login'}
        </button>
        <p className="text-black text-center">
          Don't have an Account?{' '}
          <a
            className="text-blue-400 cursor-pointer"
            onClick={() => router.push('/')}
          >
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
