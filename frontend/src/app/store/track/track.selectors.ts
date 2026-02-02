import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TrackState, adapter } from './track.reducer';

export const selectTrackState = createFeatureSelector<TrackState>('tracks');

const { selectAll, selectEntities, selectIds, selectTotal } = adapter.getSelectors();

export const selectAllTracks = createSelector(selectTrackState, selectAll);

export const selectTrackEntities = createSelector(selectTrackState, selectEntities);

export const selectTrackIds = createSelector(selectTrackState, selectIds);

export const selectTrackTotal = createSelector(selectTrackState, selectTotal);

export const selectTrackById = (id: number) =>
    createSelector(selectTrackEntities, (entities) => entities[id]);

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

export const selectPlayableTracks = createSelector(
    selectAllTracks,
    (tracks) => tracks.filter(track => track.fileUrl)
);
