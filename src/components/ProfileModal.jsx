import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateAuthUser } from '../redux/userSlice';
import { BASE_URL } from '..';
import axios from 'axios';
import toast from 'react-hot-toast';

const ProfileModal = ({ isOpen, onClose }) => {
    const { authUser } = useSelector(store => store.user);
    const dispatch = useDispatch();
    const [fullName, setFullName] = useState(authUser?.fullName || "");
    const [profilePhoto, setProfilePhoto] = useState(authUser?.profilePhoto || "");
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await axios.put(`${BASE_URL}/api/v1/user/edit`, { fullName, profilePhoto }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(updateAuthUser(res.data.user));
                toast.success(res.data.message);
                onClose();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>
                </button>
                <h2 className="text-2xl font-bold text-white mb-6">Edit Profile</h2>
                
                <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-500 bg-gray-800">
                        <img src={profilePhoto || "https://avatar.iran.liara.run/public"} alt="avatar" className="w-full h-full object-cover" onError={(e) => e.target.src = "https://avatar.iran.liara.run/public"} />
                    </div>
                </div>

                <form onSubmit={onSubmitHandler} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                        <input 
                            type="text" 
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Profile Photo URL</label>
                        <input 
                            type="text" 
                            value={profilePhoto}
                            onChange={(e) => setProfilePhoto(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://..."
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg transition-colors flex justify-center items-center mt-6 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                        ) : (
                            "Save Changes"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ProfileModal;
