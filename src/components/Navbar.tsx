"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { setAccessToken } from "@/utils/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/context/userContext";
import { api } from "@/services/auth";

const Navbar = () => {
  const [dropDown, setDropDown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user, fetchUser } = useUser();

  const handleLogout = async () => {
    try {
      await api.post("/api/users/logout");
      setAccessToken(null);
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleDropDown = () => {
    setDropDown((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropDown(false);
      }
    };

    if (dropDown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropDown]);

  const isLoggedIn = !!user;

  return (
    <div className="w-full bg-black p-4 flex justify-between items-center">
      <div className="flex justify-center items-center">
        <Link href="/">
          <p className="text-white text-lg font-bold">Moodify</p>
        </Link>
      </div>

      {!isLoggedIn ? (
        <div className="flex flex-row justify-center items-center gap-x-4">
          <Link href="/signup">
            <p className="text-white text-lg hover:text-gray-300 transition">
              Sign Up
            </p>
          </Link>
          <Link href="/login">
            <p className="text-white text-lg hover:text-gray-300 transition">
              Login
            </p>
          </Link>
        </div>
      ) : (
        <div className="relative inline-block text-left" ref={dropdownRef}>
          <div className="flex items-center gap-4">
            <Avatar
              onClick={handleDropDown}
              className="cursor-pointer h-10 w-10 border-2 border-white hover:opacity-90 transition"
            >
              <AvatarImage
                src={user?.profilePhoto}
                alt="Profile"
                width={40}
                height={40}
                className="object-cover"
              />
              <AvatarFallback className="text-lg bg-blue-600">
                {user?.username?.charAt(0).toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
          </div>

          {dropDown && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
              <div className="py-1">
                <Link href="/user-profile">
                  <p className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition">
                    Profile
                  </p>
                </Link>
                <Link href="/favorites">
                  <p className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition">
                    Favorites
                  </p>
                </Link>
                <Link href="/history">
                  <p className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition">
                    History
                  </p>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;