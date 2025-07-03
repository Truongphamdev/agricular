import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import All from '../protect/Allapi'; // Import API service
import { useDarkMode } from '../protect/useDarkMode';

const UpdatePassword = () => {
  const [password, setPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Fixed typo
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const [darkMode, toggleDarkMode] = useDarkMode();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!currentPassword.trim() || !password.trim()) {
      setError({ detail: 'Vui lòng nhập mật khẩu cũ và mới.' });
      return;
    }
    if (password !== confirmPassword) {
      setError({ detail: 'Mật khẩu xác minh không trùng với mật khẩu mới.' });
      return;
    }

    const data = new FormData();
    data.append('current_password', currentPassword.trim());
    data.append('password', password.trim());

    try {
      const res = await All.changePassword(data);
      console.log('FormData:', Object.fromEntries(data));
      console.log('Response:', res);
      setSuccess('Đổi mật khẩu thành công!');
      setPassword('');
      setCurrentPassword('');
      setConfirmPassword(''); // Reset form
      setTimeout(() => navigate('/profile'), 2000); // Redirect after 2s
    } catch (error) {
      console.log(error.response?.data || error.message);
      setError(error.response?.data || { detail: 'Lỗi khi đổi mật khẩu.' });
    }
  };

  return (
    <div className="min-h-screen dark:bg-gray-800 flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg dark:bg-gray-700">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6 dark:text-white">Đổi Mật Khẩu</h2>
        <button
          onClick={toggleDarkMode}
          className="absolute top-4 right-4 bg-gray-200 dark:bg-gray-700 p-2 rounded-full hover:scale-105 transition"
        >
          {darkMode ? '🌞' : '🌙'}
        </button>
        {success && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {error?.detail && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error.detail}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-100">
              Mật khẩu cũ
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Nhập mật khẩu cũ"
            />
            {error?.current_password && (
              <p className="mt-2 text-sm text-red-600">{error.current_password[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-100">
              Mật khẩu mới
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Nhập mật khẩu mới"
            />
            {error?.password && (
              <p className="mt-2 text-sm text-red-600">{error.password[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-100">
              Xác minh mật khẩu
            </label>
            <input
              id="confirmPassword" // Fixed ID
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Nhập lại mật khẩu mới"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Đổi Mật Khẩu
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/profile')}
            className="text-sm text-indigo-600 hover:text-indigo-900 dark:text-white"
          >
            Quay lại trang hồ sơ
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;