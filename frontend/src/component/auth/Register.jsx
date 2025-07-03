import React, { useEffect,useState } from 'react';
import All from '../protect/Allapi';

export const Register = () => {
    const [username,setUsername] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const [error,setError] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(password !=confirmPassword) {
            setError("mật khẩu không trùng khớp")
            return
        }
        const formData = {
            username,
            email,
            password
        }
        try {
            const res = await All.register(formData)
            console.log(res);  // Xem response từ server
            alert("Đăng ký thành công!");
        } catch (error) {
            setError(error.response.data)
            console.log(error.response.data);
            return
        }
    }
  useEffect(() => {
    document.title = "Đăng ký - Hệ thống nông nghiệp";
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">

      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md border border-green-100">
        <h1 className="text-2xl font-bold text-center mb-6 text-green-800">Đăng ký tài khoản</h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block mb-1 text-green-800 font-medium">Username</label>
            <input type="text" name="username" required value={username} onChange={(e)=>setUsername(e.target.value)}
              className="w-full border border-green-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" />
            {error?.username && <p style={{ color: 'red' }}>{error?.username[0]}</p>}

          </div>

          <div>
            <label className="block mb-1 text-green-800 font-medium">Email</label>
            <input type="email" name="email" required value={email} onChange={(e)=>setEmail(e.target.value)}
              className="w-full border border-green-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" />
            {error?.email && <p style={{ color: 'red' }}>{error?.email[0]}</p>}

          </div>

          <div>
            <label className="block mb-1 text-green-800 font-medium">Mật khẩu</label>
            <input type="password" name="password1" required value={password} onChange={(e)=>setPassword(e.target.value)}
              className="w-full border border-green-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" />
            {error?.password && <p style={{ color: 'red' }}>{error?.password[0]}</p>}

          </div>

          <div>
            <label className="block mb-1 text-green-800 font-medium">Xác nhận mật khẩu</label>
            <input type="password" name="password2" required value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}
              className="w-full border border-green-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" />
              
          </div>
{error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition">
            Đăng ký
          </button>

          <p className="text-sm text-center text-green-700 mt-4">
            Đã có tài khoản?
            <a href="/login" className="text-green-600 hover:underline ml-1">Đăng nhập</a>
          </p>
        </form>
      </div>

    </div>
  );
};
