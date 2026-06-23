import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateAuthUser } from '../redux/userSlice';
import { BASE_URL } from '..';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BiArrowBack } from "react-icons/bi";
import { MdEdit } from "react-icons/md";

const ProfileDrawer = ({ isOpen, onClose }) => {
    const { authUser } = useSelector(store => store.user);
    const dispatch = useDispatch();
    const [fullName, setFullName] = useState(authUser?.fullName || "");
    const [profilePhoto, setProfilePhoto] = useState(authUser?.profilePhoto || "");
    const [about, setAbout] = useState(authUser?.about || "Available");
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingPhoto, setIsEditingPhoto] = useState(false);
    const [isEditingAbout, setIsEditingAbout] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const fileInputRef = useRef(null);

    const handleSave = async (fieldToSave) => {
        setIsLoading(true);
        try {
            const dataToUpdate = { fullName, profilePhoto, about };
            
            const res = await axios.put(`${BASE_URL}/api/v1/user/edit`, dataToUpdate, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(updateAuthUser(res.data.user));
                toast.success(res.data.message);
                setIsEditingName(false);
                setIsEditingPhoto(false);
                setIsEditingAbout(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('profilePhoto', file);

        setUploadingImage(true);
        try {
            const res = await axios.put(`${BASE_URL}/api/v1/user/edit`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(updateAuthUser(res.data.user));
                setProfilePhoto(res.data.user.profilePhoto);
                toast.success("Profile photo updated successfully");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload profile photo");
        } finally {
            setUploadingImage(false);
        }
    };

    return (
        <div className={`absolute top-0 left-0 h-full w-full bg-[#111b21] z-50 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            {/* Header */}
            <div className="bg-[#202c33] h-[108px] flex items-end pb-4 px-6 gap-6">
                <button onClick={onClose} className="text-[#d1d7db] hover:text-white transition-colors">
                    <BiArrowBack className="w-6 h-6" />
                </button>
                <h1 className="text-[#e9edef] text-xl font-medium">Profile</h1>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto bg-[#111b21]">
                {/* Avatar */}
                <div className="flex justify-center items-center py-7">
                    <div className="relative group flex-shrink-0">
                        <div className="w-48 h-48 rounded-full overflow-hidden bg-[#202c33] flex-shrink-0">
                            <img 
                                src={profilePhoto && !profilePhoto.includes('iran.liara.run') ? profilePhoto : `https://ui-avatars.com/api/?name=${authUser?.fullName || 'User'}&background=00a884&color=fff&size=200`} 
                                alt="avatar" 
                                className="w-full h-full object-cover" 
                                onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=User&background=00a884&color=fff`} 
                            />
                        </div>
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute inset-0 bg-black/50 hidden group-hover:flex flex-col items-center justify-center text-white cursor-pointer rounded-full transition-all"
                        >
                            {uploadingImage ? (
                                <span className="text-xs text-center px-4 uppercase text-white/90">Uploading...</span>
                            ) : (
                                <>
                                    <MdEdit className="w-8 h-8 mb-2" />
                                    <span className="text-xs text-center px-4 uppercase text-white/90">Change<br/>Profile Photo</span>
                                </>
                            )}
                        </div>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleImageUpload} 
                            accept="image/*" 
                            className="hidden" 
                        />
                    </div>
                </div>



                {/* Name */}
                <div className="bg-[#111b21] px-7 py-3">
                    <p className="text-[#00a884] text-[14px] mb-4">Your name</p>
                    <div className="flex justify-between items-center group">
                        {isEditingName ? (
                            <div className="flex-1 mr-4 border-b-2 border-[#00a884]">
                                <input 
                                    type="text" 
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full bg-transparent text-[#e9edef] focus:outline-none text-[17px] pb-1"
                                    autoFocus
                                />
                            </div>
                        ) : (
                            <p className="text-[#e9edef] text-[17px]">{authUser?.fullName}</p>
                        )}
                        
                        {isEditingName ? (
                            <button onClick={handleSave} disabled={isLoading} className="text-[#00a884]">
                                {isLoading ? <span className="loading loading-spinner loading-xs"></span> : <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M9 17.2l-4-4-1.4 1.4L9 20 20.4 8.6 19 7.2z"></path></svg>}
                            </button>
                        ) : (
                            <button onClick={() => setIsEditingName(true)} className="text-[#8696a0] opacity-0 group-hover:opacity-100 transition-opacity">
                                <MdEdit className="w-6 h-6" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Info Text */}
                <div className="px-7 py-4 text-[#8696a0] text-[14px] leading-relaxed">
                    This is not your username or pin. This name will be visible to your WhatsApp contacts.
                </div>

                {/* About */}
                <div className="bg-[#111b21] px-7 py-3 mt-2">
                    <p className="text-[#00a884] text-[14px] mb-4">About</p>
                    <div className="flex justify-between items-center group">
                        {isEditingAbout ? (
                            <div className="flex-1 mr-4 border-b-2 border-[#00a884]">
                                <input 
                                    type="text" 
                                    value={about}
                                    onChange={(e) => setAbout(e.target.value)}
                                    className="w-full bg-transparent text-[#e9edef] focus:outline-none text-[17px] pb-1"
                                    autoFocus
                                />
                            </div>
                        ) : (
                            <p className="text-[#e9edef] text-[17px]">{authUser?.about || "Available"}</p>
                        )}
                        
                        {isEditingAbout ? (
                            <button onClick={handleSave} disabled={isLoading} className="text-[#00a884]">
                                {isLoading ? <span className="loading loading-spinner loading-xs"></span> : <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M9 17.2l-4-4-1.4 1.4L9 20 20.4 8.6 19 7.2z"></path></svg>}
                            </button>
                        ) : (
                            <button onClick={() => setIsEditingAbout(true)} className="text-[#8696a0] opacity-0 group-hover:opacity-100 transition-opacity">
                                <MdEdit className="w-6 h-6" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileDrawer;
