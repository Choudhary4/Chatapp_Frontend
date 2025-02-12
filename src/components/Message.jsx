import React, { useEffect, useRef } from 'react'
import {useSelector} from "react-redux";
import { useState } from 'react';

const Message = ({message}) => {
    const scroll = useRef();
    const BASE_URL = "https://chat-app-backend-beryl.vercel.app"
    const {authUser,selectedUser} = useSelector(store=>store.user);

    useEffect(()=>{
        scroll.current?.scrollIntoView({behavior:"smooth"});
    },[message]);

    const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}`);
    };

    updateTime(); // Set initial time
    const interval = setInterval(updateTime, 60000); // Update time every minute

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);
    
    return (
        <div ref={scroll} className={`chat ${message?.senderId === authUser?._id ? 'chat-end' : 'chat-start'}`}>
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <img alt="Tailwind CSS chat bubble component" src={message?.senderId === authUser?._id ? authUser?.profilePhoto  : selectedUser?.profilePhoto } />
                </div>
            </div>
            <div className="chat-header">
            <time className="text-xs opacity-50 text-gray-800">{currentTime}</time>
            </div>
            <div className={`chat-bubble ${message?.senderId !== authUser?._id ? 'bg-gray-200 text-black' : ''} `}>{message?.message}</div>
        </div>
    )
}

export default Message