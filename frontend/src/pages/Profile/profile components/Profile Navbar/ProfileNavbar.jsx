import React, { useState, useEffect } from "react";
import { CgProfile } from "react-icons/cg";
import { FaHome, FaSearch, FaUserFriends } from "react-icons/fa";
import { IoIosNotificationsOutline } from "react-icons/io";
import { CiLogout } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./ProfileNavbar.module.css";
import { useUser } from "../../../../context/UserContext";
import Notifications from "../Profile Notifications/Notifications";

function ProfileNavbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);
  const { userData, loggedInUser } = useUser();
  const navigate = useNavigate();
  const [sentRequests, setSentRequests] = useState([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const handleNavigate = () => {
    navigate("/login");
  };

  useEffect(() => {
    if (loggedInUser) {
      fetchNotifications();
    }
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`http://localhost:3002/notifications/${loggedInUser.id}`);
      const notificationsData = response.data.notifications;
      setNotifications(notificationsData);
      const unreadCount = notificationsData.filter(notification => !notification.read).length;
      setUnreadNotificationCount(unreadCount);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleSearch = () => {
    const filteredUsers = userData.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filteredUsers.length === 0) {
      alert("No users found with the given name. Please try again.");
    } else if (searchQuery.toLowerCase() === loggedInUser.name.toLowerCase()) {
      alert("You searched for yourself.");
    } else {
      alert("User found! Click to see him on your profile and add him.");
      const usersWithId = filteredUsers.map((user) => ({
        ...user,
        id: user._id,
      }));
      setSearchedUsers(usersWithId);
      setSearchQuery("");
    }
  };

  const handleAddFriend = async (receiverId, receiverName) => {
    try {
      if (sentRequests.includes(receiverId)) {
        alert(`Friend request already sent to ${receiverName}.`);
      } else {
        await axios.post("http://localhost:3002/friendRequests", {
          sender: loggedInUser.id,
          receiver: receiverId,
        });

        const senderName = loggedInUser.name;
        const message = `You have a new friend request from ${senderName}`;
        await axios.post("http://localhost:3002/notifications", {
          senderName: senderName,
          receiver: receiverId,
          message: message,
        });

        setSentRequests([...sentRequests, receiverId]);
        alert("friend request sent successfully")
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
      alert("Failed to send friend request. Please try again.");
    }
  };

  const handleNotificationClick = () => {
    setShowNotifications(true);
    setUnreadNotificationCount(0);
  };

  const handleCloseNotifications = async () => {
    setShowNotifications(false);
    
    // Update the notifications array to mark all as read
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    setNotifications(updatedNotifications);
    
    setTimeout(() => {
      setNotifications([]);
    }, 2000); 
  };
  

  return (
    <>
      <nav className={styles.navbar}>
        <input
          type="text"
          placeholder="Search your friends"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch} className={styles.searchButton}>
          <FaSearch />
        </button>
        <Link to="/profile">
          <CgProfile /> Profile
        </Link>
        <Link to="/home">
          <FaHome /> Home
        </Link>
        <Link to="/friend-requests">
          <FaUserFriends /> Friends requests
        </Link>
        <Link to="/friend-list">Friends List</Link>
        <button className={styles.notificationbutton} onClick={handleNotificationClick}>
          <IoIosNotificationsOutline />
          {unreadNotificationCount > 0 && <div className={styles.notificationCount}>{unreadNotificationCount}</div>}
        </button>
        <button onClick={handleNavigate} className={styles.logoutbutton}>
          <CiLogout />
        </button>
      </nav>

      <div>
        <h1>Welcome to your profile {loggedInUser.name}</h1>
        {searchedUsers.length > 0 && (
          <>
            <h2>Search Results:</h2>
            <ul>
              {searchedUsers.map((user) => (
                <li key={user.id}>
                  {user.name}
                  <button onClick={() => handleAddFriend(user.id, user.name)} className={styles.addFriendButton}>
                    Add friend
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
          {showNotifications && <Notifications notifications={notifications} onClose={handleCloseNotifications} loggedInUser={loggedInUser}/>}
      </div>
    </>
  );
}

export default ProfileNavbar;
