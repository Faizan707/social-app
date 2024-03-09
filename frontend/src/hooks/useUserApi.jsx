import { useEffect, useState } from 'react';
import axios from "axios";

function useUserApi() {
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const response = await axios.get("http://localhost:3002/users");
                setUserData(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchApi();
    }, []);

    return {
        userData,
        loading,
        error
    };
}

export default useUserApi;
