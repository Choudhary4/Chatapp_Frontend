import React from 'react'
import { useDispatch,useSelector } from "react-redux";
import { setSelectedUser, clearUnreadCount } from '../redux/userSlice';
import { BASE_URL } from '..';



const OtherUser = ({ user }) => {
    const dispatch = useDispatch();
    const {selectedUser, onlineUsers} = useSelector(store=>store.user);
    const isOnline = onlineUsers?.includes(user._id);
    
    const selectedUserHandler = (user) => {
        dispatch(setSelectedUser(user));
        dispatch(clearUnreadCount(user._id));
    }
    
    const isSelected = selectedUser?._id === user?._id;
    
    const userAvatar = user?.profilePhoto && !user.profilePhoto.includes('iran.liara.run')
        ? user.profilePhoto 
        : `https://ui-avatars.com/api/?name=${user?.fullName || 'User'}&background=random&color=fff&size=150`;

    return (
        <div 
            onClick={() => selectedUserHandler(user)} 
            className={`flex items-center px-3 cursor-pointer transition-colors duration-150 ${
                isSelected 
                ? 'bg-[#2a3942]' 
                : 'hover:bg-[#202c33]'
            }`}
        >
            <div className="py-3 pr-3">
                <div className={`w-[49px] h-[49px] rounded-full overflow-hidden flex-shrink-0 bg-[#202c33]`}>
                    <img className="w-full h-full object-cover" src={userAvatar} alt="user-profile" onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=User&background=random&color=fff` }} />
                </div>
            </div>
            <div className='flex flex-col flex-1 py-3 border-b border-[#202c33]'>
                <div className='flex justify-between items-center gap-2'>
                    <p className={`font-normal text-[17px] text-[#e9edef]`}>{user?.fullName}</p>
                    <div className="flex flex-col items-end gap-1">
                        {user?.unreadCount > 0 && (
                            <span className="bg-[#00a884] text-[#111b21] text-[12px] font-bold px-[6px] py-[2px] rounded-full min-w-[20px] text-center leading-none inline-block">
                                {user.unreadCount}
                            </span>
                        )}
                        {isOnline && <span className="text-[#00a884] text-xs font-medium">Online</span>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OtherUser