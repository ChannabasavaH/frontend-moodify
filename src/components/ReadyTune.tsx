'use client'

import React from 'react'
import { IoMusicalNotesOutline } from "react-icons/io5";
import Link from 'next/link';

const ReadyTune = () => {
    return (
        <div className='w-full flex flex-col justify-center items-center gap-y-6'>
            <div className='flex justify-center items-center text-6xl text-black'>
                <IoMusicalNotesOutline />
            </div>
            <div className='lg:w-1/2 flex flex-col justify-center items-center gap-y-6 p-2'>
                <h3 className='text-black text-4xl'
                    style={{ fontFamily: "jua, sans-serif" }}>
                    Ready to Tune In?
                </h3>
                <p className='text-2xl font-[Libre_Baskerville] text-[#30362F]'>
                    Just a click separates you from your personalised playlist.
                    Hit ‘Generate’ or ‘Explore’ to dive in the ocean of music tailored for your current mood.
                </p>
                <Link href={'/signup'}>
                    <button className='h-12 w-40 bg-black text-white text-center rounded-md cursor-pointer'>
                        Let's Get Started
                    </button>
                </Link>
            </div>
        </div>
    )
}

export default ReadyTune