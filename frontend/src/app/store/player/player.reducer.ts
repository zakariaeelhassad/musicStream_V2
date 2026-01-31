import { createReducer, on } from '@ngrx/store';
import { Track } from '../../core/models/track.model';
import { PlayerActions } from './player.actions';

export interface PlayerState {
    currentTrack: Track | null;
    isPlaying: boolean;
    volume: number;
    currentTime: number;
    duration: number;
    progress: number;
    shuffle: boolean;
    repeat: boolean;
}

export const initialState: PlayerState = {
    currentTrack: null,
    isPlaying: false,
    volume: 0.7,
    currentTime: 0,
    duration: 0,
    progress: 0,
    shuffle: false,
    repeat: false
};

export const playerReducer = createReducer(
    initialState,

    on(PlayerActions.playTrack, (state, { track }) => ({
        ...state,
        currentTrack: track,
        isPlaying: true,
        currentTime: 0,
        progress: 0
    })),

    on(PlayerActions.pause, (state) => ({
        ...state,
        isPlaying: false
    })),

    on(PlayerActions.resume, (state) => ({
        ...state,
        isPlaying: true
    })),

    on(PlayerActions.stop, (state) => ({
        ...state,
        isPlaying: false,
        currentTime: 0,
        progress: 0
    })),

    on(PlayerActions.setVolume, (state, { volume }) => ({
        ...state,
        volume: Math.max(0, Math.min(1, volume))
    })),

    on(PlayerActions.setProgress, (state, { progress }) => ({
        ...state,
        progress: Math.max(0, Math.min(100, progress)),
        currentTime: (progress / 100) * state.duration
    })),

    on(PlayerActions.updateCurrentTime, (state, { currentTime }) => ({
        ...state,
        currentTime,
        progress: state.duration > 0 ? (currentTime / state.duration) * 100 : 0
    })),

    on(PlayerActions.setDuration, (state, { duration }) => ({
        ...state,
        duration
    })),

    on(PlayerActions.toggleShuffle, (state) => ({
        ...state,
        shuffle: !state.shuffle
    })),

    on(PlayerActions.toggleRepeat, (state) => ({
        ...state,
        repeat: !state.repeat
    }))
);
