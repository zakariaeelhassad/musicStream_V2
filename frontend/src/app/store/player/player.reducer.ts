import { createReducer, on } from '@ngrx/store';
import { Track } from '../../core/models/track.model';
import * as PlayerActions from './player.actions';

export interface PlayerState {
    currentTrack: Track | null;
    playlist: Track[];
    currentIndex: number;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
}

export const initialState: PlayerState = {
    currentTrack: null,
    playlist: [],
    currentIndex: -1,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.7,
};

export const playerReducer = createReducer(
    initialState,

    // Load Track
    on(PlayerActions.loadTrack, (state, { track, playlist }) => {
        const currentIndex = playlist.findIndex(t => t.id === track.id);
        return {
            ...state,
            currentTrack: track,
            playlist,
            currentIndex: currentIndex >= 0 ? currentIndex : 0,
            currentTime: 0,
        };
    }),

    // Playback Controls
    on(PlayerActions.play, (state) => ({
        ...state,
        isPlaying: true,
    })),

    on(PlayerActions.pause, (state) => ({
        ...state,
        isPlaying: false,
    })),

    on(PlayerActions.stop, (state) => ({
        ...state,
        isPlaying: false,
        currentTime: 0,
    })),

    on(PlayerActions.togglePlayPause, (state) => ({
        ...state,
        isPlaying: !state.isPlaying,
    })),

    // Seek
    on(PlayerActions.seek, (state, { time }) => ({
        ...state,
        currentTime: time,
    })),

    on(PlayerActions.seekToPercent, (state, { percent }) => ({
        ...state,
        currentTime: (percent / 100) * state.duration,
    })),

    // Volume
    on(PlayerActions.setVolume, (state, { volume }) => ({
        ...state,
        volume: Math.max(0, Math.min(1, volume)),
    })),

    // Navigation
    on(PlayerActions.next, (state) => {
        if (state.currentIndex < state.playlist.length - 1) {
            const nextIndex = state.currentIndex + 1;
            return {
                ...state,
                currentTrack: state.playlist[nextIndex],
                currentIndex: nextIndex,
                currentTime: 0,
            };
        }
        return state;
    }),

    on(PlayerActions.previous, (state) => {
        if (state.currentIndex > 0) {
            const prevIndex = state.currentIndex - 1;
            return {
                ...state,
                currentTrack: state.playlist[prevIndex],
                currentIndex: prevIndex,
                currentTime: 0,
            };
        }
        return state;
    }),

    // Update Time
    on(PlayerActions.updateCurrentTime, (state, { currentTime }) => ({
        ...state,
        currentTime,
    })),

    on(PlayerActions.updateDuration, (state, { duration }) => ({
        ...state,
        duration,
    })),

    // Playback State
    on(PlayerActions.setPlaying, (state, { isPlaying }) => ({
        ...state,
        isPlaying,
    }))
);
