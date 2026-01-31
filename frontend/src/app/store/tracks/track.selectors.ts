import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TrackState } from './track.reducer';

export const selectTrackState = createFeatureSelector<TrackState>('tracks');

export const selectAllTracks = createSelector(
    selectTrackState,
    (state) => state.tracks
);

export const selectSelectedTrack = createSelector(
    selectTrackState,
    (state) => state.selectedTrack
);

export const selectTrackLoading = createSelector(
    selectTrackState,
    (state) => state.loading
);

export const selectTrackError = createSelector(
    selectTrackState,
    (state) => state.error
);

export const selectTrackById = (id: number) => createSelector(
    selectAllTracks,
    (tracks) => tracks.find(track => track.id === id)
);

export const selectTracksByCategory = (category: string) => createSelector(
    selectAllTracks,
    (tracks) => tracks.filter(track => track.category === category)
);
