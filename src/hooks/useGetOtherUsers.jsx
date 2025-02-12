// useGetOtherUsers.jsx
import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setOtherUsers } from '../redux/userSlice';
import { BASE_URL } from '..';

// Use environment variable for BASE_URL

const useGetOtherUsers = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchOtherUsers = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/user`, {
          // Ensure credentials (cookies) are sent with the request
          withCredentials: true,
        });
        console.log("Other users -> ", res.data);
        dispatch(setOtherUsers(res.data));
      } catch (error) {
        console.error("Error fetching other users:", error);
      }
    };

    fetchOtherUsers();
  }, [dispatch]);
};

export default useGetOtherUsers;
