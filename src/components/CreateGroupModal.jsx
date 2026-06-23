import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '..';
import toast from 'react-hot-toast';
import { IoClose } from 'react-icons/io5';

const CreateGroupModal = ({ isOpen, onClose }) => {
    const { otherUsers } = useSelector(store => store.user);
    const [groupName, setGroupName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [userSearch, setUserSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    // Filter out groups from the user list so we only select actual users
    const individualUsers = otherUsers?.filter(u => !u.isGroup) || [];
    const filteredUsers = individualUsers.filter(u => u.fullName.toLowerCase().includes(userSearch.toLowerCase()));

    const toggleUserSelect = (userId) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        } else {
            setSelectedUsers([...selectedUsers, userId]);
        }
    };

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        if (!groupName.trim()) return toast.error("Group name is required");
        if (selectedUsers.length === 0) return toast.error("Please select at least 1 user");

        setIsLoading(true);
        try {
            const res = await axios.post(`${BASE_URL}/api/v1/message/group/create`, {
                groupName,
                participants: selectedUsers
            }, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.data) {
                toast.success("Group created successfully");
                window.location.reload(); 
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Failed to create group");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-[#202c33] w-full max-w-md rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[80vh]">
                <div className="flex items-center justify-between p-4 bg-[#233138] border-b border-[#313d45]">
                    <h2 className="text-[#e9edef] text-lg font-medium">Create New Group</h2>
                    <button type="button" onClick={onClose} className="text-[#aebac1] hover:text-[#d1d7db] p-1">
                        <IoClose size={24} />
                    </button>
                </div>
                
                <form onSubmit={handleCreateGroup} className="p-4 flex flex-col gap-4 flex-1 overflow-hidden">
                    <div>
                        <input
                            type="text"
                            placeholder="Group Name"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            className="w-full bg-[#2a3942] text-[#d1d7db] placeholder-[#8696a0] rounded-lg px-4 py-3 focus:outline-none focus:border-b-2 focus:border-[#00a884]"
                        />
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar border border-[#313d45] rounded-lg p-2 flex flex-col gap-2">
                        <input
                            type="text"
                            placeholder="Search people..."
                            value={userSearch}
                            onChange={(e) => setUserSearch(e.target.value)}
                            className="w-full bg-[#2a3942] text-[#d1d7db] placeholder-[#8696a0] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-b focus:border-[#00a884] mb-2"
                        />
                        <p className="text-[#8696a0] text-sm px-2">Select Members:</p>
                        <div className="overflow-y-auto flex-1 pr-1">
                            {filteredUsers.map(user => (
                                <div 
                                    key={user._id} 
                                    onClick={() => toggleUserSelect(user._id)}
                                    className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-[#2a3942] transition-colors ${selectedUsers.includes(user._id) ? 'bg-[#2a3942]' : ''}`}
                                >
                                    <input 
                                        type="checkbox" 
                                        checked={selectedUsers.includes(user._id)}
                                        onChange={() => {}} 
                                        className="accent-[#00a884] w-4 h-4"
                                    />
                                    <img src={user.profilePhoto} alt={user.fullName} className="w-8 h-8 rounded-full object-cover" />
                                    <span className="text-[#e9edef]">{user.fullName}</span>
                                </div>
                            ))}
                        </div>
                        {filteredUsers.length === 0 && (
                            <p className="text-[#8696a0] text-sm text-center py-4">No users found</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-[#aebac1] hover:bg-[#2a3942] rounded-md transition-colors">
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={isLoading || !groupName || selectedUsers.length === 0}
                            className="px-6 py-2 bg-[#00a884] text-[#111b21] font-medium rounded-md hover:bg-[#00bfa5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateGroupModal;
