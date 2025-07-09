import React, { useEffect, useState } from 'react';
import { useDarkMode } from '../protect/useDarkMode'
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import All from '../protect/Allapi';

export const Profile = () => {
  const [darkMode, toggleDarkMode] = useDarkMode();
    const navigate = useNavigate();
  const location = useLocation(); 
  const [diseases,setDiseases] = useState()
  const [message,setMessage] = useState("")
  

  const [user, setUser] = useState({
    username: '',
    email: '',
    avatar: '/11.jpg',
  });
  useEffect(() => {
      const fetchDiseases = async () => {
          try {
              const res = await All.profile();
              setDiseases(res);
          } catch (error) {
              console.error("Lỗi load bệnh:", error);
              setDiseases([]);
          }
      };
      fetchDiseases();
  }, []);
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
  const handleDelete = async (id) => {
    try {
      const res = await All.delete(id);
      setDiseases(diseases.filter((item) => item.id !== id));
        setMessage(res.message || "Đã xóa thành công!");

        // Tự ẩn thông báo sau 3 giây
        setTimeout(() => {
            setMessage("");
        }, 2000);
    } catch (error) {
      console.error("Lỗi khi xóa bệnh:", error);
        setMessage("Xóa thất bại, vui lòng thử lại!");
        setTimeout(() => {
            setMessage("");
        },2000);
    }
  };
  const handleDetail =(pk)=> {
    navigate(`${pk}/detail`)
  }
  return (
  
    <div className="md:flex items-center justify-evenly min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-900 dark:to-black md:p-4 transition-colors duration-300">
    {message && (
    <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg transition-opacity duration-500 z-50`}>
        {message}
    </div>
)}

        <button onClick={()=>navigate("/")} className='absolute top-4 left-2 p-5 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition'>Home</button>
      <div className=" bg-white mb-2 dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md text-center transition-colors duration-300">
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
<div className="bg-white dark:bg-gray-800  md:ms-4 p-4 rounded-xl shadow-lg w-full max-w-4xl mx-auto ">
    <h3 className="text-md font-bold mb-3 text-green-700 dark:text-green-300 text-center">
        8 bệnh cây gần đây đã phân tích:
    </h3>

    {diseases && diseases.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[80vh] overflow-y-auto pr-2">
            {diseases.map((item, index) => (
                <div
    
                    key={index}
                    className="p-3 rounded-lg border border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900   hover:scale-[0.96] hover:shadow-md transition-all duration-300 ease-in-out transform-gpu cursor-pointer"
                >
                    <img
                      onClick={()=>handleDetail(item.id)}
                        src={item.image}
                        alt={`Ảnh bệnh ${item.disease}`}
                        className="w-full h-32 object-cover rounded-md mb-2"
                    />
                    <h4 className="font-semibold text-green-800 dark:text-green-200 text-sm">{item.disease}</h4>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="mt-2 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-xs"
                >
                  Xóa
                </button>
                </div>
            ))}
        </div>
    ) : (
        <p className="text-gray-600 dark:text-gray-300 text-center text-sm">Chưa có dữ liệu bệnh.</p>
    )}
</div>

    </div>
  );
};
