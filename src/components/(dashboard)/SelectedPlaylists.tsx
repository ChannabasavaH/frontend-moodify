import React from 'react'
import { PlaylistInfo } from '@/types'

interface SelectedPlaylistProps {
  playlist: PlaylistInfo
}

const SelectedPlaylist: React.FC<SelectedPlaylistProps> = ({ playlist }) => {
  return (
    <div className="mt-6">
      <div className="space-y-4">
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
            <h3 className="text-xl font-semibold mb-2 text-black">{playlist.name}</h3>
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
    </div>
  )
}

export default SelectedPlaylist