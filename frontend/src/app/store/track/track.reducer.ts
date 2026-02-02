import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Track } from '../../core/models/track.model';
import * as TrackActions from './track.actions';

export interface TrackState extends EntityState<Track> {
    selectedTrack: Track | null;
    loading: boolean;
    error: string | null;
}

export const adapter: EntityAdapter<Track> = createEntityAdapter<Track>();

export const initialState: TrackState = adapter.getInitialState({
    selectedTrack: null,
    loading: false,
    error: null,
});

export const trackReducer = createReducer(
    initialState,

    // Load Tracks
    on(TrackActions.loadTracks, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),
    on(TrackActions.loadTracksSuccess, (state, { tracks }) =>
        adapter.setAll(tracks, { ...state, loading: false })
    ),
    on(TrackActions.loadTracksFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),

    // Create Track
    on(TrackActions.createTrack, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),
    on(TrackActions.createTrackSuccess, (state, { track }) =>
        adapter.addOne(track, { ...state, loading: false })
    ),
    on(TrackActions.createTrackFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),

    // Update Track
    on(TrackActions.updateTrack, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),
    on(TrackActions.updateTrackSuccess, (state, { track }) =>
        adapter.updateOne({ id: track.id, changes: track }, { ...state, loading: false })
    ),
    on(TrackActions.updateTrackFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),

    // Delete Track
    on(TrackActions.deleteTrack, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),
    on(TrackActions.deleteTrackSuccess, (state, { id }) =>
        adapter.removeOne(id, { ...state, loading: false })
    ),
    on(TrackActions.deleteTrackFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),

    // Upload Audio
    on(TrackActions.uploadAudio, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),
    on(TrackActions.uploadAudioSuccess, (state, { track }) =>
        adapter.updateOne({ id: track.id, changes: track }, { ...state, loading: false })
    ),
    on(TrackActions.uploadAudioFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),

    // Select Track
    on(TrackActions.selectTrack, (state, { track }) => ({
        ...state,
        selectedTrack: track,
    }))
);
