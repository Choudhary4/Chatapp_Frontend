import React from 'react'
import Message from './Message'
import useGetMessages from '../hooks/useGetMessages';
import { useSelector } from "react-redux";
import useGetRealTimeMessage from '../hooks/useGetRealTimeMessage';

const Messages = ({ searchQuery }) => {
    useGetMessages();
    useGetRealTimeMessage();
    const { messages, isLoadingMessages } = useSelector(store => store.message);
    
    if(isLoadingMessages) {
        return (
            <div className='px-4 flex-1 overflow-auto space-y-4 py-4'>
                {[...Array(5)].map((_, idx) => (
                    <div key={idx} className={`flex flex-col w-full animate-pulse ${idx % 2 === 0 ? 'items-start' : 'items-end'}`}>
                        <div className={`h-12 w-48 rounded-2xl ${idx % 2 === 0 ? 'bg-white/10 rounded-tl-sm' : 'bg-blue-500/20 rounded-tr-sm'}`}></div>
                    </div>
                ))}
            </div>
        )
    }

    if (!messages || messages.length === 0) {
        return (
            <div className="px-4 flex-1 flex flex-col items-center justify-center opacity-70">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" className="text-gray-400"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"></path></svg>
                </div>
                <p className="text-gray-400">No messages yet. Say hi!</p>
            </div>
        )
    }

    const filteredMessages = searchQuery 
        ? messages.filter(msg => msg.message?.toLowerCase().includes(searchQuery.toLowerCase()))
        : messages;

    return (
        <div className='px-4 flex-1 overflow-auto'>
            {
               filteredMessages && filteredMessages.map((message) => {
                    return (
                        <Message key={message._id} message={message} />
                    )
                })
            }
        </div>
    )
}

export default Messages