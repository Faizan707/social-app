// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { FaHome } from "react-icons/fa";
import { useUser } from '../../context/UserContext';

function Login() {
  const {userData, setLoggedInUser } = useUser();
  const [name, setName] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
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

  const handleHomeNavigate = () => {
    navigate("/");
  };

  const handleLogin = async () => {
    try {
      const user = userData.find((user) => user.email === inputEmail && user.password === inputPassword); 
      if (user) {
        setName('');
        setInputEmail('');
        setInputPassword('');
        navigate(`/profile/${user.name}/`); 
        setLoggedInUser({ name: user.name, id: user._id });
        alert('Login Successful');
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
      <input type="text" value={name} onChange={handleName} />
      <label htmlFor="#">Email</label>
      <input type="text" value={inputEmail} onChange={handleInputEmail} />
      <label htmlFor="#">Password</label>
      <input type="password" value={inputPassword} onChange={handleInputPassword} />
      <button onClick={handleLogin} className={styles.loginbutton}>Login</button>
      <button className={styles.homebutton} onClick={handleHomeNavigate}><FaHome/></button>
    </div>
  );
}

export default Login;
