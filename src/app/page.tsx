"use client";
import React from "react";
import Image from "next/image";
import WelcomeMoodify from "@/components/WelcomeMoodify";
import ReadyTune from "@/components/ReadyTune";
import heroImage from "../../public/home-hero-image.jpg";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function Home() {
  const { ref, inView } = useInView({
    triggerOnce: true, // animate only once
    threshold: 0.3, // 30% in view
  });

  return (
    <div className="w-full flex flex-col justify-center">
      <div className="w-full h-screen relative">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt="BackgroundHeroImage"
            fill
            priority
            sizes="100vw"
            style={{
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40 z-10" />

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0 z-20 flex flex-col justify-center items-start px-8 md:px-16 lg:px-24 max-w-6xl"
        >
          <h1
            className="text-6xl md:text-8xl lg:text-9xl text-[#FFFBDB] mb-4"
            style={{ fontFamily: "jua, sans-serif" }}
          >
            MOODIFY
          </h1>

          <p className="text-xl md:text-2xl lg:text-3xl text-white mb-10 max-w-2xl">
            Your mood, your music. Discover songs that match exactly how you
            feel.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/login">
              <button className="bg-[#FFFBDB] hover:bg-[#f5f1d1] text-black font-bold py-3 px-10 rounded-md text-xl transition-all duration-300 cursor-pointer">
                Get Started
              </button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Content sections */}
      <div className="bg-[#f5f1d1] pt-8 pb-8">
        <WelcomeMoodify />
        <ReadyTune />
      </div>
    </div>
  );
}
