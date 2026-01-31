export interface Track {
    id: number;
    title: string;
    artist: string;
    description?: string;
    duration?: number;
    category: string;
    fileUrl?: string;
    createdAt: string;
}

export interface TrackCreateDTO {
    title: string;
    artist: string;
    description?: string;
    category: string;
}

export interface TrackUpdateDTO {
    title: string;
    artist: string;
    description?: string;
    category: string;
}

export const TRACK_CATEGORIES = [
    'Pop',
    'Rock',
    'Hip Hop',
    'Jazz',
    'Classical',
    'Electronic',
    'R&B',
    'Country',
    'Reggae',
    'Blues',
    'Metal',
    'Folk',
    'Other'
] as const;

export type TrackCategory = typeof TRACK_CATEGORIES[number];
