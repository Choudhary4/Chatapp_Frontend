import React, { useEffect, useRef } from 'react'
import {useSelector, useDispatch} from "react-redux";
import { setEditingMessage } from "../redux/messageSlice";
import { MdEdit } from "react-icons/md";

const Message = ({message}) => {
    const scroll = useRef();
    const dispatch = useDispatch();
    
    const {authUser,selectedUser} = useSelector(store=>store.user);

    useEffect(()=>{
        scroll.current?.scrollIntoView({behavior:"smooth"});
    },[message]);

    // Format the message timestamp
    const formattedTime = message?.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "";
    const isSender = message?.senderId === authUser?._id;
    
    // For group chats, find the sender's name
    const isGroupChat = selectedUser?.isGroup;
    const { otherUsers } = useSelector(store => store.user);
    const senderInfo = !isSender && isGroupChat ? otherUsers?.find(u => u._id === message?.senderId) : null;

    return (
        <div ref={scroll} className={`flex flex-col w-full mb-[2px] ${isSender ? 'items-end' : 'items-start'}`}>
            <div className={`group relative max-w-[65%] px-2.5 py-1.5 rounded-lg shadow-sm ${
                isSender 
                ? 'bg-[#005c4b] text-[#e9edef] rounded-tr-sm' 
                : 'bg-[#202c33] text-[#e9edef] rounded-tl-sm'
            }`}>
                
                {senderInfo && (
                    <div className="text-[12.5px] font-medium text-[#53bdeb] mb-0.5 cursor-pointer">
                        {senderInfo.fullName}
                    </div>
                )}
                {isSender && (
                    <button 
                        onClick={() => dispatch(setEditingMessage(message))}
                        className="absolute top-1 -left-8 p-1 text-[#8696a0] hover:text-[#d1d7db] opacity-0 group-hover:opacity-100 transition-opacity bg-[#202c33] rounded-full shadow-md z-10"
                        title="Edit Message"
                    >
                        <MdEdit size={14} />
                    </button>
                )}
                
                {message?.messageType === 'image' && (
                    <div className="mb-2">
                        <img src={message.fileUrl} alt="attachment" className="max-w-[250px] max-h-[250px] rounded-md object-contain" />
                    </div>
                )}
                {message?.messageType === 'audio' && (
                    <div className="mb-2">
                        <audio src={message.fileUrl} controls className="max-w-[250px] h-[40px] outline-none" />
                    </div>
                )}
                {message?.messageType === 'document' && (
                    <div className="mb-2">
                        <a href={message.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-[#2a3942] p-2 rounded-md hover:bg-[#313d45] transition-colors text-[#d1d7db] underline-none">
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM18 20H6V4h5v6h7v10z"></path></svg>
                            <span className="truncate text-sm">Download File</span>
                        </a>
                    </div>
                )}

                {message?.message && (
                    <p className="text-[14.2px] leading-[19px] break-words inline-block mr-2 pb-2">{message.message}</p>
                )}
                <div className={`text-[11px] float-right mt-[10px] ml-1 flex items-center gap-1 ${isSender ? 'text-[#8696a0]' : 'text-[#8696a0]'}`}>
                    {message?.isEdited && <span className="mr-1 italic text-[10px] opacity-80">edited</span>}
                    {formattedTime}
                    {isSender && (
                        message?.status === 'read' ? (
                            <svg viewBox="0 0 16 15" width="14" height="14" className="text-[#53bdeb]" fill="currentColor"><path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path></svg>
                        ) : message?.status === 'delivered' ? (
                            <svg viewBox="0 0 16 15" width="14" height="14" className="text-[#8696a0]" fill="currentColor"><path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path></svg>
                        ) : (
                            <svg viewBox="0 0 16 15" width="14" height="14" className="text-[#8696a0]" fill="currentColor"><path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033L5.824 7.554a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l2.81 2.748c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path></svg>
                        )
                    )}
                </div>
            </div>
        </div>
    )
}

export default Message