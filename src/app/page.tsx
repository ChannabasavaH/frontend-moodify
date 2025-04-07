"use client";

import React from "react";
import WelcomeMoodify from "@/components/welcomeMoodify";
import ReadyTune from "@/components/ReadyTune";

export default function Home() {
  return (
    <div className="w-full flex flex-col justify-center gap-y-24">
      <div className="w-full h-[250px] lg:h-[500px] flex justify-center items-center bg-black">
        <p
          className="text-6xl md:text-[150px] lg:text-[200px] text-[#FFFBDB]"
          style={{ fontFamily: "jua, sana-serif" }}
        >
          MOODIFY
        </p>
      </div>
      <div className="bg-white">
        <WelcomeMoodify />
        <ReadyTune />
      </div>
    </div>
  );
}
