"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/userContext";

type MoodCategory = {
  label: string;
  value: string;
  emoji: string;
};

const moodCategories: MoodCategory[] = [
  { label: "All", value: "all", emoji: "🌈" },
  { label: "Joy", value: "joy", emoji: "😊" },
  { label: "Sorrow", value: "sorrow", emoji: "😢" },
  { label: "Angry", value: "angry", emoji: "😡" },
  { label: "Surprise", value: "surprise", emoji: "😲" },
  { label: "Chill", value: "chill", emoji: "😌" },
];

const HistoryPage = () => {
  const { history } = useUser();
  const [selectedMood, setSelectedMood] = useState("all");
  const router = useRouter();

  const filtered = selectedMood === "all"
    ? history
    : history.filter((his) => his.dominant === selectedMood);

  return (
    <div className="min-h-screen p-6 text-black bg-white">
      <h1 className="text-3xl font-bold mb-6">🎵 Mood Playlist History</h1>

      {/* Mood Category Buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        {moodCategories.map((cat) => (
          <button
            key={cat.value}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedMood === cat.value
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setSelectedMood(cat.value)}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Playlist Cards */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((his) =>
            his.recommendedPlaylists.map((playlist) => (
              <div
                key={`${his._id}-${playlist._id}`}
                className="cursor-pointer border rounded-xl overflow-hidden shadow hover:shadow-xl transition"
                onClick={() => router.push(`/history/${playlist._id}`)}
              >
                <img
                  src={playlist.imageUrl}
                  alt={playlist.name}
                  className="w-full h-60 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold">{playlist.name}</h2>
                  <p className="text-sm text-gray-500">{his.dominant.toUpperCase()} • {his.recommendedMusicMood}</p>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="text-center mt-20 text-lg text-gray-500">
          <p className="text-black text-2xl">No recommended playlists found.</p>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
