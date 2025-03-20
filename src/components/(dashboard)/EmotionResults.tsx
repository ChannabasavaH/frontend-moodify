'use client'

import React from 'react'
import { AnalysisResponse } from '@/types'

interface EmotionResultsProps {
  analysisResult: AnalysisResponse
}

const EmotionResults: React.FC<EmotionResultsProps> = ({ analysisResult }) => {

  const formatEmotionLevel = (level: string): string => {
    return level.replace('_', ' ').toLowerCase()
  }

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
    <div className="mt-4 p-4 border rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-3 text-black">Emotion Analysis</h3>

      <div className="mb-4 text-black">
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
          <div key={emotion} className="mb-2 text-black">
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
  )
}

export default EmotionResults