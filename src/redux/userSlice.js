import {createSlice} from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:"user",
    initialState:{
        authUser:null,
        otherUsers:null,
        selectedUser:null,
        onlineUsers:null,
        typingUser: null, // Stores the ID of the user currently typing
    },
    reducers:{
        setAuthUser:(state,action)=>{
            state.authUser = action.payload;
        },
        updateAuthUser:(state, action) => {
            if(state.authUser) {
                state.authUser = { ...state.authUser, ...action.payload };
            }
        },
        setOtherUsers:(state, action)=>{
            state.otherUsers = action.payload;
        },
        setSelectedUser:(state,action)=>{
            state.selectedUser = action.payload;
        },
        setOnlineUsers:(state,action)=>{
            state.onlineUsers = action.payload;
        },
        setTypingUser:(state, action)=>{
            state.typingUser = action.payload;
        },
        incrementUnreadCount: (state, action) => {
            const userId = action.payload;
            if(state.otherUsers) {
                const userIndex = state.otherUsers.findIndex(u => u._id === userId);
                if(userIndex !== -1) {
                    state.otherUsers[userIndex].unreadCount = (state.otherUsers[userIndex].unreadCount || 0) + 1;
                }
            }
        },
        clearUnreadCount: (state, action) => {
            const userId = action.payload;
            if(state.otherUsers) {
                const userIndex = state.otherUsers.findIndex(u => u._id === userId);
                if(userIndex !== -1) {
                    state.otherUsers[userIndex].unreadCount = 0;
                }
            }
        },
        toggleBlockState: (state, action) => {
            if(state.authUser) {
                const targetId = action.payload;
                const blockedUsers = state.authUser.blockedUsers || [];
                if (blockedUsers.includes(targetId)) {
                    state.authUser.blockedUsers = blockedUsers.filter(id => id !== targetId);
                } else {
                    state.authUser.blockedUsers = [...blockedUsers, targetId];
                }
            }
        },
        updateIAmBlockedStatus: (state, action) => {
            const { byUserId, isBlocked } = action.payload;
            if(state.otherUsers) {
                const userIndex = state.otherUsers.findIndex(u => u._id === byUserId);
                if(userIndex !== -1) {
                    state.otherUsers[userIndex].iAmBlocked = isBlocked;
                }
            }
            if(state.selectedUser && state.selectedUser._id === byUserId) {
                state.selectedUser.iAmBlocked = isBlocked;
            }
        }
    }
});
export const {setAuthUser,setOtherUsers,setSelectedUser,setOnlineUsers,setTypingUser,updateAuthUser,incrementUnreadCount,clearUnreadCount,toggleBlockState,updateIAmBlockedStatus} = userSlice.actions;
export default userSlice.reducer;