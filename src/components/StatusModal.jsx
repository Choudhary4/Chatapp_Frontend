import React, { useState, useEffect, useRef } from 'react';
import { IoClose, IoCamera } from 'react-icons/io5';
import { BiArrowBack } from 'react-icons/bi';
import axios from 'axios';
import { BASE_URL } from '..';
import toast from 'react-hot-toast';

const StatusModal = ({ isOpen, onClose }) => {
    const [statuses, setStatuses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [textStatus, setTextStatus] = useState("");
    const fileInputRef = useRef(null);
    const [activeStatus, setActiveStatus] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchStatuses();
        } else {
            setActiveStatus(null);
        }
    }, [isOpen]);

    const fetchStatuses = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/status`, {
                withCredentials: true
            });
            setStatuses(res.data);
        } catch (error) {
            console.error("Error fetching statuses:", error);
            toast.error("Failed to load statuses");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('media', file);
        if (textStatus) formData.append('text', textStatus);

        setUploading(true);
        try {
            await axios.post(`${BASE_URL}/api/v1/status/create`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            toast.success("Status posted successfully");
            setTextStatus("");
            fetchStatuses();
        } catch (error) {
            console.error(error);
            toast.error("Failed to post status");
        } finally {
            setUploading(false);
        }
    };

    const handleTextSubmit = async (e) => {
        e.preventDefault();
        if (!textStatus.trim()) return toast.error("Write something");

        setUploading(true);
        try {
            await axios.post(`${BASE_URL}/api/v1/status/create`, { text: textStatus }, {
                withCredentials: true
            });
            toast.success("Status posted successfully");
            setTextStatus("");
            fetchStatuses();
        } catch (error) {
            console.error(error);
            toast.error("Failed to post status");
        } finally {
            setUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex bg-black/90">
            {/* Left Sidebar for Statuses */}
            <div className="w-full md:w-[350px] lg:w-[400px] bg-[#111b21] h-full flex flex-col border-r border-gray-700/50 relative z-10">
                <div className="flex items-center gap-4 py-4 px-4 bg-[#202c33]">
                    <button type="button" onClick={onClose} className="text-[#aebac1] hover:text-[#d1d7db]">
                        <IoClose size={24} />
                    </button>
                    <h2 className="text-[#e9edef] text-lg font-medium">Status</h2>
                </div>

                {/* Upload Status Section */}
                <div className="p-4 bg-[#111b21] border-b border-gray-700/50">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-[#00a884] flex flex-col items-center justify-center cursor-pointer relative" onClick={() => fileInputRef.current?.click()}>
                            <IoCamera className="text-[#111b21] text-2xl" />
                            <div className="absolute bottom-0 right-0 bg-[#00a884] rounded-full w-4 h-4 flex items-center justify-center border-2 border-[#111b21]">
                                <span className="text-[#111b21] font-bold text-xs">+</span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-[#e9edef] font-medium">My status</h3>
                            <p className="text-[#8696a0] text-sm">{uploading ? "Uploading..." : "Click to add an update"}</p>
                        </div>
                    </div>
                    <form onSubmit={handleTextSubmit} className="mt-4 flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Type a status..." 
                            value={textStatus} 
                            onChange={(e) => setTextStatus(e.target.value)}
                            className="w-full bg-[#2a3942] text-[#d1d7db] placeholder-[#8696a0] rounded-lg px-3 py-2 text-sm focus:outline-none"
                        />
                        {textStatus && (
                            <button type="submit" disabled={uploading} className="bg-[#00a884] text-[#111b21] px-3 rounded-lg text-sm font-medium">Post</button>
                        )}
                    </form>
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                </div>

                {/* List of Statuses */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                    <p className="text-[#00a884] text-sm uppercase font-medium mb-4 tracking-wider">Recent updates</p>
                    
                    {isLoading ? (
                        <p className="text-[#8696a0] text-sm">Loading statuses...</p>
                    ) : statuses.length === 0 ? (
                        <p className="text-[#8696a0] text-sm">No recent updates</p>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {statuses.map(status => (
                                <div key={status._id} className="flex items-center gap-3 cursor-pointer hover:bg-[#202c33] p-2 -mx-2 rounded-lg transition-colors" onClick={() => setActiveStatus(status)}>
                                    <div className="w-12 h-12 rounded-full border-2 border-[#00a884] p-[2px] overflow-hidden">
                                        <img src={status.mediaUrl || status.userId?.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(status.userId?.fullName || 'User')}&background=random`} alt={status.userId?.fullName} className="w-full h-full rounded-full object-cover bg-[#111b21]" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-[#e9edef] font-medium text-[16px]">{status.userId?.fullName}</h3>
                                        <p className="text-[#8696a0] text-xs">
                                            {new Date(status.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Viewer for Statuses */}
            <div className="hidden md:flex flex-1 items-center justify-center bg-[#0b141a] relative z-0">
                {activeStatus ? (
                    <div className="w-full max-w-md h-[80vh] flex flex-col">
                        <div className="flex items-center gap-3 p-4 bg-gradient-to-b from-black/50 to-transparent">
                            <img src={activeStatus.userId?.profilePhoto} className="w-10 h-10 rounded-full" />
                            <div className="text-white">
                                <p className="font-medium">{activeStatus.userId?.fullName}</p>
                                <p className="text-xs opacity-80">{new Date(activeStatus.createdAt).toLocaleTimeString()}</p>
                            </div>
                        </div>
                        <div className="flex-1 flex items-center justify-center bg-[#111b21] p-4 text-center">
                            {activeStatus.mediaUrl ? (
                                <img src={activeStatus.mediaUrl} alt="Status Media" className="max-w-full max-h-full object-contain rounded-lg shadow-xl" />
                            ) : (
                                <p className="text-white text-2xl px-6 py-10 bg-gradient-to-br from-[#00a884] to-[#005c4b] rounded-lg shadow-2xl w-full h-full flex items-center justify-center break-words">
                                    {activeStatus.text}
                                </p>
                            )}
                        </div>
                        {activeStatus.text && activeStatus.mediaUrl && (
                            <div className="bg-black/50 p-4 text-center">
                                <p className="text-white">{activeStatus.text}</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center">
                        <svg viewBox="0 0 100 100" width="100" height="100" fill="none" stroke="#2a3942" strokeWidth="2" className="mx-auto mb-6">
                            <circle cx="50" cy="50" r="40" strokeDasharray="10 5" />
                        </svg>
                        <p className="text-[#8696a0] text-lg">Click on a contact to view their status update</p>
                    </div>
                )}
            </div>

            {/* Mobile Viewer overlay */}
            {activeStatus && (
                <div className="md:hidden fixed inset-0 z-50 flex flex-col bg-black">
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-b from-black/50 to-transparent absolute top-0 w-full z-10">
                        <button type="button" onClick={() => setActiveStatus(null)} className="text-white mr-2">
                            <BiArrowBack size={24} />
                        </button>
                        <img src={activeStatus.userId?.profilePhoto} className="w-10 h-10 rounded-full" />
                        <div className="text-white">
                            <p className="font-medium">{activeStatus.userId?.fullName}</p>
                            <p className="text-xs opacity-80">{new Date(activeStatus.createdAt).toLocaleTimeString()}</p>
                        </div>
                    </div>
                    <div className="flex-1 flex items-center justify-center pt-16 pb-4 px-4 text-center">
                        {activeStatus.mediaUrl ? (
                            <img src={activeStatus.mediaUrl} alt="Status Media" className="max-w-full max-h-full object-contain rounded-lg" />
                        ) : (
                            <p className="text-white text-xl px-6 py-10 bg-gradient-to-br from-[#00a884] to-[#005c4b] rounded-lg w-full h-full flex items-center justify-center break-words">
                                {activeStatus.text}
                            </p>
                        )}
                    </div>
                    {activeStatus.text && activeStatus.mediaUrl && (
                        <div className="bg-black/50 p-4 text-center absolute bottom-0 w-full z-10">
                            <p className="text-white">{activeStatus.text}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StatusModal;
