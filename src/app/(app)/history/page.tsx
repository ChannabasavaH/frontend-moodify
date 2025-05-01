"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/auth";

type Playlist = {
  _id: string;
  name: string;
  imageUrl: string;
};

type History = {
  dominant: string;
  playlist: Playlist;
};

const moodCategories = [
  { label: "All", value: "all", emoji: "🌈" },
  { label: "Joy", value: "joy", emoji: "😊" },
  { label: "Sorrow", value: "sorrow", emoji: "😢" },
  { label: "Angry", value: "angry", emoji: "😡" },
  { label: "Surprise", value: "surprise", emoji: "😲" },
  { label: "Chill", value: "chill", emoji: "😌" },
];

const HistoryPage = () => {
  const [history, setHistory] = useState<History[]>([]);
  const [selectedMood, setSelectedMood] = useState("all");
  const router = useRouter();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await api.get("/api/history");

        const moodData = res.data.moodHistory;

        const formatted: History[] = moodData.flatMap((entry: any) =>
          entry.recommendedPlaylists.map((playlist: any) => ({
            dominant: entry.dominant,
            playlist: playlist,
          }))
        );

        setHistory(formatted);
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
      }
    };

    fetchFavorites();
  }, []);

  const filtered =
    selectedMood === "all"
      ? history
      : history.filter((his) => his.dominant === selectedMood);

  return (
    <div className="min-h-screen p-6 text-black bg-white">
      <h1 className="text-3xl font-bold mb-6">🎵 History</h1>

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
          {filtered.map((his) => (
            <div
              key={`${his.dominant}-${his.playlist._id}`}
              className="cursor-pointer border rounded-xl overflow-hidden shadow hover:shadow-xl transition"
              onClick={() => router.push(`/history/${his.playlist._id}`)}
            >
              <img
                src={his.playlist.imageUrl}
                alt={his.playlist.name}
                className="w-full h-60 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold">{his.playlist.name}</h2>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-20 text-lg text-gray-500">
          <p className="text-black text-2xl">No favorite playlists found.</p>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
