"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/services/auth";

const PlaylistHistoryPage = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const res = await api.get(`/api/history/${id}`);
        setPlaylist(res.data.playlist);
      } catch (err) {
        console.error("Error fetching playlist:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!playlist) return <div className="p-6 text-red-500">Playlist not found.</div>;

  return (
    <div className="min-h-screen bg-white from-gray-800 to-black text-black p-8">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-10">
        <img
          src={playlist.imageUrl}
          alt={playlist.name}
          className="w-64 h-64 object-cover rounded shadow-lg"
        />
        <div>
          <p className="uppercase text-sm tracking-wide text-gray-300">Playlist</p>
          <h1 className="text-4xl font-bold mt-2 mb-4">{playlist.name}</h1>
          <p className="text-gray-300 mb-2">{playlist.description}</p>
          <p className="text-sm text-gray-400">{playlist.tracks} tracks</p>
          <a
            href={playlist.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Open on Spotify
          </a>
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto mt-6">
        <iframe
          src={playlist.embedUrl}
          width="100%"
          height="380"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="rounded shadow-xl"
        ></iframe>
      </div>
    </div>
  );
};

export default PlaylistHistoryPage;
