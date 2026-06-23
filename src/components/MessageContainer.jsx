import React, { useEffect, useState } from 'react'
import SendInput from './SendInput'
import Messages from './Messages';
import { useSelector, useDispatch } from "react-redux";
import { setSelectedUser, toggleBlockState } from '../redux/userSlice';
import { BiArrowBack } from "react-icons/bi";
import toast from "react-hot-toast";
import axios from 'axios';
import { BASE_URL } from '..';

const MessageContainer = () => {
    const { selectedUser, authUser, onlineUsers } = useSelector(store => store.user);
    const dispatch = useDispatch();

    const isOnline = onlineUsers?.includes(selectedUser?._id);
    const { typingUser } = useSelector(store => store.user);
    const isTyping = typingUser === selectedUser?._id;
    const userAvatar = selectedUser?.profilePhoto && !selectedUser.profilePhoto.includes('iran.liara.run')
        ? selectedUser.profilePhoto 
        : `https://ui-avatars.com/api/?name=${selectedUser?.fullName || 'User'}&background=random&color=fff&size=150`;

    const { socket } = useSelector(store => store.socket);
    const { messages } = useSelector(store => store.message);

    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        if (selectedUser && socket && authUser) {
            socket.emit("markAsRead", { 
                senderId: selectedUser._id, 
                receiverId: authUser._id 
            });
        }
    }, [selectedUser, socket, authUser, messages]);

    // Reset search and menu ONLY when the selected user changes
    useEffect(() => {
        setIsSearching(false);
        setSearchQuery("");
        setShowMenu(false);
    }, [selectedUser]);

    const clearChatHandler = async () => {
        try {
            const res = await axios.delete(`${BASE_URL}/api/v1/message/clear/${selectedUser._id}`, {
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                dispatch({ type: 'message/setMessages', payload: [] }); // Or use the setMessages action
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to clear chat");
        }
        setShowMenu(false);
    };

    const isBlocked = authUser?.blockedUsers?.includes(selectedUser?._id);

    const blockUserHandler = async () => {
        try {
            const res = await axios.put(`${BASE_URL}/api/v1/user/block/${selectedUser._id}`, {}, {
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                dispatch(toggleBlockState(selectedUser._id));
                setShowMenu(false);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to block user");
        }
    };

    return (
        <>
            {
                selectedUser !== null ? (
                    <div className={`${selectedUser ? 'flex' : 'hidden md:flex'} flex-1 w-full flex-col relative z-10 bg-[#0b141a]`}>
                        {/* WhatsApp Web doodle background */}
                        <div 
                            className="absolute inset-0 opacity-40 mix-blend-overlay z-0 pointer-events-none" 
                            style={{ backgroundImage: `url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')`, backgroundRepeat: 'repeat' }}
                        ></div>
                        <div className='flex items-center justify-between bg-[#202c33] px-4 py-2.5 h-[60px] relative z-30'>
                            <div className='flex items-center gap-4 cursor-pointer'>
                                <button 
                                    onClick={() => dispatch(setSelectedUser(null))} 
                                    className="md:hidden text-[#aebac1] hover:text-white transition-colors"
                                >
                                    <BiArrowBack className="w-6 h-6" />
                                </button>
                                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-800">
                                    <img className="w-full h-full object-cover" src={userAvatar} alt="user-profile" onError={(e) => { e.target.src = "https://avatar.iran.liara.run/public/boy" }} />
                                </div>
                                <div className='flex flex-col'>
                                    <p className="font-normal text-[#e9edef] text-[16px]">{selectedUser?.fullName}</p>
                                    {selectedUser?.iAmBlocked ? null : isTyping ? (
                                        <p className="text-xs text-[#00a884] font-medium animate-pulse">typing...</p>
                                    ) : (
                                        <p className="text-[13px] text-[#8696a0]">{isOnline ? "Online" : ""}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-6 text-[#aebac1] relative z-20">
                                <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsSearching(!isSearching); }} className="hover:text-white transition-colors cursor-pointer relative z-30" title="Search">
                                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M15.9 14.3H15l-.3-.3c1-1.1 1.6-2.7 1.6-4.3 0-3.7-3-6.7-6.7-6.7S3 6 3 9.7s3 6.7 6.7 6.7c1.6 0 3.2-.6 4.3-1.6l.3.3v.8l5.1 5.1 1.5-1.5-5-5zm-6.2 0c-2.6 0-4.6-2.1-4.6-4.6s2.1-4.6 4.6-4.6 4.6 2.1 4.6 4.6-2 4.6-4.6 4.6z"></path></svg>
                                </button>
                                <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowMenu(!showMenu); }} className="hover:text-white transition-colors cursor-pointer relative z-30" title="Menu">
                                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z"></path></svg>
                                </button>
                                
                                {showMenu && (
                                    <div className="absolute right-0 top-10 w-40 bg-[#233138] rounded shadow-lg overflow-hidden z-50">
                                        <button onClick={() => { setShowMenu(false); dispatch(setSelectedUser(null)); }} className="w-full text-left px-4 py-2 hover:bg-[#111b21] transition-colors text-sm">Close chat</button>
                                        <button onClick={clearChatHandler} className="w-full text-left px-4 py-2 hover:bg-[#111b21] transition-colors text-sm">Clear messages</button>
                                        {!selectedUser?.isGroup && (
                                            <button onClick={blockUserHandler} className="w-full text-left px-4 py-2 hover:bg-[#111b21] transition-colors text-sm text-red-500">
                                                {isBlocked ? 'Unblock user' : 'Block user'}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {isSearching && (
                            <div className="bg-[#202c33] px-4 py-2 relative z-20 border-t border-[#313d45]">
                                <input 
                                    type="text" 
                                    placeholder="Search messages..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-[#2a3942] text-[#d1d7db] placeholder-[#8696a0] rounded-lg px-4 py-2 focus:outline-none text-[15px]"
                                    autoFocus
                                />
                            </div>
                        )}

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 relative z-10">
                            <Messages searchQuery={searchQuery} />
                        </div>
                        <div className="relative z-20">
                            <SendInput />
                        </div>
                    </div>
                ) : (
                    <div className='hidden md:flex flex-col flex-1 items-center justify-center bg-[#222e35] border-l border-gray-700/50'>
                        <div className="flex flex-col items-center justify-center max-w-lg text-center">
                            <img src="https://whatsapp-clone-web.netlify.app/static/media/chat-bg.69fc35ec.png" alt="ChatApp Empty" className="w-[320px] mb-8 opacity-70" onError={(e) => e.target.style.display = 'none'} />
                            <h1 className='text-[32px] font-light text-[#e9edef] mb-4'>ChatApp Web</h1>
                            <p className="text-[#8696a0] text-[14px] leading-relaxed mb-8">Send and receive messages with your friends in real-time.<br/>Select a conversation to start chatting.</p>

                        </div>
                    </div>
                )
            }
        </>
    )
}

export default MessageContainer