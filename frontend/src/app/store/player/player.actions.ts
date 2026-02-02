import { createAction, props } from '@ngrx/store';
import { Track } from '../../core/models/track.model';

// Load Track
export const loadTrack = createAction(
    '[Player] Load Track',
    props<{ track: Track; playlist: Track[] }>()
);

// Playback Controls
export const play = createAction('[Player] Play');
export const pause = createAction('[Player] Pause');
export const stop = createAction('[Player] Stop');
export const togglePlayPause = createAction('[Player] Toggle Play/Pause');

// Seek
export const seek = createAction(
    '[Player] Seek',
    props<{ time: number }>()
);

export const seekToPercent = createAction(
    '[Player] Seek To Percent',
    props<{ percent: number }>()
);

// Volume
export const setVolume = createAction(
    '[Player] Set Volume',
    props<{ volume: number }>()
);

// Navigation
export const next = createAction('[Player] Next');
export const previous = createAction('[Player] Previous');

// Update Time
export const updateCurrentTime = createAction(
    '[Player] Update Current Time',
    props<{ currentTime: number }>()
);

export const updateDuration = createAction(
    '[Player] Update Duration',
    props<{ duration: number }>()
);

// Playback State
export const setPlaying = createAction(
    '[Player] Set Playing',
    props<{ isPlaying: boolean }>()
);
