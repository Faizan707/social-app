import React, { useState } from 'react';
import { CgProfile } from "react-icons/cg";
import { FaHome } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaUserFriends } from "react-icons/fa";
import styles from './ProfileNavbar.module.css';
import { useUser } from '../../../../context/UserContext';
import axios from 'axios';

function ProfileNavbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedUsers, setSearchedUsers] = useState([]);
  const { users } = useUser(); // Access currentUser from UserContext
  const navigate = useNavigate();
  const { name, userId } = useParams(); // Renaming to avoid conflict with 'name' variable
  
  const handleNavigate = () => {
    // Add logout logic here
    navigate("/login");
  };

  const handleSearch = () => {
    const filteredUsers = users.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filteredUsers.length === 0) {
      alert('No users found with the given name. Please try again.');
    } else {
      alert("User found! Click to see him on your profile and add him.");
      // Add user ID to each filtered user object
      const usersWithId = filteredUsers.map(user => ({
        ...user,
        id: user._id // Assuming user ID is stored in the _id property
      }));
      setSearchedUsers(usersWithId); // Update to set an array of users with IDs
      setSearchQuery("");
    }
  };

  const handleAddFriend = async (receiverId) => {
    try {
      // Send a request to create a friend request
      await axios.post('/friendRequests', { sender: userId, receiver: receiverId });
      alert('Friend request sent successfully!');
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert('Failed to send friend request. Please try again.');
    }
  };

  return (
    <>
      <nav className={styles.navbar}>
        <input
          type="text"
          placeholder='Search your friends'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}><FaSearch /></button>
        <Link to="/profile"><CgProfile /> Profile</Link>
        <Link to="/home"><FaHome /> Home</Link>
        <Link to="/friend-requests"><FaUserFriends /> Friends requests</Link>
        <button onClick={handleNavigate}>Logout</button>
      </nav>

      <div>
        <h1>Welcome to your profile {name}</h1>
        {searchedUsers.length > 0 && (
          <>
            <h2>Search Results:</h2>
            <ul>
              {searchedUsers.map(user => (
                <li key={user.id}>{user.name}
                  <button onClick={() => handleAddFriend(user.id)}>Add friend</button> 
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}

export default ProfileNavbar;
