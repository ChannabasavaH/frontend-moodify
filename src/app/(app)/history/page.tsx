"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/userContext";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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

const ITEMS_PER_PAGE = 18;

const HistoryPage = () => {
  const { history } = useUser();
  const [selectedMood, setSelectedMood] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  // Filter based on mood
  const filteredHistory = selectedMood === "all"
    ? history
    : history.filter((his) => his.dominant === selectedMood);

  // Flatten playlist array with context info
  const flattenedPlaylists = filteredHistory.flatMap((his) =>
    his.recommendedPlaylists.map((playlist: any) => ({
      ...playlist,
      historyId: his._id,
      dominant: his.dominant,
      recommendedMusicMood: his.recommendedMusicMood,
    }))
  );

  // Pagination logic
  const totalPages = Math.ceil(flattenedPlaylists.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = flattenedPlaylists.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

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
            onClick={() => {
              setSelectedMood(cat.value);
              setCurrentPage(1); // Reset to page 1 on mood change
            }}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Playlist Cards */}
      {currentItems.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {currentItems.map((playlist) => (
              <div
                key={`${playlist.historyId}-${playlist._id}`}
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
                  <p className="text-sm text-gray-500">
                    {playlist.dominant.toUpperCase()} • {playlist.recommendedMusicMood}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-10 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious onClick={handlePrev} className={currentPage === 1 ? "pointer-events-none opacity-50" : ""} />
                  </PaginationItem>
                  <PaginationItem>
                    <span className="px-4 py-2 text-sm font-medium text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext onClick={handleNext} className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      ) : (
        <div className="text-center mt-20 text-lg text-gray-500">
          <p className="text-black text-2xl">No recommended playlists found.</p>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
