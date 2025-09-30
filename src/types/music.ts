export type OutputMode = 'Broadcast' | 'Prep' | 'Double';
export interface BroadcastData {
  artist: string;
  release: string;
  fusion: string;
}
export interface PrepData {
  artistBackground: string;
  releaseContext: string;
  globalSignificance: string;
}
export interface Track {
  id: string;
  songTitle: string;
  artistName: string;
  broadcast: BroadcastData;
  prep: PrepData;
  spotifyUrl: string;
  artworkUrl: string;
  albumTitle: string;
  sources: string[];
}