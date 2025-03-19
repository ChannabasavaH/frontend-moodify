'use client'

import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { z } from 'zod';

const signUpSchema = z.object({
  username: z.string().min(3, "Username must be atleast 3 characters long"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be atleast 6 characters long"),
})

interface UserData {
  username: string,
  email: string,
  password: string
}

const Page = () => {

  const router = useRouter();

  const [user, setUser] = useState<UserData>({
    username: "",
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<{username?: string; email?: string; password?: string}>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUser(prev => ({
      ...prev,
      [id]: value
    }));
  }

  const data = {
    username: user.username,
    email: user.email,
    password: user.password
  }

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = signUpSchema.safeParse(user);
    if (!result.success) {
      const formattedErrors = result.error.flatten().fieldErrors;
      setErrors({
        username: formattedErrors.username?.[0],
        email: formattedErrors.email?.[0],
        password: formattedErrors.password?.[0],
      });
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/api/users/signup", data);
      console.log(res.data);
      router.push('/login');
    } catch (error: any) {
      if(error.response){
        console.log("Server error: ", error.response.data);
      }
      console.log("Error in signing up", error);
    }
  }

  return (
    <div className='w-full min-h-screen flex justify-center items-center bg-white p-2'>
      <form onSubmit={handleSubmit} className='w-full h-full md:w-1/2 md:h-1/2 bg-black flex flex-col justify-center items-center gap-y-8 p-8 rounded-md'>
        <h1 className='text-4xl' style={{ fontFamily: "jua, sans-serif" }}>
          Sign Up
        </h1>
        <div className='w-full flex flex-col justify-center items-start gap-y-4'>
          <label htmlFor="username" className='text-xl'>Username</label>
          <input
            type="text"
            id='username'
            className='w-full md:w-2/3 lg:w-4/5 p-2 rounded-md'
            placeholder='Enter your username'
            value={user.username}
            onChange={handleChange}
            required
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
        </div>
        <div className='w-full flex flex-col justify-center items-start gap-y-4'>
          <label htmlFor="email" className='text-xl'>Email</label>
          <input
            type="email"
            id='email'
            className='w-full md:w-2/3 w-4/5 p-2 rounded-md'
            placeholder='Enter your email'
            value={user.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>
        <div className='w-full flex flex-col justify-center items-start gap-y-4'>
          <label htmlFor="password" className='text-xl'>Password</label>
          <input
            type="password"
            id='password'
            className='w-full md:w-2/3 w-4/5 p-2 rounded-md'
            placeholder='Enter your password'
            value={user.password}
            onChange={handleChange}
            required
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>
        <button className='hover:border-2 hover:border-white w-36 h-12 rounded-lg text-center text-lg cursor-pointer'>
          Submit
        </button>
      </form>
    </div>
  )
}

export default Page