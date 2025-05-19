'use client'

import React from 'react'
import { GiMusicalNotes } from "react-icons/gi";

const WelcomeMoodify = () => {
    return (
        <div className='w-full h-full bg-#f5f1d1 flex flex-col gap-y-20 p-4'>
            <div className='flex flex-col justify-center items-center gap-y-6'>
                <h3 className='text-black text-4xl'
                    style={{ fontFamily: "jua, sans-serif" }}>
                    Welcome to Moodify!
                </h3>
                <p className='lg:w-1/2 text-2xl font-[Libre_Baskerville] text-[#30362F]'>Where the mood of your face chooses the music taste.
                    Let’s venture into the world of rhythm and emotion where your facial
                    sentiment curates a unique playlist for you.
                </p>
            </div>
            <div className='animate-bounce w-full flex justify-evenly items-center text-black text-xl lg:text-6xl'>
                <GiMusicalNotes />
                <GiMusicalNotes />
                <GiMusicalNotes />
            </div>
            <div className='flex flex-col lg:flex-row lg:justify-evenly lg:items-center justify-center items-center gap-y-6'>
                <h3 className='text-4xl text-[#30362F]'
                style={{fontFamily: "jua, sans-serif"}}>
                    How it works?
                </h3>
                <p className='lg:w-1/2 text-2xl font-[Libre_Baskerville] text-[#30362F]'>
                    We scan your face. We get the mood. We pick the tunes. 
                    That’s it, just hit the ‘Generate’ button and make your day melodious with Moodify.
                </p>
            </div>
        </div>
    )
}

export default WelcomeMoodify