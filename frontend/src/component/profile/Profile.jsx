import React, { useEffect, useState } from 'react';
import { useDarkMode } from '../protect/useDarkMode'
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

export const Profile = () => {
  const [darkMode, toggleDarkMode] = useDarkMode();
    const navigate = useNavigate();
  const location = useLocation(); 

  const [user, setUser] = useState({
    username: '',
    email: '',
    avatar: '/11.jpg',
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser({
        username: storedUser.username,
        email: storedUser.email || 'Chưa cập nhật email',
        avatar: storedUser.avatar || '/11.jpg',
      });
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-900 dark:to-black p-4 transition-colors duration-300">
        <button onClick={()=>navigate("/")} className='absolute top-4 left-2 p-5 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition'>Home</button>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md text-center transition-colors duration-300">
        <button
          onClick={toggleDarkMode}
          className="absolute top-4 right-4 bg-gray-200 dark:bg-gray-700 p-2 rounded-full hover:scale-105 transition"
        >
          {darkMode ? '🌞' : '🌙'}
        </button>

        <img
          src={user.avatar}
          alt="Avatar"
          className="w-32 h-32 rounded-full mx-auto shadow-lg object-cover hover:scale-105 transition"
        />
        <h2 className="text-2xl font-bold mt-4 text-gray-800 dark:text-gray-100">{user.username}</h2>
        <p className="text-gray-600 dark:text-gray-300">{user.email}</p>


        <div className="mt-6 flex flex-col space-y-3">
          <button onClick={()=> navigate('/update')} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            Chỉnh sửa Profile
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Đăng Xuất
          </button>
        </div>
      </div>
    </div>
  );
};
