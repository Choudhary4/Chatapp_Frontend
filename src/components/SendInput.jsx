import React, {useState, useRef, useEffect } from 'react'
import { IoSend, IoClose } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import axios from "axios";
import {useDispatch,useSelector} from "react-redux";
import { setMessages, updateMessageContent, setEditingMessage } from '../redux/messageSlice';
import { BASE_URL } from '..';
import EmojiPicker from 'emoji-picker-react';

const SendInput = () => {
    const [message, setMessage] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [file, setFile] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    
    const dispatch = useDispatch();
    const {selectedUser, authUser} = useSelector(store=>store.user);
    const {messages, editingMessage} = useSelector(store=>store.message);
    const {socket} = useSelector(store=>store.socket);
    
    const typingTimeoutRef = useRef(null);
    const fileInputRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const isBlocked = authUser?.blockedUsers?.includes(selectedUser?._id);

    useEffect(() => {
        if (editingMessage) {
            setMessage(editingMessage.message);
        } else {
            setMessage("");
        }
    }, [editingMessage]);

    const onEmojiClick = (emojiObject) => {
        setMessage(prev => prev + emojiObject.emoji);
    };

    const onChangeHandler = (e) => {
        setMessage(e.target.value);
        if(socket) {
            socket.emit("typing", { senderId: authUser?._id, receiverId: selectedUser?._id });
            
            if(typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
                socket.emit("stopTyping", { senderId: authUser?._id, receiverId: selectedUser?._id });
            }, 2000);
        }
    }

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.size > 1 * 1024 * 1024) {
                alert("File size exceeds 1 MB limit. Please select a smaller file.");
                return;
            }
            setFile(selectedFile);
            setShowEmojiPicker(false);
        }
    };

    const toggleRecording = async () => {
        if (isRecording) {
            mediaRecorderRef.current?.stop();
            setIsRecording(false);
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;
                audioChunksRef.current = [];

                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        audioChunksRef.current.push(event.data);
                    }
                };

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                    const audioFile = new File([audioBlob], 'voice-message.webm', { type: 'audio/webm' });
                    setFile(audioFile);
                };

                mediaRecorder.start();
                setIsRecording(true);
            } catch (error) {
                console.error("Error accessing microphone:", error);
                alert("Microphone access denied or unavailable.");
            }
        }
    };

    const onSubmitHandler = async (e) => {
        if(e) e.preventDefault();
        if(!message.trim() && !file) return;

        setShowEmojiPicker(false);

        if(socket && typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            socket.emit("stopTyping", { senderId: authUser?._id, receiverId: selectedUser?._id });
        }
        try {
            if (editingMessage) {
                const res = await axios.put(`${BASE_URL}/api/v1/message/edit/${editingMessage._id}`, {message}, {
                    headers:{
                        'Content-Type':'application/json'
                    },
                    withCredentials:true
                });
                dispatch(updateMessageContent(res?.data?.updatedMessage));
                dispatch(setEditingMessage(null));
            } else {
                const formData = new FormData();
                formData.append("message", message);
                if(file) formData.append("file", file);

                const res = await axios.post(`${BASE_URL}/api/v1/message/send/${selectedUser?._id}`, formData, {
                    headers:{
                        'Content-Type':'multipart/form-data'
                    },
                    withCredentials:true
                });
                dispatch(setMessages([...messages, res?.data?.newMessage]));
            }
        } catch (error) {
            console.log(error);
        } 
        setMessage("");
        setFile(null);
    }
    return (
        <div className="flex flex-col w-full relative">
            {showEmojiPicker && (
                <div className="absolute bottom-[65px] left-4 z-50 shadow-lg">
                    <EmojiPicker onEmojiClick={onEmojiClick} theme="dark" />
                </div>
            )}
            
            {file && (
                <div className="flex items-center justify-between px-4 py-2 bg-[#202c33] border-b border-[#313d45] text-sm text-[#8696a0] w-full">
                    <div className="flex items-center gap-2 truncate">
                        <span className="truncate">Attached: {file.name}</span>
                        {file.type.startsWith('audio/') && <span className="text-[#00a884]">(Voice Note)</span>}
                    </div>
                    <button 
                        type="button" 
                        onClick={() => setFile(null)}
                        className="hover:text-white transition-colors p-1"
                        title="Remove File"
                    >
                        <IoClose size={20} />
                    </button>
                </div>
            )}

            {editingMessage && (
                <div className="flex items-center justify-between px-4 py-2 bg-[#202c33] border-b border-[#313d45] text-sm text-[#8696a0] w-full">
                    <div className="flex items-center gap-2">
                        <MdEdit />
                        <span>Editing message</span>
                    </div>
                    <button 
                        type="button" 
                        onClick={() => dispatch(setEditingMessage(null))}
                        className="hover:text-white transition-colors p-1"
                        title="Cancel Edit"
                    >
                        <IoClose size={20} />
                    </button>
                </div>
            )}
            
            {isBlocked || selectedUser?.iAmBlocked ? (
                <div className="flex items-center justify-center w-full px-4 py-4 bg-[#202c33] border-t border-[#313d45]">
                    <span className="text-[#8696a0] text-sm text-center">
                        {isBlocked ? "You blocked this contact. Tap to unblock." : "You are blocked by this user."}
                    </span>
                </div>
            ) : (
                <form onSubmit={onSubmitHandler} className='flex items-center gap-3 w-full px-4 py-2 bg-[#202c33] min-h-[62px]'>
                    <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className={`transition-colors p-2 rounded-full ${showEmojiPicker ? 'text-[#00a884] bg-[#2a3942]' : 'text-[#aebac1] hover:text-[#d1d7db]'}`} title="Emoji">
                        <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M9.153 11.603c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962zm-3.204 1.362c-.026-.307-.131 5.218 6.063 5.551 6.066-.25 6.066-5.551 6.066-5.551-6.078 1.416-12.13 0-12.13 0zm11.363 1.108s-.669 1.959-5.051 1.959c-3.505 0-5.388-1.164-6.012-1.98-.058-.076-.113-.153-.163-.231-.109-.169-.118-.216-.016-.38.093-.15.282-.146.282-.146l5.982.882 5.968-1.042c.113-.021.218.061.226.176.007.098-.019.231-.059.432-.083.421-.302.977-.732 1.258-.456.297-1.168.347-1.168.347h.743zm-2.463-2.47c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962z"></path><path d="M11.999 1.996C6.476 1.996 2 6.471 2 11.994c0 5.522 4.476 9.998 9.999 9.998 5.523 0 9.999-4.476 9.999-9.998 0-5.523-4.476-9.998-9.999-9.998zM12 20.492c-4.686 0-8.496-3.81-8.496-8.496 0-4.686 3.81-8.496 8.496-8.496 4.686 0 8.496 3.81 8.496 8.496 0 4.686-3.81 8.496-8.496 8.496z"></path></svg>
                    </button>
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="text-[#aebac1] hover:text-[#d1d7db] transition-colors p-2 rounded-full" title="Attach">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M1.816 15.556v.002c0 1.502.584 2.912 1.646 3.972s2.472 1.647 3.974 1.647a5.58 5.58 0 0 0 3.972-1.645l9.547-9.548c.769-.768 1.147-1.767 1.058-2.817-.079-.968-.548-1.927-1.319-2.698-1.594-1.592-4.068-1.711-5.517-.262l-7.916 7.915c-.881.881-.792 2.25.214 3.261.959.958 2.423 1.053 3.263.215l5.511-5.512c.28-.28.267-.722.053-.936l-.244-.244c-.191-.191-.567-.349-.957.04l-5.506 5.506c-.18.18-.635.127-.976-.214-.098-.097-.576-.613-.213-.973l7.915-7.917c.818-.817 2.267-.699 3.23.262.5.501.802 1.1.849 1.685.051.573-.156 1.111-.589 1.543l-9.547 9.549a3.97 3.97 0 0 1-2.829 1.171 3.975 3.975 0 0 1-2.83-1.173 3.973 3.973 0 0 1-1.172-2.828c0-1.071.415-2.076 1.172-2.83l7.209-7.211c.157-.157.264-.579.028-.814L11.5 4.36a.572.572 0 0 0-.834.018l-7.205 7.207a5.577 5.577 0 0 0-1.645 3.971z"></path></svg>
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                    <div className='flex-1 relative mx-2'>
                        {isRecording ? (
                            <div className="w-full bg-[#2a3942] rounded-lg px-4 py-2.5 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                <span className="text-[#00a884] text-[15px] animate-pulse">Recording voice message...</span>
                            </div>
                        ) : (
                            <input
                                value={message}
                                onChange={onChangeHandler}
                                type="text"
                                placeholder='Type a message'
                                className='w-full bg-[#2a3942] text-[#d1d7db] placeholder-[#8696a0] rounded-lg px-4 py-2.5 focus:outline-none text-[15px]'
                            />
                        )}
                    </div>
                    {message || file ? (
                        <button type="submit" className={`p-2 text-[#aebac1] hover:text-[#d1d7db] transition-colors`} title={editingMessage ? "Save Edit" : "Send"}>
                            {editingMessage ? <MdEdit className="w-6 h-6 ml-1" /> : <IoSend className="w-6 h-6 ml-1" />}
                        </button>
                    ) : (
                        <button type="button" onClick={toggleRecording} className={`p-2 transition-colors rounded-full ${isRecording ? 'text-red-500 bg-[#2a3942]' : 'text-[#aebac1] hover:text-[#d1d7db]'}`} title={isRecording ? "Stop Recording" : "Voice message"}>
                            {isRecording ? (
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M6 6h12v12H6z"></path></svg>
                            ) : (
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M11.999 14.942c2.001 0 3.531-1.53 3.531-3.531V4.35c0-2.001-1.53-3.531-3.531-3.531S8.469 2.349 8.469 4.35v7.061c0 2.001 1.53 3.531 3.53 3.531zm6.238-3.53c0 3.531-2.942 6.002-6.237 6.002s-6.237-2.471-6.237-6.002H3.761c0 4.001 3.178 7.297 7.061 7.885v3.884h2.354v-3.884c3.884-.588 7.061-3.884 7.061-7.885h-2.002z"></path></svg>
                            )}
                        </button>
                    )}
                </form>
            )}
        </div>
    )
}

export default SendInput