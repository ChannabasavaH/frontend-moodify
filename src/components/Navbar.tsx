'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/services/auth';
import { setAccessToken } from '@/utils/auth';

const Navbar = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem('accessToken'));

    const handleTokenChange = () => {
      setToken(localStorage.getItem('accessToken'));
    };

    window.addEventListener('accessTokenUpdated', handleTokenChange);
    return () => window.removeEventListener('accessTokenUpdated', handleTokenChange);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/api/users/logout');
      setAccessToken(null);
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div className="w-full bg-black p-4 flex justify-between items-center">
      <div className="flex justify-center items-center">
        <Link href="/">
          <p className="text-white text-lg">Moodify</p>
        </Link>
      </div>
      {!token ? (
        <div className="flex flex-row justify-center items-center gap-x-4">
          <Link href="/signup">
            <p className="text-white text-lg">Sign Up</p>
          </Link>
          <Link href="/login">
            <p className="text-white text-lg">Login</p>
          </Link>
        </div>
      ) : (
        <button onClick={handleLogout} className="text-white text-lg cursor-pointer">
          Logout
        </button>
      )}
    </div>
  );
};

export default Navbar;
