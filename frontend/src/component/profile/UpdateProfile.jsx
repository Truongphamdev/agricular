import React, { useEffect, useState } from 'react';
import { useDarkMode } from '../protect/useDarkMode';
import All from '../protect/Allapi';
import { useLocation, useNavigate } from 'react-router-dom';

export const EditProfile = () => {
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [user, setUser] = useState({
    username: '',
    email: '',
    avatar: '/default-avatar.jpg',
  });
  
  const [preview, setPreview] = useState(user.avatar);
  const [error,setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); 

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser({
        username: storedUser.username || '',
        email: storedUser.email || '',
        avatar: storedUser.avatar || '',
      });
      setPreview(storedUser.avatar || '/default-avatar.jpg');
    }
  }, [location]);

  const handlechange = (e)=> {
    setUser({
        ...user,[e.target.name]:e.target.value
    })
  }

  const handleSave = async (e) => {
  e.preventDefault(); // Ngăn reload trang
  const formdata = new FormData();
if (user.username) formdata.append('username', user.username);
if (user.email) formdata.append('email', user.email);
  if (user.avatar instanceof File ) { 
    formdata.append('avatar', user.avatar);
  }
  else {
    
  }
  try {
    const res = await All.updateUser(formdata); // Đảm bảo await
    console.log(res); // Debug để kiểm tra response
    if (res.user) {
      localStorage.setItem('user', JSON.stringify(res.user)); // Lưu object user
      alert('Cập nhật thành công!');
      navigate('/profile');
    } else {
      throw new Error('Không có dữ liệu user trong response');
    }
  } catch (error) {
    if (error.response && error.response.data) {
      console.log(error.response.data);
      setError(error.response.data);
    } else {
      console.log(error.message);
      setError({ detail: 'Lỗi kết nối đến server hoặc server không phản hồi.' });
    }
  }
};



  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-900 dark:to-black p-4 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md text-center transition-colors duration-300 relative">
        
        <button
          onClick={toggleDarkMode}
          className="absolute top-4 right-4 bg-gray-200 dark:bg-gray-700 p-2 rounded-full hover:scale-105 transition"
        >
          {darkMode ? '🌞' : '🌙'}
        </button>

        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Chỉnh sửa Profile</h2>

        <img
            src={
                preview instanceof File ?URL.createObjectURL(preview):
      user.avatar // đã là URL từ backend thì dùng trực tiếp
  }
          alt="Avatar Preview"
          className="w-32 h-32 rounded-full mx-auto shadow-lg object-cover hover:scale-105 transition mb-4"
        />

        <input
          type="file"
          accept="image/*"
            onChange={(e) => {
    if (e.target.files[0]) {
      setUser({ ...user, avatar: e.target.files[0] })
      setPreview(e.target.files[0]); // lưu file thực
    }
  }}
          className="block w-full text-sm text-gray-700 dark:text-gray-300 mb-4"
        />

        <input
          type="text"
          name="username"
          value={user.username}
          onChange={handlechange}
          placeholder="Tên người dùng"
          className="w-full px-4 py-2 mb-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
        
        />
            {error?.username && <p style={{ color: 'red' }}>{error?.username[0]}</p>}

        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handlechange}
          placeholder="Email"
          className="w-full px-4 py-2 mb-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
            {error?.email && <p style={{ color: 'red' }}>{error?.email[0]}</p>}

        <button
          onClick={handleSave}
          className="px-4 py-2 w-full bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Lưu thay đổi
        </button>
      <button className='mt-2 ' onClick={()=>navigate('/changepassword')}><h3 className='text-red-500 hover:text-red-800 transition'>Đổi mật khẩu</h3></button>
              <button
          onClick={()=>navigate('/profile')}
          className="px-4 py-2 mt-5 w-full bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Quay lại
        </button>
      
      </div>
    </div>
  );
};
