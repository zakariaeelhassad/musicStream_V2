import { createReducer, on } from '@ngrx/store';
import { Track } from '../../core/models/track.model';
import { TrackActions } from './track.actions';

export interface TrackState {
    tracks: Track[];
    selectedTrack: Track | null;
    loading: boolean;
    error: string | null;
}

export const initialState: TrackState = {
    tracks: [],
    selectedTrack: null,
    loading: false,
    error: null
};

export const trackReducer = createReducer(
    initialState,

    // Load Tracks
    on(TrackActions.loadTracks, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(TrackActions.loadTracksSuccess, (state, { tracks }) => ({
        ...state,
        tracks,
        loading: false,
        error: null
    })),
    on(TrackActions.loadTracksFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    // Load Track
    on(TrackActions.loadTrack, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(TrackActions.loadTrackSuccess, (state, { track }) => ({
        ...state,
        selectedTrack: track,
        loading: false,
        error: null
    })),
    on(TrackActions.loadTrackFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    // Create Track
    on(TrackActions.createTrack, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(TrackActions.createTrackSuccess, (state, { track }) => ({
        ...state,
        tracks: [...state.tracks, track],
        selectedTrack: track,
        loading: false,
        error: null
    })),
    on(TrackActions.createTrackFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    // Update Track
    on(TrackActions.updateTrack, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(TrackActions.updateTrackSuccess, (state, { track }) => ({
        ...state,
        tracks: state.tracks.map(t => t.id === track.id ? track : t),
        selectedTrack: track,
        loading: false,
        error: null
    })),
    on(TrackActions.updateTrackFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    // Delete Track
    on(TrackActions.deleteTrack, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(TrackActions.deleteTrackSuccess, (state, { id }) => ({
        ...state,
        tracks: state.tracks.filter(t => t.id !== id),
        selectedTrack: state.selectedTrack?.id === id ? null : state.selectedTrack,
        loading: false,
        error: null
    })),
    on(TrackActions.deleteTrackFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    // Upload Audio
    on(TrackActions.uploadAudio, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(TrackActions.uploadAudioSuccess, (state, { track }) => ({
        ...state,
        tracks: state.tracks.map(t => t.id === track.id ? track : t),
        selectedTrack: track,
        loading: false,
        error: null
    })),
    on(TrackActions.uploadAudioFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    // Select Track
    on(TrackActions.selectTrack, (state, { track }) => ({
        ...state,
        selectedTrack: track
    })),

    // Clear Error
    on(TrackActions.clearError, (state) => ({
        ...state,
        error: null
    }))
);
