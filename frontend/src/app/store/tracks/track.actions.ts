import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Track, TrackCreate, TrackUpdate } from '../../core/models/track.model';

export const TrackActions = createActionGroup({
    source: 'Track',
    events: {
        'Load Tracks': emptyProps(),
        'Load Tracks Success': props<{ tracks: Track[] }>(),
        'Load Tracks Failure': props<{ error: string }>(),

        'Load Track': props<{ id: number }>(),
        'Load Track Success': props<{ track: Track }>(),
        'Load Track Failure': props<{ error: string }>(),

        'Create Track': props<{ track: TrackCreate }>(),
        'Create Track Success': props<{ track: Track }>(),
        'Create Track Failure': props<{ error: string }>(),

        'Update Track': props<{ id: number; track: TrackUpdate }>(),
        'Update Track Success': props<{ track: Track }>(),
        'Update Track Failure': props<{ error: string }>(),

        'Delete Track': props<{ id: number }>(),
        'Delete Track Success': props<{ id: number }>(),
        'Delete Track Failure': props<{ error: string }>(),

        'Upload Audio': props<{ trackId: number; file: File }>(),
        'Upload Audio Success': props<{ track: Track }>(),
        'Upload Audio Failure': props<{ error: string }>(),

        'Select Track': props<{ track: Track | null }>(),
        'Clear Error': emptyProps(),
    }
});
