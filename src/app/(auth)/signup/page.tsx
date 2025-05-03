"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "react-toastify";
import Link from "next/link";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";


const signUpSchema = z.object({
  username: z.string().min(3, "Username must be atleast 3 characters long"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be atleast 6 characters long"),
});

interface UserData {
  username: string;
  email: string;
  password: string;
}

const Page = () => {
  const router = useRouter();

  const [user, setUser] = useState<UserData>({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
  }>({});
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const data = {
    username: user.username,
    email: user.email,
    password: user.password,
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = signUpSchema.safeParse(user);
    if (!result.success) {
      const formattedErrors = result.error.flatten().fieldErrors;
      setErrors({
        username: formattedErrors.username?.[0],
        email: formattedErrors.email?.[0],
        password: formattedErrors.password?.[0],
      });
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/users/signup", data);
      router.push(`/verify?username=${user.username}`);
      toast.success("Signed up successfully!", {
        position: "bottom-left",
        style: {
          background: "#4CAF50",
          color: "#fff",
        },
      });
    } catch (error: any) {
      if (error.response) {
        console.log("Server error: ", error.response.data);
      }
      console.log("Error in signing up", error);
      toast.error("Failed to sign up! Try again", {
        position: "bottom-left",
        style: {
          background: "#f44336",
          color: "#fff",
        },
      });
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-white p-4">
      <div className="w-full max-w-md transition-all duration-300 hover:translate-y-[-8px]">
        <div className="bg-black text-white rounded-xl shadow-2xl p-8 transition-all duration-300 hover:shadow-[0_20px_30px_rgba(0,0,0,0.2)]">
          <div className="flex flex-col items-center mb-8">
            <h1
              className="text-4xl font-bold mb-2"
              style={{ fontFamily: "jua, sans-serif" }}
            >
              Sign Up
            </h1>
            <div className="w-16 h-1 bg-white rounded-full"></div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="username"
                className="block text-lg mb-2 font-medium"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-white"
                placeholder="Enter your username"
                value={user.username}
                onChange={handleChange}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="email" className="block text-lg mb-2 font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-white"
                placeholder="Enter your email"
                value={user.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div className="mb-8">
              <label
                htmlFor="password"
                className="block text-lg mb-2 font-medium"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-white pr-12"
                placeholder="Enter your password"
                value={user.password}
                onChange={handleChange}
              />
              <div 
              className="absolute right-10 top-[68%] translate-y-[-50%] cursor-pointer"
              onClick={() => {setShowPassword(!showPassword)}}>
                {showPassword ? (
                  <FaRegEye size={20} color="#fff" />
                ) : (
                  <FaRegEyeSlash size={20} color="#fff" />
                )}
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div className="flex justify-center">
              <button className="bg-white text-black py-3 px-8 rounded-lg font-medium text-lg transition-all duration-300 hover:bg-gray-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 cursor-pointer">
                Submit
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account? <Link href={"/login"} className="hover: text-white">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
