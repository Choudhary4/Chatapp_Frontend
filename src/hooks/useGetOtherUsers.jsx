// useGetOtherUsers.jsx
import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setOtherUsers } from '../redux/userSlice';
import { BASE_URL } from '..';
import { useNavigate } from 'react-router-dom';

// Use environment variable for BASE_URL

const useGetOtherUsers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOtherUsers = async () => {
      try {
        // Set default axios config for credentials
        axios.defaults.withCredentials = true;
        
        const res = await axios.get(`${BASE_URL}/api/v1/user`, {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        });
        
        console.log("Other users -> ", res.data);
        dispatch(setOtherUsers(res.data));
      } catch (error) {
        console.error("Error fetching other users:", error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchOtherUsers();
  }, [dispatch, navigate]);
};

export default useGetOtherUsers;
