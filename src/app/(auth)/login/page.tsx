'use client'

import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

interface UserData {
  email: string,
  password: string
}

interface LoginResponse {
  message: string,
  accessToken: string
}

const Page = () => {

  const router = useRouter();

  const [user, setUser] = useState<UserData>({
    email: "",
    password: "",
  })
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUser(prev => ({
      ...prev,
      [id]: value
    }));
  }

  const data = {
    email: user.email,
    password: user.password
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post<LoginResponse>(
        "http://localhost:8080/api/users/login",
        data,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      console.log(res.data);

      if (res.data.accessToken) {
        localStorage.setItem('accessToken', res.data.accessToken);
        console.log("Token stored in localStorage:", res.data.accessToken);
      }

      router.push('/analyze-emotion');
    } catch (error: any) {
      console.error("Error logging in:", error);
      if (error.response) {
        setError(error.response.data.message || "Login failed");
      } else {
        setError("Network error. Please try again.");
      }
    }
  }

  return (
    <div className='w-full min-h-screen flex justify-center items-center bg-white p-2'>
      <form onSubmit={handleSubmit} className='w-full h-full md:w-1/2 md:h-1/2 bg-black flex flex-col justify-center items-center gap-y-8 p-8 rounded-md'>
        <h1 className='text-4xl' style={{ fontFamily: "jua, sans-serif" }}>
          Login
        </h1>
        <div className='w-full flex flex-col justify-center items-start gap-y-4'>
          <label htmlFor="email" className='text-xl'>Email</label>
          <input type="email" id='email'
            className='w-full md:w-2/3 lg:w-4/5 p-2 rounded-md'
            placeholder='Enter your email'
            value={user.email}
            onChange={handleChange}
            required />
        </div>
        <div className='w-full flex flex-col justify-center items-start gap-y-4'>
          <label htmlFor="password" className='text-xl'>Password</label>
          <input type="text" id='password'
            className='w-full md:w-2/3 lg:w-4/5 p-2 rounded-md'
            placeholder='Enter your password'
            value={user.password}
            onChange={handleChange}
            required />
        </div>
        <button className='hover:border-2 hover:border-white w-36 h-12 rounded-lg text-center text-lg cursor-pointer'>
          Submit
        </button>
      </form>
    </div>
  )
}

export default Page