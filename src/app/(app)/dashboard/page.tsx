'use client'

import React, { useState, useRef, ChangeEvent } from 'react'
import { api } from '@/services/auth'
import { AxiosError } from 'axios'

interface EmotionAnalysis {
  joy: string
  sorrow: string
  angry: string
  surprise: string
}

interface PlaylistInfo {
  id: string
  name: string
  description: string
  imageUrl: string
  externalUrl: string
  tracks: number
  embedUrl: string
}

interface AnalysisResponse {
  emotions: EmotionAnalysis
  dominant: string
  confidenceScore: number
  recommendedMusicMood: string
  recommendedPlaylists: PlaylistInfo[]
}

const Dashboard: React.FC = () => {
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null)
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null)

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

  // Start webcam capture
  const startCapture = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      streamRef.current = stream
      setIsCapturing(true)
    } catch (err) {
      setError("Could not access webcam. Please make sure you've granted permission.")
      console.error("Webcam error:", err)
    }
  }

  // Capture image from webcam
  const captureImage = (): void => {
    if (!videoRef.current) return

    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight

    const ctx = canvas.getContext('2d')
    if (ctx && videoRef.current) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)

      // Convert to blob
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "webcam-capture.png", { type: "image/png" })
          setImage(file)
          const previewUrl = URL.createObjectURL(blob)
          setImagePreview(previewUrl)
          stopCapture()
        }
      }, 'image/png')
    }
  }

  // Stop webcam stream
  const stopCapture = (): void => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsCapturing(false)
  }

  // Send image to API for analysis
  const analyzeEmotion = async (): Promise<void> => {
    if (!image) {
      setError("Please upload or capture an image first")
      return
    }

    setLoading(true)
    setError(null)
    setAnalysisResult(null)
    setSelectedPlaylist(null)

    try {
      const formData = new FormData()
      formData.append("image", image)

      // Use the authenticated api service
      const response = await api.post<AnalysisResponse>("/api/analyze-emotion", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })

      setAnalysisResult(response.data)

      // Auto-select the first playlist
      if (response.data.recommendedPlaylists.length > 0) {
        setSelectedPlaylist(response.data.recommendedPlaylists[0].id)
      }
    } catch (err) {
      // Handle specific error cases
      const axiosError = err as AxiosError<{ message?: string }>

      if (axiosError.response) {
        const errorMessage = axiosError.response.data?.message ||
          `Error: ${axiosError.response.status} - ${axiosError.response.statusText}`
        setError(errorMessage)
      } else if (axiosError.request) {
        setError("No response received from server. Please check your connection.")
      } else {
        setError("Failed to analyze image. Please try again.")
      }

      console.error("API error:", err)
    } finally {
      setLoading(false)
    }
  }

  // Format emotion levels for display
  const formatEmotionLevel = (level: string): string => {
    return level.replace('_', ' ').toLowerCase()
  }

  // Get emotion bar width based on confidence
  const getEmotionBarWidth = (emotion: string): string => {
    const levels: Record<string, number> = {
      "VERY_LIKELY": 100,
      "LIKELY": 75,
      "POSSIBLE": 50,
      "UNLIKELY": 25,
      "VERY_UNLIKELY": 10
    }
    return `${levels[emotion] || 0}%`
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Mood-Based Music Recommendations</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left column: Image upload/capture */}
        <div className="w-full lg:w-1/3">
          <div className="mb-4 p-4 border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Upload or Capture Image</h2>

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
            {isCapturing && (
              <div className="mb-4">
                <video
                  ref={videoRef}
                  autoPlay
                  className="max-w-full h-auto rounded-lg max-h-64 mx-auto"
                />
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

          {/* Analysis button */}
          <button
            onClick={analyzeEmotion}
            disabled={!image || loading}
            className={`w-full py-3 rounded-md text-white font-medium ${!image || loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            type="button"
          >
            {loading ? 'Analyzing...' : 'Analyze Mood & Get Playlists'}
          </button>

          {/* Error message */}
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {/* Emotion analysis results */}
          {analysisResult && (
            <div className="mt-4 p-4 border rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Emotion Analysis</h3>

              <div className="mb-4">
                <p className="mb-1">
                  <span className="font-medium">Dominant emotion:</span>
                  <span className="capitalize ml-1">{analysisResult.dominant}</span>
                </p>
                <p className="mb-1">
                  <span className="font-medium">Recommended mood:</span>
                  <span className="capitalize ml-1">{analysisResult.recommendedMusicMood}</span>
                </p>
                <p className="mb-1">
                  <span className="font-medium">Confidence:</span>
                  <span className="ml-1">{analysisResult.confidenceScore * 100}%</span>
                </p>
              </div>

              <div className="space-y-2">
                {Object.entries(analysisResult.emotions).map(([emotion, level]) => (
                  <div key={emotion} className="mb-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="capitalize">{emotion}:</span>
                      <span className="text-sm">{formatEmotionLevel(level)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${emotion === analysisResult.dominant ? 'bg-indigo-600' : 'bg-gray-500'}`}
                        style={{ width: getEmotionBarWidth(level) }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column: Playlist recommendations */}
        <div className="w-full lg:w-2/3">
          <div className="p-4 border rounded-lg shadow-sm h-full">
            <h2 className="text-xl font-semibold mb-4">Your Music Recommendations</h2>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : analysisResult?.recommendedPlaylists?.length ? (
              <div className="space-y-4">
                {/* Playlist selection */}
                <div className="flex flex-wrap gap-3">
                  {analysisResult.recommendedPlaylists.map((playlist) => (
                    <button
                      key={playlist.id}
                      onClick={() => setSelectedPlaylist(playlist.id)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition ${selectedPlaylist === playlist.id
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                        }`}
                    >
                      {playlist.name.length > 30 ? `${playlist.name.substring(0, 30)}...` : playlist.name}
                    </button>
                  ))}
                </div>

                {/* Selected playlist details */}
                {selectedPlaylist && (
                  <div className="mt-6">
                    {analysisResult.recommendedPlaylists.filter(p => p.id === selectedPlaylist).map((playlist) => (
                      <div key={playlist.id} className="space-y-4">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="w-full md:w-1/3">
                            <img
                              src={playlist.imageUrl}
                              alt={playlist.name}
                              className="w-full h-auto rounded-lg shadow-md"
                            />
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
                            <h3 className="text-xl font-semibold mb-2">{playlist.name}</h3>
                            {playlist.description && (
                              <p className="text-sm text-gray-600 mb-4">{playlist.description}</p>
                            )}
                            <div className="mt-4 aspect-video w-full">
                              <iframe
                                src={playlist.embedUrl}
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                loading="lazy"
                                title={`Spotify playlist: ${playlist.name}`}
                                className="rounded-md"
                              ></iframe>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500">
                <p>No music recommendations yet</p>
                <p className="text-sm mt-2">Upload or capture a photo to get personalized playlists based on your mood</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard