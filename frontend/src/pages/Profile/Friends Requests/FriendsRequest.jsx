import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useUser } from '../../../context/UserContext';
import styles from './FriendsRequests.module.css'; 

function FriendsRequest() {
  const [friendRequests, setFriendRequests] = useState([]);
  const { loggedInUser } = useUser();

  useEffect(() => {
    const fetchRequestApi = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/friendRequests/${loggedInUser.id}`);
        setFriendRequests(response.data.friendRequests);
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    };

    fetchRequestApi();
  }, [loggedInUser.id]);

  const handleAcceptFriendRequest = async (requestId, senderId, senderName) => {
    try {
      console.log("SenderName in handleAcceptFriendRequest:", senderName);
      const response = await axios.put(`http://localhost:3002/friendRequests/${requestId}`, { status: "accept" });
      if (response.data.success) {
        alert('Friend request accepted successfully!');
        setFriendRequests(prevRequests =>
          prevRequests.filter(request => request._id !== requestId)
        );
        await sendNotification(senderId, senderName);
      } else {
        alert('Failed to accept friend request');
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
      alert('Failed to accept friend request');
    }
  };

  const sendNotification = async (senderId, senderName) => {
    try {
      
      const response = await axios.post("http://localhost:3002/notifications", {
        senderName: loggedInUser.name,
        receiver: senderId,
        message: `Your friend request to ${loggedInUser.name} has been accepted by ${senderName}.`
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };
  
  return (
    <div className={styles.friendrequestcontainer}>
      <h1>Friend Requests:</h1>
      <ul>
        {friendRequests.map((request) => (
          <li key={request._id} className={styles.friendrequestitem}>
            Sender: {request.sender.name}
            Status: {request.status}
            {request.status === "pending" && (
              <button onClick={() => handleAcceptFriendRequest(request._id, request.sender._id, request.sender.name)}>
                Accept
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FriendsRequest;
