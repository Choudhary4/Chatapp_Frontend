import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from "react-hot-toast"
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthUser } from '../redux/userSlice';
import { BASE_URL } from '..';

const Login = () => {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if(!user.username || !user.password) {
        return toast.error("Please fill all fields");
    }
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/user/login`, user, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      toast.success(res.data.message || "Logged in successfully!");
      navigate("/");
      dispatch(setAuthUser(res.data));
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      console.log(error);
    } finally {
        setLoading(false);
    }
    setUser({
      username: "",
      password: ""
    })
  }
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-[#111b21]">
      <div className='w-full max-w-md p-10 rounded-lg shadow-lg bg-[#202c33]'>
        <div className="text-center mb-8">
          <h1 className='text-3xl font-light text-[#e9edef]'>ChatApp Web</h1>
          <p className="text-[#8696a0] mt-2">Login to your account to continue</p>
        </div>
        <form onSubmit={onSubmitHandler} className="space-y-4">
          <div>
            <label className='block text-sm font-medium text-[#8696a0] mb-2'>
              Username
            </label>
            <input
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className='w-full px-4 py-3 bg-[#2a3942] text-[#e9edef] border-none rounded-md focus:outline-none focus:ring-1 focus:ring-[#00a884] transition-all'
              type="text"
              placeholder='Enter your username' />
          </div>
          <div>
            <label className='block text-sm font-medium text-[#8696a0] mb-2'>
              Password
            </label>
            <input
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className='w-full px-4 py-3 bg-[#2a3942] text-[#e9edef] border-none rounded-md focus:outline-none focus:ring-1 focus:ring-[#00a884] transition-all'
              type="password"
              placeholder='Enter your password' />
          </div>
          
          <div className="pt-4">
            <button type='submit' disabled={loading} className='w-full bg-[#00a884] hover:bg-[#008f6f] text-white font-medium py-3 rounded-md transition-colors disabled:opacity-70 flex justify-center items-center'>
                {loading ? <span className="loading loading-spinner loading-md"></span> : "Log In"}
            </button>
          </div>

          <p className='text-center text-[#8696a0] mt-6'>
            Don't have an account? <Link to="/signup" className="text-[#00a884] hover:underline transition-colors">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login