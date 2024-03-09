import React, { useEffect, useState } from 'react'
import { useUser } from '../../../context/UserContext'
import axios from 'axios'
function FriendsRequest() {
  const [requests, setRequests] = useState([]);
  const { loggedInUser } = useUser();

  console.log("loggedInUser:", loggedInUser);

  const fetchRequestApi = async () => {
    try {
      const response = await axios.get(`http://localhost:3002/friendRequests/${loggedInUser.id}`);
      setRequests(response.data);
      console.log("requests:", response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };
  useEffect(() => {
    
      fetchRequestApi();
    
  }, []);
  return (
    <div>
     
     <h1>Friend Requests</h1>
      <ul>
        {/* Map over the requests array and render each item */}
        {requests.map(request => (
          <li key={request._id}>
            <p>Sender: {request.sender.name}</p>
            <p>Status: {request.status}</p>
            <button>Accept</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FriendsRequest
