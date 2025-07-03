import React ,{useEffect,useState} from 'react'
import All from '../protect/Allapi';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [error,setError] = useState("");
    
    const navigate = useNavigate();
    
    useEffect(()=> {
    document.title = "Đăng nhập - Hệ thống nông nghiệp";

    },[])
    const handleSubmit = async (e)=> {
        e.preventDefault()
        const formData = {
            email,
            password
        }
        try {
            const res = await All.login(formData)
            localStorage.setItem('access',res.access)
            localStorage.setItem('refresh', res.refresh);
            localStorage.setItem('user',JSON.stringify(res.user))
            alert("Đăng nhập thành công");
            console.log(res.user)

    navigate('/');


        } catch (error) {
if (error.response && error.response.data) {
    console.log(error.response.data);
    setError(error.response.data);
} else {
    console.log(error.message);
    setError({ detail: "Lỗi kết nối đến server hoặc server không phản hồi." });
}

        }

    }
  return (
<div className="bg-green-50 flex items-center justify-center min-h-screen">

    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">Đăng nhập</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">


            <div>
                <label className="block mb-1 text-green-700 font-medium">Email</label>
                <input type="email" name="email" required value={email} onChange={(e)=>{setEmail(e.target.value)}}
                       className="w-full border border-green-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"/>
            {error?.email && <p style={{ color: 'red' }}>{error?.email[0]}</p>}
            
            </div>

            <div>
                <label className="block mb-1 text-green-700 font-medium">Mật khẩu</label>
                <input type="password" name="password" required value={password} onChange={(e)=>{setPassword(e.target.value)}}
                       className="w-full border border-green-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"/>
            {error?.password && <p style={{ color: 'red' }}>{error?.password[0]}</p>}
           
            </div>

            <button type="submit"
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl font-semibold transition duration-200">
                Đăng nhập
            </button>

            <p className="text-sm text-center text-green-700 mt-4">
                Chưa có tài khoản?
                <a href="/register/" className="text-green-600 hover:underline">Đăng ký ngay</a>
            </p>
        </form>
    </div>

</div>
  )
}
