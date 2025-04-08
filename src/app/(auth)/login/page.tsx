"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { setAccessToken } from "@/utils/auth";
import { toast } from "react-toastify";

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

    const result = loginSchema.safeParse(user);
    if (!result.success) {
      const formattedErrors = result.error.flatten().fieldErrors;
      setErrors({
        email: formattedErrors.email?.[0],
        password: formattedErrors.password?.[0],
      });
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
        setAccessToken(res.data.accessToken);
      }

      router.push("/dashboard");
      toast.success("Logged In, successfully!", {
        position: "bottom-left",
        style: {
          background: "#4CAF50",
          color: "#fff",
        },
      });
    } catch (error: any) {
      if (error.response) {
        setGeneralError(error.response.data.message || "Login failed");
        toast.error("Logged In failed! Try again", {
          position: "bottom-left",
          style: {
            background: "#f44336",
            color: "#fff",
          },
        });
      }
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-white p-2">
      <form
        onSubmit={handleSubmit}
        className="w-full h-full md:w-1/2 md:h-1/2 bg-black flex flex-col justify-center items-center gap-y-8 p-8 rounded-md"
      >
        <h1 className="text-4xl" style={{ fontFamily: "jua, sans-serif" }}>
          Login
        </h1>
        <div className="w-full flex flex-col justify-center items-start gap-y-4">
          <label htmlFor="email" className="text-xl">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full md:w-2/3 lg:w-4/5 p-2 rounded-md"
            placeholder="Enter your email"
            value={user.email}
            onChange={handleChange}
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>
        <div className="w-full flex flex-col justify-center items-start gap-y-4">
          <label htmlFor="password" className="text-xl">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full md:w-2/3 lg:w-4/5 p-2 rounded-md"
            placeholder="Enter your password"
            value={user.password}
            onChange={handleChange}
            required
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>
        {generalError && (
          <p className="text-center text-red-500 text-lg">{generalError}</p>
        )}
        <button className="hover:border-2 hover:border-white w-36 h-12 rounded-lg text-center text-lg cursor-pointer">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Page;
