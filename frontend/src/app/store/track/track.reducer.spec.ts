import { trackReducer, initialState } from './track.reducer';
import * as TrackActions from './track.actions';
import { Track } from '../../core/models/track.model';

describe('Track Reducer', () => {
    const mockTrack: Track = {
        id: 1,
        title: 'Test Track',
        artist: 'Test Artist',
        category: 'Rock',
        description: 'Test Description',
        duration: 180,
        filePath: null,
        fileUrl: null
    };

    describe('unknown action', () => {
        it('should return the default state', () => {
            const action = { type: 'Unknown' };
            const state = trackReducer(initialState, action as any);

            expect(state).toBe(initialState);
        });
    });

    describe('loadTracksSuccess', () => {
        it('should set tracks and loading to false', () => {
            const tracks = [mockTrack];
            const action = TrackActions.loadTracksSuccess({ tracks });
            const state = trackReducer(initialState, action);

            expect(state.ids.length).toBe(1);
            expect(state.entities[1]).toEqual(mockTrack);
            expect(state.loading).toBe(false);
            expect(state.error).toBeNull();
        });
    });

    describe('loadTracksFailure', () => {
        it('should set error and loading to false', () => {
            const error = 'Load error';
            const action = TrackActions.loadTracksFailure({ error });
            const state = trackReducer(initialState, action);

            expect(state.loading).toBe(false);
            expect(state.error).toBe(error);
        });
    });

    describe('createTrackSuccess', () => {
        it('should add new track to state', () => {
            const action = TrackActions.createTrackSuccess({ track: mockTrack });
            const state = trackReducer(initialState, action);

            expect(state.ids.length).toBe(1);
            expect(state.entities[1]).toEqual(mockTrack);
            expect(state.loading).toBe(false);
        });
    });

    describe('updateTrackSuccess', () => {
        it('should update existing track', () => {
            const initialStateWithTrack = trackReducer(
                initialState,
                TrackActions.createTrackSuccess({ track: mockTrack })
            );

            const updatedTrack = { ...mockTrack, title: 'Updated Title' };
            const action = TrackActions.updateTrackSuccess({ track: updatedTrack });
            const state = trackReducer(initialStateWithTrack, action);

            expect(state.entities[1]?.title).toBe('Updated Title');
            expect(state.loading).toBe(false);
        });
    });

    describe('deleteTrackSuccess', () => {
        it('should remove track from state', () => {
            const initialStateWithTrack = trackReducer(
                initialState,
                TrackActions.createTrackSuccess({ track: mockTrack })
            );

            const action = TrackActions.deleteTrackSuccess({ id: 1 });
            const state = trackReducer(initialStateWithTrack, action);

            expect(state.ids.length).toBe(0);
            expect(state.entities[1]).toBeUndefined();
        });
    });

    describe('selectTrack', () => {
        it('should set selected track', () => {
            const action = TrackActions.selectTrack({ track: mockTrack });
            const state = trackReducer(initialState, action);

            expect(state.selectedTrack).toEqual(mockTrack);
        });

        it('should clear selected track when null', () => {
            const initialStateWithSelection = trackReducer(
                initialState,
                TrackActions.selectTrack({ track: mockTrack })
            );

            const action = TrackActions.selectTrack({ track: null });
            const state = trackReducer(initialStateWithSelection, action);

            expect(state.selectedTrack).toBeNull();
        });
    });
});
