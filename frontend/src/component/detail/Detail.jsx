import React, { useState, useEffect } from 'react';
import All from '../protect/Allapi';
import { useNavigate, useParams } from 'react-router-dom';
import { useDarkMode } from '../protect/useDarkMode';

export const Detail = () => {
    const [disease, setDisease] = useState(null);
    const [error, setError] = useState("");
    const { pk } = useParams();
    const navigate = useNavigate();
    const [darkMode, toggleDarkMode] = useDarkMode();

    useEffect(() => {
        const fetchDisease = async () => {
            try {
                const res = await All.detail(pk);
                setDisease(res);
            } catch (error) {
                setError("Có lỗi xảy ra khi tải dữ liệu: " + error);
            }
        };

        fetchDisease();
    }, [pk]);

    const goback = () => {
        navigate('/profile');
    };

    return (
        <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-black' : 'bg-gradient-to-br from-green-100 to-blue-100'} p-4 transition-colors duration-300`}>
            <button
                onClick={toggleDarkMode}
                className="absolute top-4 right-4 bg-gray-200 dark:bg-gray-700 p-2 rounded-full hover:scale-105 transition"
            >
                {darkMode ? '🌞' : '🌙'}
            </button>

            {error && (
                <div className="text-red-500 bg-red-100 dark:bg-red-900 p-3 rounded-lg shadow mb-4 max-w-md text-center">
                    {error}
                </div>
            )}

            {disease ? (
                <div className={`rounded-2xl shadow-xl p-6 max-w-md w-full ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} transition-colors duration-300`}>
                    <img
                        src={disease.image}
                        alt={`Ảnh bệnh ${disease.disease}`}
                        className="w-full h-56 object-cover rounded-xl shadow mb-4"
                    />
                    <h1 className={`text-xl font-bold mb-2 text-center ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                        {disease.disease}
                    </h1>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                        <strong>Nguyên nhân:</strong> {disease.nguyen_nhan}
                    </p>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                        <strong>Cách xử lý:</strong> {disease.cach_xu_ly}
                    </p>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                        <strong>Phòng ngừa:</strong> {disease.phong_ngua}
                    </p>
                    <p className={`text-sm mt-1 mb-4 ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
                        <strong>Thuốc:</strong> {disease.thuoc}
                    </p>
                    <button
                        onClick={goback}
                        className={`w-full py-2 rounded-lg hover:opacity-90 transition ${darkMode ? 'bg-green-500 text-black' : 'bg-blue-500 text-white'}`}
                    >
                        Quay lại
                    </button>
                </div>
            ) : (
                <p className={`${darkMode ? 'text-green-300' : 'text-green-700'}`}>Đang tải dữ liệu...</p>
            )}
        </div>
    );
};
