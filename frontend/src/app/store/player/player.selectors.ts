import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PlayerState } from './player.reducer';

export const selectPlayerState = createFeatureSelector<PlayerState>('player');

export const selectCurrentTrack = createSelector(
    selectPlayerState,
    (state) => state.currentTrack
);

export const selectPlaylist = createSelector(
    selectPlayerState,
    (state) => state.playlist
);

export const selectCurrentIndex = createSelector(
    selectPlayerState,
    (state) => state.currentIndex
);

export const selectIsPlaying = createSelector(
    selectPlayerState,
    (state) => state.isPlaying
);

export const selectCurrentTime = createSelector(
    selectPlayerState,
    (state) => state.currentTime
);

export const selectDuration = createSelector(
    selectPlayerState,
    (state) => state.duration
);

export const selectVolume = createSelector(
    selectPlayerState,
    (state) => state.volume
);

export const selectProgress = createSelector(
    selectPlayerState,
    (state) => state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0
);

export const selectHasNext = createSelector(
    selectPlayerState,
    (state) => state.currentIndex < state.playlist.length - 1
);

export const selectHasPrevious = createSelector(
    selectPlayerState,
    (state) => state.currentIndex > 0
);
