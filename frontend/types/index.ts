// Spotify Types
export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images?: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  country?: string;
  product?: string;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  uri: string;
  href: string;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  release_date: string;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  uri: string;
  href: string;
  duration_ms: number;
  popularity: number;
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
}

// API Response Types
export interface HealthResponse {
  status: string;
  message: string;
  timestamp?: string;
}

export interface AuthStatusResponse {
  authenticated: boolean;
}

export interface SimilarTrack {
  name: string;
  artist: {
    name: string;
  };
  url?: string;
}

export interface LyricsResponse {
  lyrics: string;
}

export interface TrackDetails {
  artist: string;
  song: string;
  image: string;
  similar: string[];
  lyrics: string;
}

// Error Types
export interface APIError {
  error: string;
}
