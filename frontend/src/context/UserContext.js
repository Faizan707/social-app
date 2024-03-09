// UserContext.js
import React, { createContext, useContext, useState } from 'react';
import useUserApi from '../hooks/useUserApi';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const { userData, loading, error } = useUserApi();
    const [loggedInUser, setLoggedInUser] = useState({ name: null, id: null });

    return (
        <UserContext.Provider value={{ userData, loading, error, loggedInUser, setLoggedInUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
