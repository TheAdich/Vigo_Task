// components/RegistrationForm.js
'use client';
import React, { useState } from 'react';
import Loading from '../loading/loading';
import axios from 'axios';
import { safeLocalStorage } from '../../utils/jwt';
import authStore from '../../utils/zustandUserState';
import { useRouter } from 'next/navigation';
import toastType from '../../utils/toastify';
import { ToastContainer } from "react-toastify";
const Register = () => {
  const router=useRouter();
  const setUser = authStore((state) => state.setUser);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    referedCode: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_PATH}/auth/register`, {
        email: formData.email,
        password: formData.password,
        referedCode: formData.referedCode
      })
      console.log(res.data);
      if (res.data) {
        toastType('Registration Successful','success');
        safeLocalStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        router.push('/dashboard');
      }
    } catch (error) {
      //alert(error.response.data.message);
      toastType(error.response.data.message,'error');
      //alert(error.response.data.message);
      console.log(error);
    }
    finally {
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
        <h2 className="text-2xl font-semibold text-gray-800 text-center">Register</h2>

        {/* Email Field */}
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

        {/* Password Field */}
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

        {/* Referred Code Field */}
        <div>
          <label htmlFor="referedCode" className="block text-sm font-medium text-gray-700">
            Referred Code (Optional)
          </label>
          <input
            type="text"
            name="referedCode"
            id="referedCode"
            value={formData.referedCode}
            onChange={handleChange}
            className="mt-1 text-black block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 flex items-center justify-center text-white font-semibold rounded-lg ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
            }`}
        >
          {isLoading ? <Loading /> : 'Register'}
        </button>
        <p className='text-black text-center'>Already have an account? <a className='text-blue-400 cursor-pointer' onClick={()=>router.push('/login')}>Login</a></p>
      </form>
    </div>
  );
};

export default Register;
