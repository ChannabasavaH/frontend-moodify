"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { api } from "@/services/auth";

type User = {
  username: string;
  email: string;
  profilePhoto: string;
  mobileNo: string;
  location: string;
};

type Playlist = {
  _id: string;
  name: string;
  imageUrl: string;
};

type Favorite = {
  moodTag: string;
  playlist: Playlist;
};

type History = {
  dominant: string;
  recommendedPlaylists: Playlist;
};

type UserContextType = {
  user: User | null;
  favorites: Favorite[];
  history: History[];
  loading: boolean;
  fetchUser: () => Promise<void>;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [history, setHistory] = useState<History[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await api.get("/api/dashboard");
      const userData = res.data.user.user;

      if (userData) {
        setUser({
          username: userData.username ?? "",
          email: userData.email ?? "",
          profilePhoto:
            userData.profilePhoto ?? "https://github.com/shadcn.png",
          mobileNo: userData.mobileNo ?? "",
          location: userData.location ?? "",
        });

        setFavorites(res.data?.favoritePlaylists ?? []);
        setHistory(res.data?.moodHistory?.moodHistory ?? []);
      }
    } catch (err) {
      console.error("Failed to fetch user data", err);
      setUser(null);
      setFavorites([]);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }
  
    const timeout = setTimeout(() => {
      fetchUser();
    }, 300);
  
    return () => clearTimeout(timeout);
  }, []);

  // Listen for token updates from setAccessToken
  useEffect(() => {
    const handleTokenUpdate = () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        // Set loading to true when we're fetching new data
        setLoading(true);
        fetchUser();
      } else {
        // Clear user data if token is removed
        setUser(null);
        setFavorites([]);
        setHistory([]);
        setLoading(false);
      }
    };

    // Listen for the custom event from setAccessToken
    window.addEventListener('accessTokenUpdated', handleTokenUpdate);

    return () => {
      window.removeEventListener('accessTokenUpdated', handleTokenUpdate);
    };
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      favorites,
      history,
      loading,
      fetchUser,
    }),
    [user, favorites, history, loading]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};