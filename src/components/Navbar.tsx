'use client';

import React from 'react'
import Link from 'next/link';

const Navbar = () => {
  return (
    <div className="w-full bg-black p-4 flex justify-between items-center">
      <div className='flex justify-center items-center'>
        <p className='text-white text-lg'>Moodify</p>
      </div>
      <div className='flex flex-row justify-center items-center gap-x-4'>
        <Link href={'/signup'}>
          <p className='text-white text-lg'>Sign Up</p>
        </Link>
        <Link href={'/login'}>
          <p className='text-white text-lg'>Login</p>
        </Link>
      </div>
    </div>
  )
}

export default Navbar