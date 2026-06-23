import { useEffect } from "react";
import {useSelector, useDispatch} from "react-redux";
import { setMessages, updateMessageStatus, updateMessageContent } from "../redux/messageSlice";
import { setTypingUser, incrementUnreadCount, updateIAmBlockedStatus } from "../redux/userSlice";

const useGetRealTimeMessage = () => {
    const {socket} = useSelector(store=>store.socket);
    const {messages} = useSelector(store=>store.message);
    const {authUser, selectedUser} = useSelector(store=>store.user);
    const dispatch = useDispatch();
    
    useEffect(()=>{
        if(!socket) return;
        
        socket.on("newMessage", (newMessage)=>{
            const isGroupMessage = newMessage.receiverId !== authUser?._id;
            const targetId = isGroupMessage ? newMessage.receiverId : newMessage.senderId;

            if(selectedUser?._id === targetId) {
                dispatch(setMessages([...messages, newMessage]));
            } else {
                dispatch(incrementUnreadCount(targetId));
            }
        });

        socket.on("messagesRead", (data) => {
            dispatch(updateMessageStatus({ receiverId: data.receiverId }));
        });

        socket.on("messageEdited", (editedMessage) => {
            dispatch(updateMessageContent(editedMessage));
        });

        socket.on("typing", (data) => {
            dispatch(setTypingUser(data.senderId));
        });

        socket.on("stopTyping", (data) => {
            dispatch(setTypingUser(null));
        });

        socket.on("blockedStatusUpdate", (data) => {
            dispatch(updateIAmBlockedStatus(data));
        });

        return () => {
            socket.off("newMessage");
            socket.off("messagesRead");
            socket.off("messageEdited");
            socket.off("typing");
            socket.off("stopTyping");
            socket.off("blockedStatusUpdate");
        }
    },[socket, dispatch, messages, selectedUser, authUser]);
};
export default useGetRealTimeMessage;