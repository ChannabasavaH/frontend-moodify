"use client";

import { useUser, UserContext } from "@/context/userContext";
import { useState, useEffect, useContext } from "react";
import { z } from "zod";
import { toast } from "react-toastify";
import { api } from "@/services/auth";

const userProfileSchema = z.object({
  mobileNo: z
    .string()
    .length(10, { message: "Mobile number must be exactly 10 digits." })
    .regex(/^\d{10}$/, { message: "Mobile number must contain only digits." }),
  location: z
    .string()
    .min(2, { message: "Location must be at least 2 characters." })
    .max(100, { message: "Location cannot exceed 100 characters." }),
});

const Page = () => {
  const { user }: any = useContext(UserContext)

  const [userData, setUserData] = useState({
    username: user?.username ?? "",
    email: user?.email ?? "",
    profilePhoto: user?.profilePhoto ?? "https://github.com/shadcn.png",
    mobileNo: user?.mobileNo ?? "",
    location: user?.location ?? "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>(userData.profilePhoto);
  const [errors, setErrors] = useState<{ mobileNo?: string; location?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    setUserData({
      username: user?.username ?? "",
      email: user?.email ?? "",
      profilePhoto: user?.profilePhoto ?? "https://github.com/shadcn.png",
      mobileNo: user?.mobileNo ?? "",
      location: user?.location ?? "",
    });
    setPreviewImage(user?.profilePhoto ?? "https://github.com/shadcn.png");
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [id]: value,
    }));
    if (errors[id as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [id]: undefined }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (previewImage !== userData.profilePhoto) {
        URL.revokeObjectURL(previewImage);
      }
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const result = userProfileSchema.safeParse({
      mobileNo: userData.mobileNo,
      location: userData.location,
    });

    if (!result.success) {
      const formattedErrors = result.error.flatten().fieldErrors;
      setErrors({
        mobileNo: formattedErrors.mobileNo?.[0],
        location: formattedErrors.location?.[0],
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("mobileNo", userData.mobileNo);
      formData.append("location", userData.location);
      if (selectedFile) {
        formData.append("profilePhoto", selectedFile);
      }

      await api.put("/api/users/user-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Profile updated successfully!", {
        position: "bottom-left",
        style: { background: "#4CAF50", color: "#fff" },
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile! Try again.", {
        position: "bottom-left",
        style: { background: "#f44336", color: "#fff" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md text-black">
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src={previewImage}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mb-4"
            />
            <label
              htmlFor="profilePhoto"
              className="absolute bottom-3 right-0 bg-blue-500 p-1 rounded-full cursor-pointer hover:bg-blue-600 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </label>
            <input
              id="profilePhoto"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          <h2 className="text-2xl font-semibold mb-2">{userData.username}</h2>
          <p className="text-gray-500 mb-6">{userData.email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="mobileNo" className="block mb-1 font-medium">Mobile Number</label>
            <input
              type="text"
              id="mobileNo"
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your mobile number"
              value={userData.mobileNo}
              onChange={handleChange}
              maxLength={10}
            />
            {errors.mobileNo && <p className="text-red-500 text-sm mt-1">{errors.mobileNo}</p>}
          </div>

          <div>
            <label htmlFor="location" className="block mb-1 font-medium">Location</label>
            <input
              type="text"
              id="location"
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your location"
              value={userData.location}
              onChange={handleChange}
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full ${isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"} text-white py-2 rounded-md transition flex items-center justify-center`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Updating...
              </>
            ) : (
              "Update Profile"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
