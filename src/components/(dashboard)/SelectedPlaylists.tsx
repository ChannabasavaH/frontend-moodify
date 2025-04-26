import React, { useCallback, useState, useEffect } from "react";
import { PlaylistInfo } from "@/types";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { api } from "@/services/auth";
import { toast } from "react-toastify";

interface PlaylistCardProps {
  playlist: PlaylistInfo & { _id: string };
  mood: string;
}

const SelectedPlaylist: React.FC<PlaylistCardProps> = ({ playlist, mood }) => {
  const [favoriteStatus, setFavoriteStatus] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await api.get("/api/favorites");
        const favoritePlaylists = res.data.favoritePlaylists;

        // Map the favorite status for each playlist
        const updatedFavoriteStatus: { [key: string]: boolean } = {};

        favoritePlaylists.forEach((fav: any) => {
          updatedFavoriteStatus[fav.playlist] = true;
        });

        setFavoriteStatus(updatedFavoriteStatus);
      } catch (err) {
        console.log("Error fetching favorites", err);
      }
    };

    fetchFavorites();
  }, []);

  const addToFavorites = async () => {
    try {
      const data = {
        playlistId: playlist._id,
        moodTag: mood,
      };

      const res = await api.post("/api/favorites", data);
      console.log(res);
      toast.success("Added to favorites!", {
        position: "bottom-left",
        style: {
          background: "#4CAF50",
          color: "#fff",
        },
      });
    } catch (error) {
      console.log("Error while adding to favorites: ", error);
      toast.error("Error while adding to favorites", {
        position: "bottom-left",
        style: {
          background: "#f44336",
          color: "#fff",
        },
      });
    }
  };

  const removeFromFavorites = async () => {
    try {
      const res = await api.delete("/api/favorites", {
        data: {
          playlistId: playlist._id,
        },
      });
      console.log(res);
      toast.success("Removed from favorites!", {
        position: "bottom-left",
        style: {
          background: "#4CAF50",
          color: "#fff",
        },
      });
    } catch (error) {
      console.log("Error while removing from playlists: ", error);
      toast.error("Error while removing from playlists", {
        position: "bottom-left",
        style: {
          background: "#f44336",
          color: "#fff",
        },
      });
    }
  };

  const toggleFavorite = useCallback(async () => {
    try {
      const updatedFavoriteStatus = { ...favoriteStatus }; // Copy current state

      if (!favoriteStatus[playlist._id]) {
        // If the playlist is not in favorites, add it
        await addToFavorites();
        updatedFavoriteStatus[playlist._id] = true;
      } else {
        // If the playlist is already in favorites, remove it
        await removeFromFavorites();
        updatedFavoriteStatus[playlist._id] = false;
      }

      // Update the favorite status for that specific playlist
      setFavoriteStatus(updatedFavoriteStatus);
    } catch (error) {
      console.log("Error updating favorites:", error);
    }
  }, [favoriteStatus, playlist._id]);

  return (
    <div className="mt-6">
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/3">
            <div className="relative group">
              <img
                src={playlist.imageUrl}
                alt={playlist.name}
                className="w-full h-auto rounded-lg shadow-md"
              />

              <button
                onClick={toggleFavorite}
                className={`absolute bottom-2 right-2 p-2 rounded-full transition-opacity opacity-0 group-hover:opacity-100 ${
                  favoriteStatus[playlist._id] ? "text-red-500" : "text-white"
                } bg-black/50`}
              >
                {favoriteStatus[playlist._id] ? (
                  <FaHeart size={20} />
                ) : (
                  <FaRegHeart size={20} />
                )}
              </button>
            </div>

            <div className="mt-2">
              <p className="text-sm text-gray-600">{playlist.tracks} tracks</p>
              <a
                href={playlist.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-indigo-600 hover:text-indigo-800"
              >
                Open in Spotify
              </a>
            </div>
          </div>
          <div className="w-full md:w-2/3">
            <h3 className="text-xl font-semibold mb-2 text-black">
              {playlist.name}
            </h3>
            {playlist.description && (
              <p className="text-sm text-gray-600 mb-4">
                {playlist.description}
              </p>
            )}
            <div className="mt-4 aspect-video w-full">
              <iframe
                src={playlist.embedUrl}
                width="100%"
                height="100%"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title={`Spotify playlist: ${playlist.name}`}
                className="rounded-md"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedPlaylist;
