'use client'

import React from 'react'
import { AnalysisResponse } from '@/types'
import SelectedPlaylist from './SelectedPlaylists'

interface PlaylistsRecommendationsProps {
  loading: boolean,
  analysisResult: AnalysisResponse | null,
  selectedPlaylist: string | null,
  setSelectedPlaylist: (id: string | null) => null
}

const PlaylistsRecommendations: React.FC<PlaylistsRecommendationsProps> = ({ loading, analysisResult, selectedPlaylist, setSelectedPlaylist }) => {
  return (
    <div className="p-4 border rounded-lg shadow-sm h-full">
      <h2 className="text-xl font-semibold mb-4 text-black">Your Music Recommendations</h2>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : analysisResult?.recommendedPlaylists?.length ? (
        <div className="space-y-4">
          {/* Playlist selection buttons */}
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
            <SelectedPlaylist
              playlist={analysisResult.recommendedPlaylists.find(p => p.id === selectedPlaylist)!}
              mood={analysisResult.dominant}
            />
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500">
          <p>No music recommendations yet</p>
          <p className="text-sm mt-2">Upload or capture a photo to get personalized playlists based on your mood</p>
        </div>
      )}
    </div>
  )
}

export default PlaylistsRecommendations