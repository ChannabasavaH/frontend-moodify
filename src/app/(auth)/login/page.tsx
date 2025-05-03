"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { setAccessToken } from "@/utils/auth";
import { toast } from "react-toastify";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";


const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be atleast 6 characters long"),
});

interface UserData {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  accessToken: string;
}

const Page = () => {
  const router = useRouter();

  const [user, setUser] = useState<UserData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const data = {
    email: user.email,
    password: user.password,
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneralError(null);

    const result = loginSchema.safeParse(user);
    if (!result.success) {
      const formattedErrors = result.error.flatten().fieldErrors;
      setErrors({
        email: formattedErrors.email?.[0],
        password: formattedErrors.password?.[0],
      });
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post<LoginResponse>(
        "http://localhost:8080/api/users/login",
        data,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.accessToken) {
        // Store the token in localStorage (this triggers the accessTokenUpdated event)
        setAccessToken(res.data.accessToken);

        // Wait a short moment for the context to update before navigating
        // This ensures the navbar will have the updated state
        setTimeout(() => {
          router.push("/dashboard");
          toast.success("Logged In, successfully!", {
            position: "bottom-left",
            style: {
              background: "#4CAF50",
              color: "#fff",
            },
          });
        }, 100);
      }
    } catch (error: any) {
      if (error.response) {
        setGeneralError(error.response.data.message ?? "Login failed");
        toast.error("Logged In failed! Try again", {
          position: "bottom-left",
          style: {
            background: "#f44336",
            color: "#fff",
          },
        });
      }
    } finally {
      setIsLoading(false);
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
              Login
            </h1>
            <div className="w-16 h-1 bg-white rounded-full"></div>
          </div>
          <form onSubmit={handleSubmit}>
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
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div className="mb-8 relative">
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
                disabled={isLoading}
              />

              {/* Eye Icon */}
              <div
                className="absolute right-3 top-[70%] translate-y-[-50%] cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
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

            {generalError && (
              <div className="mb-6">
                <p className="text-center text-red-500 text-lg">
                  {generalError}
                </p>
              </div>
            )}

            <div className="flex justify-center">
              <button
                className="bg-white text-black py-3 px-8 rounded-lg font-medium text-lg transition-all duration-300 hover:bg-gray-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Submit"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer">
              Forgot password?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
