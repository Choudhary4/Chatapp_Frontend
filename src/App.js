import Signup from './components/Signup';
import './App.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import HomePage from './components/HomePage';
import Login from './components/Login';
import { useEffect, useState } from 'react';
import {useSelector,useDispatch} from "react-redux";
import io from "socket.io-client";
import { setSocket } from './redux/socketSlice';
import { setOnlineUsers } from './redux/userSlice';
import { BASE_URL } from '.';



const router = createBrowserRouter([
  {
    path:"/",
    element:<HomePage/>
  },
  {
    path:"/signup",
    element:<Signup/>
  },
  {
    path:"/login",
    element:<Login/>
  },

])

function App() { 
  const {authUser} = useSelector(store=>store.user);
  const {socket} = useSelector(store=>store.socket);
  const dispatch = useDispatch();

  useEffect(()=>{
    if(authUser){
      const socketio = io(`${BASE_URL}`, {
          query:{
            userId:authUser._id
          }
      });
      dispatch(setSocket(socketio));

      socketio?.on('getOnlineUsers', (onlineUsers)=>{
        dispatch(setOnlineUsers(onlineUsers))
      });
      return () => socketio.close();
    }else{
      if(socket){
        socket.close();
        dispatch(setSocket(null));
      }
    }

  },[authUser]);

  return (
    <div className="h-screen w-screen bg-[#0a1014] flex items-center justify-center overflow-hidden relative">
      {/* Subtle green top bar for large screens (classic WhatsApp Web look) */}
      <div className="hidden lg:block absolute top-0 left-0 w-full h-[127px] bg-[#00a884] z-0"></div>
      
      <div className="relative z-10 w-full h-full max-h-[100vh] lg:max-h-[95vh] lg:max-w-[1600px] lg:shadow-2xl lg:rounded-sm overflow-hidden flex bg-[#111b21]">
        <RouterProvider router={router}/>
      </div>
    </div>
  );
}

export default App;
