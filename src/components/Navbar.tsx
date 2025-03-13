'use client';

import React, { useState, useEffect } from 'react'
import Link from 'next/link';
import axios from 'axios';

const Navbar = () => {

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem('accessToken'));
  }, [])

  const handleLogout = async () => {
    try {
      const res = await axios.post('http://localhost:8080/api/users/logout');
      console.log(res.data)
      localStorage.removeItem('accessToken');
      setToken(null);
      window.location.href = '/login';
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="w-full bg-black p-4 flex justify-between items-center">
      <div className='flex justify-center items-center'>
        <Link href={'/'}>
          <p className='text-white text-lg'>Moodify</p>
        </Link>
      </div>
      {(!token) ? (
        <div className='flex flex-row justify-center items-center gap-x-4'>
          <Link href={'/signup'}>
            <p className='text-white text-lg'>Sign Up</p>
          </Link>
          <Link href={'/login'}>
            <p className='text-white text-lg'>Login</p>
          </Link>
        </div>
      ) : (
        <button
          onClick={handleLogout}
          className='text-white text-lg cursor-pointer'
        >
          Logout
        </button>
      )}
    </div>
  )
}

export default Navbar