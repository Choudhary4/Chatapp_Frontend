import React, { useEffect } from 'react'
import SendInput from './SendInput'
import Messages from './Messages';
import { useSelector,useDispatch } from "react-redux";
import { setSelectedUser } from '../redux/userSlice';
import { BASE_URL } from '..';


const MessageContainer = () => {
    const { selectedUser, authUser, onlineUsers } = useSelector(store => store.user);
    const dispatch = useDispatch();

    const isOnline = onlineUsers?.includes(selectedUser?._id);
   
    return (
        <>
            {
                selectedUser !== null ? (
                    

                    
                    <div className="w-[60vw] h-[90vh] fixed bg-gray-300 right-4 top-5 bottom-5 md:min-w-[550px] flex flex-col rounded-2xl"





>
                        <div className='flex gap-2 items-center bg-zinc-800 text-white px-4 py-2 mb-2'>
                            <div className={`avatar ${isOnline ? 'online' : ''}`}>
                                <div className='w-12 rounded-full'>
                                    <img src={selectedUser?.profilePhoto} alt="user-profile" />
                                </div>
                            </div>
                            <div className='flex flex-col flex-1'>
                                <div className='flex justify-between gap-2'>
                                    <p>{selectedUser?.fullName}</p>
                                </div>
                            </div>
                        </div>
                        <Messages />
                        <SendInput />
                    </div>
                ) : (
                    <div className="w-[60vw] h-[90vh] fixed  right-4 top-5 bottom-5 md:min-w-[550px] flex flex-col rounded-2xl items-center justify-center">
                    <div className=" text-white px-6 py-4 rounded-xl shadow-lg flex flex-col items-center">
                        <h1 className="text-4xl font-bold">Hi, {authUser?.fullName}</h1>
                        <h1 className="text-2xl">Let's start the conversation</h1>
                    </div>
                </div>
                
                )
            }
        </>

    )
}

export default MessageContainer