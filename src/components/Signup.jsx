import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from '..';

const Signup = () => {
  const [user, setUser] = useState({
    fullName: "",
    username: "",
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const navigate = useNavigate();

  const handleCheckbox = (gender) => {
    setUser({ ...user, gender });
  }

  const sendOtpHandler = async () => {
    if (!user.email) {
      return toast.error("Please enter your email first");
    }
    setSendingOtp(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/user/send-otp`, { email: user.email }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      if (res.data.success) {
        toast.success("OTP sent to your email!");
        setOtpSent(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
      console.log(error);
    } finally {
      setSendingOtp(false);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if(!user.fullName || !user.username || !user.email || !user.password || !user.confirmPassword || !user.gender) {
        return toast.error("Please fill all fields");
    }
    if (!otpSent) {
        return toast.error("Please verify your email with OTP first");
    }
    if(!user.otp) {
        return toast.error("Please enter the OTP");
    }
    if(user.password !== user.confirmPassword) {
        return toast.error("Passwords do not match");
    }
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/user/register`, user, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      if (res.data.success) {
        toast.success(res.data.message || "Account created successfully!");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
      console.log(error);
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#111b21] py-10">
      <div className='w-full max-w-md p-10 rounded-lg shadow-lg bg-[#202c33]'>
        <div className="text-center mb-6">
          <h1 className='text-3xl font-light text-[#e9edef]'>Create Account</h1>
          <p className="text-[#8696a0] mt-2">Join us to start chatting</p>
        </div>
        <form onSubmit={onSubmitHandler} className="space-y-4">
          <div>
            <label className='block text-sm font-medium text-[#8696a0] mb-2'>Full Name</label>
            <input
              value={user.fullName}
              onChange={(e) => setUser({ ...user, fullName: e.target.value })}
              className='w-full px-4 py-3 bg-[#2a3942] text-[#e9edef] border-none rounded-md focus:outline-none focus:ring-1 focus:ring-[#00a884] transition-all'
              type="text"
              placeholder='John Doe' />
          </div>
          <div>
            <label className='block text-sm font-medium text-[#8696a0] mb-2'>Username</label>
            <input
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              className='w-full px-4 py-3 bg-[#2a3942] text-[#e9edef] border-none rounded-md focus:outline-none focus:ring-1 focus:ring-[#00a884] transition-all'
              type="text"
              placeholder='johndoe123' />
          </div>
          <div>
            <label className='block text-sm font-medium text-[#8696a0] mb-2'>Email</label>
            <div className="flex gap-2">
              <input
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className='flex-1 px-4 py-3 bg-[#2a3942] text-[#e9edef] border-none rounded-md focus:outline-none focus:ring-1 focus:ring-[#00a884] transition-all'
                type="email"
                placeholder='john@example.com' 
                disabled={otpSent}
              />
              <button 
                type="button" 
                onClick={sendOtpHandler}
                disabled={sendingOtp || otpSent}
                className="bg-[#2a3942] text-[#00a884] hover:bg-[#3a4b55] px-4 rounded-md font-medium transition-colors disabled:opacity-50"
              >
                {sendingOtp ? 'Sending...' : otpSent ? 'Sent' : 'Send OTP'}
              </button>
            </div>
          </div>
          
          {otpSent && (
            <div>
              <label className='block text-sm font-medium text-[#8696a0] mb-2'>Enter OTP</label>
              <input
                value={user.otp}
                onChange={(e) => setUser({ ...user, otp: e.target.value })}
                className='w-full px-4 py-3 bg-[#2a3942] text-[#e9edef] border-none rounded-md focus:outline-none focus:ring-1 focus:ring-[#00a884] transition-all tracking-widest text-center'
                type="text"
                placeholder='123456' 
                maxLength="6"
              />
            </div>
          )}

          <div>
            <label className='block text-sm font-medium text-[#8696a0] mb-2'>Password</label>
            <input
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className='w-full px-4 py-3 bg-[#2a3942] text-[#e9edef] border-none rounded-md focus:outline-none focus:ring-1 focus:ring-[#00a884] transition-all'
              type="password"
              placeholder='Enter your password' />
          </div>
          <div>
            <label className='block text-sm font-medium text-[#8696a0] mb-2'>Confirm Password</label>
            <input
              value={user.confirmPassword}
              onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
              className='w-full px-4 py-3 bg-[#2a3942] text-[#e9edef] border-none rounded-md focus:outline-none focus:ring-1 focus:ring-[#00a884] transition-all'
              type="password"
              placeholder='Confirm your password' />
          </div>
          <div className='flex items-center gap-6 my-2 p-2'>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input
                type="radio"
                name="gender"
                checked={user.gender === "male"}
                onChange={() => handleCheckbox("male")}
                className="w-4 h-4 text-[#00a884] bg-[#2a3942] border-gray-600 focus:ring-[#00a884] focus:ring-2" />
              <span className="text-[#e9edef] text-sm">Male</span>
            </label>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input
                type="radio"
                name="gender"
                checked={user.gender === "female"}
                onChange={() => handleCheckbox("female")}
                className="w-4 h-4 text-[#00a884] bg-[#2a3942] border-gray-600 focus:ring-[#00a884] focus:ring-2" />
              <span className="text-[#e9edef] text-sm">Female</span>
            </label>
          </div>
          
          <div className="pt-4">
            <button type='submit' disabled={loading} className='w-full bg-[#00a884] hover:bg-[#008f6f] text-white font-medium py-3 rounded-md transition-colors disabled:opacity-70 flex justify-center items-center'>
                {loading ? <span className="loading loading-spinner loading-md"></span> : "Sign Up"}
            </button>
          </div>

          <p className='text-center text-[#8696a0] mt-6'>
            Already have an account? <Link to="/login" className="text-[#00a884] hover:underline transition-colors">Login</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Signup