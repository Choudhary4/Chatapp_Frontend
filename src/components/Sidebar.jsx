import React, { useState } from 'react'
import { BiSearchAlt2 } from "react-icons/bi";
import OtherUsers from './OtherUsers';
import axios from "axios";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import { setAuthUser, setOtherUsers, setSelectedUser } from '../redux/userSlice';
import { setMessages } from '../redux/messageSlice';
import { BASE_URL } from '..';
import ProfileDrawer from './ProfileDrawer';
import CreateGroupModal from './CreateGroupModal';
import StatusModal from './StatusModal';
import useGetOtherUsers from '../hooks/useGetOtherUsers';

const Sidebar = () => {
    useGetOtherUsers();
    const [search, setSearch] = useState("");
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const {otherUsers, authUser} = useSelector(store=>store.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/user/logout`, {
                withCredentials: true
            });
            if (res.data) {
                navigate("/login");
                toast.success(res.data.message);
                dispatch(setAuthUser(null));
                dispatch(setMessages(null));
                dispatch(setOtherUsers(null));
                dispatch(setSelectedUser(null));
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to logout");
        }
    }

    const searchSubmitHandler = (e) => {
        e.preventDefault();
        if(search.length === 0) return;
        const conversationUser = otherUsers?.find((user)=> user.fullName.toLowerCase().includes(search.toLowerCase()));
        if(conversationUser){
            dispatch(setSelectedUser(conversationUser));
        } else {
            toast.error("User not found!");
        }
    }

    // Better avatar fallback using ui-avatars
    const userAvatar = authUser?.profilePhoto && !authUser.profilePhoto.includes('iran.liara.run') 
        ? authUser.profilePhoto 
        : `https://ui-avatars.com/api/?name=${authUser?.fullName || 'User'}&background=00a884&color=fff&size=150`;

    const {selectedUser} = useSelector(store=>store.user);

    return (
        <div className={`${selectedUser ? 'hidden md:flex' : 'flex'} h-full flex-1 md:flex-none w-full md:w-[350px] lg:w-[400px] border-r border-gray-700/50 flex-col bg-[#111b21] relative z-30 transition-all duration-300`}>
            {/* Header / Profile Section */}
            <div className='flex items-center justify-between py-2.5 px-4 bg-[#202c33] h-[60px]'>
                <div 
                    onClick={() => setIsProfileOpen(true)}
                    className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 cursor-pointer"
                    title="Profile"
                >
                    <img className="w-full h-full object-cover" src={userAvatar} alt="user-profile" onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=User&background=00a884&color=fff` }} />
                </div>
                <div className='flex items-center gap-6 text-[#aebac1]'>
                    <button onClick={() => setIsStatusModalOpen(true)} className="hover:text-white transition-colors" title="Status">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
                            <circle cx="12" cy="12" r="5"></circle>
                        </svg>
                    </button>
                    <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsGroupModalOpen(true); }} className="hover:text-white transition-colors relative z-20 cursor-pointer" title="New Group">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"></path>
                        </svg>
                    </button>
                    <div className="relative">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="hover:text-white transition-colors focus:bg-[#2a3942] rounded-full p-1" title="Menu">
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z"></path></svg>
                        </button>
                        
                        {/* Dropdown Menu */}
                        {isMenuOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)}></div>
                                <div className="absolute right-0 top-10 w-44 bg-[#233138] rounded-md shadow-[0_2px_5px_0_rgba(11,20,26,.26),0_2px_10px_0_rgba(11,20,26,.16)] py-2 z-50">
                                    <button 
                                        onClick={() => { setIsGroupModalOpen(true); setIsMenuOpen(false); }}
                                        className="w-full text-left px-6 py-3 hover:bg-[#182229] text-[#d1d7db] text-[14.5px]"
                                    >
                                        New group
                                    </button>
                                    <button 
                                        onClick={() => { setIsProfileOpen(true); setIsMenuOpen(false); }}
                                        className="w-full text-left px-6 py-3 hover:bg-[#182229] text-[#d1d7db] text-[14.5px]"
                                    >
                                        Profile
                                    </button>
                                    <button 
                                        onClick={() => { logoutHandler(); setIsMenuOpen(false); }}
                                        className="w-full text-left px-6 py-3 hover:bg-[#182229] text-[#d1d7db] text-[14.5px]"
                                    >
                                        Log out
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className='p-2 bg-[#111b21] border-b border-gray-800 flex items-center'>
                <form onSubmit={searchSubmitHandler} className='relative w-full flex items-center bg-[#202c33] rounded-lg px-3'>
                    <BiSearchAlt2 className="text-[#aebac1] w-5 h-5" />
                    <input
                        value={search}
                        onChange={(e)=>setSearch(e.target.value)}
                        className='w-full bg-transparent text-[#d1d7db] placeholder-[#8696a0] pl-4 pr-2 py-1.5 focus:outline-none text-[15px]'
                        type="text"
                        placeholder='Search or start a new chat'
                    />
                </form>
            </div>

            {/* Chat List */}
            <div className='flex-1 overflow-y-auto custom-scrollbar bg-[#111b21]'>
                {!otherUsers ? (
                    <div className="space-y-4 p-4">
                        {[1,2,3,4,5].map(i => (
                            <div key={i} className="flex gap-4 items-center animate-pulse">
                                <div className="w-12 h-12 bg-gray-800 rounded-full"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                                    <div className="h-2 bg-gray-800 rounded w-3/4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <OtherUsers />
                )}
            </div>

            <ProfileDrawer isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
            <CreateGroupModal isOpen={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)} />
            <StatusModal isOpen={isStatusModalOpen} onClose={() => setIsStatusModalOpen(false)} />
        </div>
    )
}

export default Sidebar