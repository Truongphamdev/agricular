import logo from './logo.svg';
import './App.css';
import { Register } from './component/auth/Register';
import {BrowserRouter, Route, Routes} from "react-router-dom"
import { Login } from './component/auth/Login';
import { Main } from './component/Main';
import { ProtectRouter } from './component/protect/ProtectRouter';
import { Profile } from './component/profile/Profile';
import { EditProfile } from './component/profile/UpdateProfile';
import UpdatePassword from './component/profile/UpdatePassword';
import { Detail } from './component/detail/Detail';

function App() {
  return (
    <BrowserRouter>
    <Routes>
        <Route path='/register' element={<Register/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='' element={
          <ProtectRouter>
          <Main/>
          </ProtectRouter>
          } />
          <Route path='/profile' element={
            <ProtectRouter>
              <Profile/>
            </ProtectRouter>
          } />
          <Route path='/update' element={
            <ProtectRouter>
              <EditProfile/>
            </ProtectRouter>
          } />
            <Route path='/changepassword' element={
            <ProtectRouter>
              <UpdatePassword/>
            </ProtectRouter>
          } />
            <Route path='profile/:pk/detail' element={
            <ProtectRouter>
              <Detail/>
            </ProtectRouter>
          } />
    </Routes>
    </BrowserRouter>

  );
}

export default App;
