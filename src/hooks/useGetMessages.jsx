import { useEffect } from 'react'
import axios from "axios";
import {useSelector,useDispatch} from "react-redux";
import { setMessages, setIsLoadingMessages } from '../redux/messageSlice';
import { BASE_URL } from '..';


const useGetMessages = () => {
    const {selectedUser} = useSelector(store=>store.user);
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchMessages = async () => {
            if(!selectedUser?._id) return;
            try {
                dispatch(setIsLoadingMessages(true));
                axios.defaults.withCredentials = true;
                const res = await axios.get(`${BASE_URL}/api/v1/message/${selectedUser?._id}`);
                dispatch(setMessages(res.data))
            } catch (error) {
                console.log(error);
            } finally {
                dispatch(setIsLoadingMessages(false));
            }
        }
        fetchMessages();
    }, [selectedUser?._id,dispatch]);
}

export default useGetMessages