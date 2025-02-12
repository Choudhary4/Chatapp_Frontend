import React, { useEffect } from 'react';
import axios from "axios";
import { useDispatch } from "react-redux";
import { setOtherUsers } from '../redux/userSlice';
import { BASE_URL } from '..';


const useGetOtherUsers = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchOtherUsers = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/v1/user`, {
                    withCredentials: true // Ensure cookies are sent
                });
                console.log("other users -> ", res.data);
                dispatch(setOtherUsers(res.data));
            } catch (error) {
                console.log("Error fetching other users:", error);
            }
        }
        
        fetchOtherUsers();
    }, [])

}

export default useGetOtherUsers