import { createAction, props } from '@ngrx/store';
import { Track, TrackCreateDTO, TrackUpdateDTO } from '../../core/models/track.model';

// Load Tracks
export const loadTracks = createAction('[Track] Load Tracks');
export const loadTracksSuccess = createAction(
    '[Track] Load Tracks Success',
    props<{ tracks: Track[] }>()
);
export const loadTracksFailure = createAction(
    '[Track] Load Tracks Failure',
    props<{ error: string }>()
);

// Create Track
export const createTrack = createAction(
    '[Track] Create Track',
    props<{ track: TrackCreateDTO }>()
);
export const createTrackWithFile = createAction(
    '[Track] Create Track With File',
    props<{ track: TrackCreateDTO; file: File }>()
);
export const createTrackSuccess = createAction(
    '[Track] Create Track Success',
    props<{ track: Track }>()
);
export const createTrackFailure = createAction(
    '[Track] Create Track Failure',
    props<{ error: string }>()
);

// Update Track
export const updateTrack = createAction(
    '[Track] Update Track',
    props<{ id: number; track: TrackUpdateDTO }>()
);
export const updateTrackSuccess = createAction(
    '[Track] Update Track Success',
    props<{ track: Track }>()
);
export const updateTrackFailure = createAction(
    '[Track] Update Track Failure',
    props<{ error: string }>()
);

// Delete Track
export const deleteTrack = createAction(
    '[Track] Delete Track',
    props<{ id: number }>()
);
export const deleteTrackSuccess = createAction(
    '[Track] Delete Track Success',
    props<{ id: number }>()
);
export const deleteTrackFailure = createAction(
    '[Track] Delete Track Failure',
    props<{ error: string }>()
);

// Upload Audio
export const uploadAudio = createAction(
    '[Track] Upload Audio',
    props<{ id: number; file: File }>()
);
export const uploadAudioSuccess = createAction(
    '[Track] Upload Audio Success',
    props<{ track: Track }>()
);
export const uploadAudioFailure = createAction(
    '[Track] Upload Audio Failure',
    props<{ error: string }>()
);

// Select Track
export const selectTrack = createAction(
    '[Track] Select Track',
    props<{ track: Track | null }>()
);
