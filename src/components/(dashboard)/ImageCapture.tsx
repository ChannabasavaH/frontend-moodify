'use client'

import React, { useState, useRef, ChangeEvent, useEffect } from 'react'

interface ImageCaptureProps {
  imagePreview: string | null
  setImagePreview: (preview: string | null) => void
  setImage: (file: File | null) => void
}

const ImageCapture: React.FC<ImageCaptureProps> = ({ 
  imagePreview, 
  setImagePreview, 
  setImage 
}) => {
  const [isCapturing, setIsCapturing] = useState<boolean>(false)
  const [streamError, setStreamError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Handle file upload
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files
    if (files && files[0]) {
      const file = files[0]
      setImage(file)
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
    }
  }

  // Clean up function for webcam stream
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  // Watch for changes to stream and connect to video element
  useEffect(() => {
    if (streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current
      videoRef.current.play()
        .then(() => {
          console.log("Video is playing")
        })
        .catch(err => {
          console.error("Error playing video:", err)
          setStreamError("Could not play video stream")
        })
    }
  }, [streamRef.current])

  // Start webcam capture
  const startCapture = async (): Promise<void> => {
    setStreamError(null)
    try {
      // Stop any existing stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      
      console.log("Requesting camera access...")
      
      // Request access to webcam with specific constraints
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      })
      
      console.log("Camera access granted, setting up stream...")
      
      // Store the stream reference - this will trigger the useEffect above
      streamRef.current = stream
      setIsCapturing(true)
      
    } catch (err) {
      console.error("Webcam error:", err)
      setStreamError(`Could not access webcam: ${err instanceof Error ? err.message : String(err)}. Please make sure you've granted permission.`)
    }
  }

  // Capture image from webcam
  const captureImage = (): void => {
    if (!videoRef.current || !streamRef.current) {
      console.error("Cannot capture: video or stream not available")
      setStreamError("Cannot capture: video or stream not available")
      return
    }

    try {
      const canvas = document.createElement('canvas')
      const videoElem = videoRef.current
      
      // Check if video dimensions are available
      const videoWidth = videoElem.videoWidth || 640
      const videoHeight = videoElem.videoHeight || 480
      
      console.log("Video dimensions:", videoWidth, videoHeight)
      
      // Set canvas size to match video
      canvas.width = videoWidth
      canvas.height = videoHeight

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        console.error("Could not get canvas context")
        setStreamError("Could not get canvas context")
        return
      }
      
      // Draw video frame to canvas
      ctx.drawImage(videoElem, 0, 0, canvas.width, canvas.height)

      // Convert to blob
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "webcam-capture.png", { type: "image/png" })
          setImage(file)
          const previewUrl = URL.createObjectURL(blob)
          setImagePreview(previewUrl)
          stopCapture()
        } else {
          console.error("Failed to create image blob")
          setStreamError("Failed to create image blob")
        }
      }, 'image/png', 0.9) // Use 90% quality for better image
    } catch (error) {
      console.error("Error capturing image:", error)
      setStreamError(`Error capturing image: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  // Stop webcam stream
  const stopCapture = (): void => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsCapturing(false)
  }

  return (
    <div className="mb-4 p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-black">Upload or Capture Image</h2>

      {/* Image preview */}
      {imagePreview && (
        <div className="mb-4">
          <img
            src={imagePreview}
            alt="Preview"
            className="max-w-full h-auto rounded-lg max-h-64 mx-auto"
          />
        </div>
      )}

      {/* Webcam stream */}
      <div className={`mb-4 ${!isCapturing ? 'hidden' : ''}`}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="max-w-full h-auto rounded-lg max-h-64 mx-auto"
        />
      </div>

      {/* Stream error message */}
      {streamError && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {streamError}
        </div>
      )}

      {/* Upload/capture buttons */}
      <div className="flex flex-wrap gap-3 mt-4">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          type="button"
        >
          Upload Image
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {!isCapturing ? (
          <button
            onClick={startCapture}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            type="button"
          >
            Use Webcam
          </button>
        ) : (
          <>
            <button
              onClick={captureImage}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              type="button"
            >
              Take Photo
            </button>
            <button
              onClick={stopCapture}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              type="button"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default ImageCapture