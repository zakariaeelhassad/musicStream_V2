import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PlayerState } from './player.reducer';

export const selectPlayerState = createFeatureSelector<PlayerState>('player');

export const selectCurrentTrack = createSelector(
    selectPlayerState,
    (state) => state.currentTrack
);

export const selectIsPlaying = createSelector(
    selectPlayerState,
    (state) => state.isPlaying
);

export const selectVolume = createSelector(
    selectPlayerState,
    (state) => state.volume
);

export const selectCurrentTime = createSelector(
    selectPlayerState,
    (state) => state.currentTime
);

export const selectDuration = createSelector(
    selectPlayerState,
    (state) => state.duration
);

export const selectProgress = createSelector(
    selectPlayerState,
    (state) => state.progress
);

export const selectShuffle = createSelector(
    selectPlayerState,
    (state) => state.shuffle
);

export const selectRepeat = createSelector(
    selectPlayerState,
    (state) => state.repeat
);
