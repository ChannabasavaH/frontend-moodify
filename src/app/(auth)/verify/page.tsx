"use client";

import React, { useState } from "react";
import axios from "axios";
import InputOPT from "@/components/InputOTP";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

const Page = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get("username");

  const handleVerification = async () => {
    if (!username) {
      return console.log("Username not found in URL");
    }

    try {
      await axios.post("http://localhost:8080/api/users/verify", {
        username,
        code: Number(code),
      });

      router.push("/login");
      toast.success("Email verified, successfully!", {
        position: "bottom-left",
        style: {
          background: "#4CAF50",
          color: "#fff",
        },
      });
    } catch (error: any) {
      if (error.response) {
        console.log("Server error: ", error.response.data?.message);
        setError(error.response.data?.message);
        toast.error("Verification failed! Try again", {
          position: "bottom-left",
          style: {
            background: "#f44336",
            color: "#fff",
          },
        });
      } else {
        console.log("Error in verification", error.message);
        toast.error("Verification failed! Try again", {
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-4 bg-black">
      <h1 className="text-xl font-semibold">Welcome {username}!</h1>
      <p>Enter your OTP</p>
      <InputOPT value={code} onChange={setCode} />
      <button
        onClick={handleVerification}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Submit
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default Page;
