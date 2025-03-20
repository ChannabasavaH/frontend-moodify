export interface EmotionAnalysis {
    joy: string
    sorrow: string
    angry: string
    surprise: string
}

export interface PlaylistInfo {
    id: string
    name: string
    description: string
    imageUrl: string
    externalUrl: string
    tracks: number
    embedUrl: string
}

export interface AnalysisResponse {
    emotions: EmotionAnalysis
    dominant: string
    confidenceScore: number
    recommendedMusicMood: string
    recommendedPlaylists: PlaylistInfo[]
}