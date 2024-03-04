import React, { useState } from 'react';
import axios from 'axios';
import styles from "./SignUp.module.css"
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: '',
    password: '',
    age: '',
    gender: '',
    country: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3002/users', formData);
      console.log('User created:', response.data);
      setFormData({
        name: "",
        email: '',
        password: '',
        age: '',
        gender: '',
        country: ''
      });

      navigate("/login");
      alert("Form submitted successfully");
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <div className={styles.signupcontainer}>
      <h2>Sign Up Form</h2>
      <form className={styles.signupform} onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
        </div>
        <div>
          <label htmlFor="age">Age:</label>
          <input type="number" name="age" id="age" value={formData.age} onChange={handleChange} placeholder="Age" />
        </div>
        <div>
          <label htmlFor="gender">Gender:</label>
          <select name="gender" id="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="country">Country:</label>
          <input type="text" name="country" id="country" value={formData.country} onChange={handleChange} placeholder="Country" />
        </div>
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
