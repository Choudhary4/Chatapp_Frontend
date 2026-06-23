import {createSlice} from "@reduxjs/toolkit";

const messageSlice = createSlice({
    name:"message",
    initialState:{
        messages:null,
        isLoadingMessages: false,
        editingMessage: null
    },
    reducers:{
        setMessages:(state,action)=>{
            state.messages = action.payload;
        },
        setIsLoadingMessages: (state, action) => {
            state.isLoadingMessages = action.payload;
        },
        setEditingMessage: (state, action) => {
            state.editingMessage = action.payload;
        },
        updateMessageContent: (state, action) => {
            if (state.messages) {
                state.messages = state.messages.map(msg => 
                    msg._id === action.payload._id ? action.payload : msg
                );
            }
        },
        updateMessageStatus: (state, action) => {
            if (state.messages) {
                state.messages = state.messages.map(msg => {
                    if (msg.receiverId === action.payload.receiverId && msg.status !== 'read') {
                        return { ...msg, status: 'read' };
                    }
                    return msg;
                });
            }
        }
    }
});
export const {setMessages, setIsLoadingMessages, setEditingMessage, updateMessageContent, updateMessageStatus} = messageSlice.actions;
export default messageSlice.reducer;