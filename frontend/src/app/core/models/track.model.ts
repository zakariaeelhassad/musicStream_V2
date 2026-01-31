export interface Track {
  id: number;
  title: string;
  artist: string;
  description?: string;
  duration: number;
  category: string;
  fileUrl: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  createdAt: string;
}

export interface TrackCreate {
  title: string;
  artist: string;
  description?: string;
  category: string;
}

export interface TrackUpdate {
  title: string;
  artist: string;
  description?: string;
  category: string;
}
