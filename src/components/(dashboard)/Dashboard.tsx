'use client'

import React, { useState } from 'react'
import ImageCapture from './ImageCapture'
import EmotionResults from './EmotionResults'
import PlaylistsRecommendations from './PlaylistsRecommendations'
import { AnalysisResponse } from '@/types'
import { api } from '@/services/auth'
import { AxiosError } from 'axios'

const Dashboard: React.FC = () => {

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null)

  const analyzeEmotion = async (): Promise<void> => {
    if (!image) {
      setError("Please upload or capture the image");
      return;
    }

    setLoading(true)
    setError(null)
    setAnalysisResult(null)
    setSelectedPlaylist(null)

    try {
      const formData = new FormData;
      formData.append('image', image);


      const response = await api.post<AnalysisResponse>('/api/analyze-emotion', formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })

      setAnalysisResult(response.data)

      if (response.data.recommendedPlaylists.length > 0) {
        setSelectedPlaylist(response.data.recommendedPlaylists[0].id);
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>

      if (axiosError.response) {
        const errorMessage = axiosError.response.data?.message ||
          `Error: ${axiosError.response.status} - ${axiosError.response.statusText}`
        setError(errorMessage)
      } else if (axiosError.request) {
        setError("No response received from server. Please check your connection.")
      } else {
        setError("Failed to analyze image. Please try again.")
      }

      console.error("API error:", error)
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='max-w-6xl mx-auto p-4 md:p-6'>
      <h1 className='text-2xl font-bold mb-6 text-black'>Mood-Based Music Playlist Generator</h1>
      <div className='flex flex-col lg:flex-row gap-6'>
        <div className='w-full lg:w-1/3'>
          <ImageCapture 
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          setImage={setImage}
          />

          <button
            onClick={analyzeEmotion}
            disabled={!image || loading}
            className={`w-full py-3 rounded-md text-white font-medium ${!image || loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            type='button'>
            {loading ? 'Analyzing...' : 'Analyze Mood & Get Playlists'}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {analysisResult && (
            <EmotionResults analysisResult={analysisResult} />
          )}
        </div>


        <div className="w-full lg:w-2/3">
          <PlaylistsRecommendations
            loading={loading}
            analysisResult={analysisResult}
            selectedPlaylist={selectedPlaylist}
            setSelectedPlaylist={setSelectedPlaylist}
          />
        </div>
      </div>
    </div>
  )
}

export default Dashboard