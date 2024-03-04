import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { useUser } from '../../context/UserContext';
import { FaHome } from "react-icons/fa";
import axios from 'axios';

function Login() {
  const [Name, setName] = useState('');
  const [inputemail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const { users, currentUser } = useUser();
  const navigate = useNavigate();

  const handleInputEmail = (e) => {
    setInputEmail(e.target.value);
  };

  const handleInputPassword = (e) => {
    setInputPassword(e.target.value);
  };

  const handleName = (e) => {
    setName(e.target.value);
  };

  const HomeNavigate =useNavigate()
  const handleHomeNavigate = () =>{
    HomeNavigate("/")
  }

  const handleLogin = async () => {
    try {
      const user = users.find((user) => user.email === inputemail && user.password === inputPassword); 
      if (user) {
        const response = await axios.get(`http://localhost:3002/users`);
        const userId = response.data[0]._id; // Assuming the response is an array and we take the first user's ID
        navigate(`/profile/${Name}/${userId}/id`);
        currentUser(userId)
        alert('Login Successful');
        setName('');
        setInputEmail('');
        setInputPassword('');
      } else {
        alert('Login Failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Failed to login. Please try again.');
    }
  };
  
  return (
    <div className={styles.logincontainer}>
      <label htmlFor="#">Name</label>
      <input type="text" value={Name} onChange={handleName} />
      <label htmlFor="#">Email</label>
      <input type="text" value={inputemail} onChange={handleInputEmail} />
      <label htmlFor="#">Password</label>
      <input type="password" value={inputPassword} onChange={handleInputPassword} />
      <button onClick={handleLogin} className={styles.loginbutton}>Login</button>
      <button className={styles.homebutton} onClick={handleHomeNavigate}><FaHome/></button>
    </div>
  );
}

export default Login;
