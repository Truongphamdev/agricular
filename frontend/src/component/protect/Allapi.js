import { data } from "react-router-dom";
import axiosClient from "../../api";

const All = {
    register:(data)=>axiosClient.post('/register/',data),
    login:(data)=>axiosClient.post('/login/',data),
    updateUser:(data)=>axiosClient.put('/update/',data),
    changePassword:(data)=>axiosClient.put('/changepassword/',data)
    
}
export default All