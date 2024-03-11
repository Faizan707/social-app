import './App.css';
import { Routes,Route } from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
import Signup from './components/Signup Component/Signup.jsx';
import Login from './components/Login Component/Login.jsx';
import Profile from './pages/Profile/Profile.jsx';
import FriendsRequest from './pages/Profile/Friends Requests/FriendsRequest.jsx';
import FriendList from './pages/Profile/Friend lists/FriendList.jsx';

function App() {
  return (
    <Routes>

        <Route path='/' element={<Home/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='login' element={<Login/>}/>
        <Route path='/profile/:name' element={<Profile />} />
        <Route path='/friend-requests' element={<FriendsRequest/>}/>
        <Route path='/friend-list' element={<FriendList/>}/>
            </Routes>
  );
}

export default App;

