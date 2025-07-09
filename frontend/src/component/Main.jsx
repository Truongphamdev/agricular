import React, { use, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import axiosClient from "../api";
import { useDarkMode } from './protect/useDarkMode';
import All from './protect/Allapi';

export const Main = () => {
  const [username,setUsername] = useState('');
  const [but,setBut] = useState(false)
  const navigate = useNavigate()
  const location = useLocation(); 
  const [avatar,setAvatar] = useState()
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [image,setImage] = useState("");
  const [preimage,setPreimage] = useState("");
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState("")
  const [results,setResults] = useState()
  
  useEffect(()=> {
    const user = JSON.parse(localStorage.getItem('user'))
    if(user && user.username) {

      setUsername(user.username)
    }
        if(user && user.avatar) {

      setAvatar(user.avatar)

      console.log(user.avatar)
    }
  },[location])
  const handleLogout =  () => {
    localStorage.clear()
    navigate('/login')
  }
  const handleProfile = () => {
    navigate('/profile')
  }
  const handleFile= (e) => {
    const file = e.target.files[0];
    setImage(file)
    if(file) {
      setPreimage(URL.createObjectURL(file))
    }
    else {
      setPreimage(null)
    }
  }

  const handleSubmit = async (e)=> {
    e.preventDefault();
  if (!image || !(image instanceof File)) {
    setError("Vui lòng chọn file ảnh hợp lệ.");
    return;
  }

  const formData = new FormData();
  formData.append("image", image);
    for (let [key, value] of formData.entries()) {
        console.log(key, value);
    }

    setLoading(true)
    setError("")
    setResults(null);
    try {
      const res = await All.anylysis(formData)
      setResults(res)
      console.log(res)}
    catch (error) {
    console.error('Error:', error); // Log full error object

    let errorMessage = 'Lỗi kết nối hoặc server không phản hồi.';
    if (error.response) {
        if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
        } else if (error.response.data.error) {
            errorMessage = error.response.data.error;
        } else if (error.response.data.detail) {
            errorMessage = error.response.data.detail;
        } else {
            errorMessage = JSON.stringify(error.response.data);
        }
    }

    setError(errorMessage);}
    finally {
      setLoading(false)
    }
  }
  return (
    <div className='h-screen dark:bg-gray-700'>
<nav className="bg-gray-100 p-4 rounded-lg shadow flex items-end justify-end dark:bg-gray-900">
          <button
          onClick={toggleDarkMode}
          className="absolute top-4 right-4 bg-gray-200 dark:bg-gray-700 p-2 rounded-full hover:scale-105 transition"
        >
          {darkMode ? '🌞' : '🌙'}
        </button>
  <img className='w-7 h-7 rounded-full hover:scale-105' src={avatar || "11.jpg"}/>
  <button onClick={()=>setBut(!but)}><h1
    className="text-xl mr-16 font-semibold text-gray-800 hover:text-blue-500 duration-300 cursor-pointer dark:text-white dark:hover:text-blue-500">{username ||'trường pro'}</h1></button> 
  {
  but && (
<div className="absolute top-12 right-12 flex flex-col  rounded bg-pink-100 items-center p-4 space-x-4">
  <button onClick={handleProfile} className="cursor-pointer px-4 py-2 mb-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
    Profile
  </button>
  <button onClick={handleLogout} className="cursor-pointer px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
    Đăng Xuất
  </button>
</div>

  )
  }
</nav>

    <div className="dark:bg-gray-700 min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="dark:bg-gray-900 bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="dark:text-white text-xl font-bold text-center mb-4 text-green-700">
          Phân tích bệnh cây từ ảnh
        </h2>

        {preimage && (
          <div className="flex justify-center mb-4">
            <img src={preimage} alt="Preview" className="w-48 h-48 object-cover rounded-lg border" />
          </div>
        )}

        <input
          type="file"
          accept="image/jpeg,image/png,image/bmp"
          onChange={handleFile}
          className="w-full mb-4 px-3 dark:text-white py-2 border rounded-lg"
        />
{error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="dark:bg-sky-500 dark:text-black w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50"
        >
          {loading ? 'Đang phân tích...' : 'Phân tích ảnh'}
        </button>

{results && (
            <div className="mt-4 dark:bg-black dark:text-white bg-green-100 text-green-800 p-4 rounded-lg ">
              <h3 className="font-bold">Kết quả phân tích:</h3>
              <img src={results?.data?.image} alt='ảnh cây bệnh' className='rounded-xl 
    w-sm
    my-2 
    max-w-xs 
    object-cover 
    shadow-lg 
    hover:scale-105 
    transition-transform 
    duration-300 
    border 
    border-gray-300
    dark:border-gray-600'/>
              <p><strong>Bệnh:</strong> {results?.data?.disease}</p>
              <p><strong>Nguyên nhân:</strong> {results?.data?.nguyen_nhan}</p>
              <p><strong>Cách xử lý:</strong> {results?.data?.cach_xu_ly}</p>
              <p><strong>Phòng ngừa:</strong> {results?.data?.phong_ngua}</p>
              <p><strong>Thuốc:</strong> {results?.data?.thuoc}</p>
            </div>
          )}


      </div>
    </div>

  </div>

  )
}
