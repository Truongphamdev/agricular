import React, { use, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import axiosClient from "../api";
import { useDarkMode } from './protect/useDarkMode';

export const Main = () => {
  const [username,setUsername] = useState('');
  const [but,setBut] = useState(false)
  const navigate = useNavigate()
  const location = useLocation(); 
  const [avatar,setAvatar] = useState()
  const [darkMode, toggleDarkMode] = useDarkMode();
  
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
  <div className='dark:bg-gray-700'>
    <h1>main</h1>
  </div>
    </div>
  )
}
