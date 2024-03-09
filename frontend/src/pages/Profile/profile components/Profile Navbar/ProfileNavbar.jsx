import React, { useState } from 'react';
import { CgProfile } from "react-icons/cg";
import { FaHome, FaSearch, FaUserFriends } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './ProfileNavbar.module.css';
import { useUser } from '../../../../context/UserContext'; 

function ProfileNavbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedUsers, setSearchedUsers] = useState([]);
  const { userData, loggedInUser } = useUser(); // Get userData from context
  const navigate = useNavigate();
  
  const handleNavigate = () => {
    navigate("/login");
  };

  const handleSearch = () => {
    const filteredUsers = userData.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filteredUsers.length === 0) {
      alert('No users found with the given name. Please try again.');
    }else if(searchQuery.toLowerCase()===loggedInUser.name.toLowerCase()){
      alert("you search yourself ")
    }
     else {
      alert("User found! Click to see him on your profile and add him.");
      const usersWithId = filteredUsers.map(user => ({
        ...user,
        id: user._id 
      }));
      setSearchedUsers(usersWithId); 
      setSearchQuery("");
    }
  };

  const handleAddFriend = async (receiverId) => {
    try {
      // Send a request to create a friend request
      await axios.post('http://localhost:3002/friendRequests', { sender: loggedInUser.id, receiver: receiverId }); 
      await axios.post('http://localhost:3002/notifications',{sender: loggedInUser.id,receiver:receiverId ,ReceiverMessage:"You have received a Friend Request"})
      alert('Friend request sent successfully!');
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert('Failed to send friend request. Please try again.');
    }
  };

  // Log loggedInUser.id
  console.log('Logged In User ID:', loggedInUser.id);

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
        <Link ><FaHome /> Home</Link>
        <Link to="/friend-requests"><FaUserFriends /> Friends requests</Link>
        <button onClick={handleNavigate}>Logout</button>
      </nav>

      <div>
        <h1>Welcome to your profile {loggedInUser.name}</h1> 
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
