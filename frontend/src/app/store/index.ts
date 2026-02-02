import { ActionReducerMap } from '@ngrx/store';
import { TrackState, trackReducer } from './track/track.reducer';
import { PlayerState, playerReducer } from './player/player.reducer';

export interface AppState {
    tracks: TrackState;
    player: PlayerState;
}

export const reducers: ActionReducerMap<AppState> = {
    tracks: trackReducer,
    player: playerReducer,
};
