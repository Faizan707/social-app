import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useUser } from '../../../context/UserContext';

function FriendList() {
    const [friendlist, setFriendList] = useState([]);
    const { loggedInUser } = useUser();

    const fetchapi = async () => {
        try {
            const response = await axios.get(`http://localhost:3002/friends/${loggedInUser.id}`);
            setFriendList(response.data.friends);
        } catch (error) {
            console.error('Error fetching friend list:', error);
        }
    };

    useEffect(() => {
        fetchapi();
    }, []);

    return (
        <div>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Friend List:</h2>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {friendlist.map((friend) => (
                    <li key={friend._id} style={{ marginBottom: '10px', border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
                        {friend.friend.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default FriendList;
