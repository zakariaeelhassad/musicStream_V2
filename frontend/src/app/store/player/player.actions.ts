import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Track } from '../../core/models/track.model';

export const PlayerActions = createActionGroup({
    source: 'Player',
    events: {
        'Play Track': props<{ track: Track }>(),
        'Pause': emptyProps(),
        'Resume': emptyProps(),
        'Stop': emptyProps(),
        'Set Volume': props<{ volume: number }>(),
        'Set Progress': props<{ progress: number }>(),
        'Update Current Time': props<{ currentTime: number }>(),
        'Set Duration': props<{ duration: number }>(),
        'Next Track': emptyProps(),
        'Previous Track': emptyProps(),
        'Toggle Shuffle': emptyProps(),
        'Toggle Repeat': emptyProps(),
    }
});
