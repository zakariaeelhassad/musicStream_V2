import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { TrackEffects } from './track.effects';
import * as TrackActions from './track.actions';
import { TrackService } from '../../core/services/track.service';
import { Track } from '../../core/models/track.model';
import { cold, hot } from 'jasmine-marbles';

describe('TrackEffects', () => {
    let actions$: Observable<any>;
    let effects: TrackEffects;
    let trackService: jasmine.SpyObj<TrackService>;

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

    beforeEach(() => {
        const trackServiceSpy = jasmine.createSpyObj('TrackService', [
            'getAllTracks',
            'getTrackById',
            'createTrack',
            'updateTrack',
            'deleteTrack',
            'uploadAudioFile'
        ]);

        TestBed.configureTestingModule({
            providers: [
                TrackEffects,
                provideMockActions(() => actions$),
                { provide: TrackService, useValue: trackServiceSpy }
            ]
        });

        effects = TestBed.inject(TrackEffects);
        trackService = TestBed.inject(TrackService) as jasmine.SpyObj<TrackService>;
    });

    describe('loadTracks$', () => {
        it('should return loadTracksSuccess on success', () => {
            const tracks = [mockTrack];
            const action = TrackActions.loadTracks();
            const outcome = TrackActions.loadTracksSuccess({ tracks });

            actions$ = hot('-a', { a: action });
            const response = cold('-a|', { a: tracks });
            const expected = cold('--b', { b: outcome });
            trackService.getAllTracks.and.returnValue(response);

            expect(effects.loadTracks$).toBeObservable(expected);
        });

        it('should return loadTracksFailure on error', () => {
            const action = TrackActions.loadTracks();
            const error = 'Load error';
            const outcome = TrackActions.loadTracksFailure({ error });

            actions$ = hot('-a', { a: action });
            const response = cold('-#', {}, error);
            const expected = cold('--b', { b: outcome });
            trackService.getAllTracks.and.returnValue(response);

            expect(effects.loadTracks$).toBeObservable(expected);
        });
    });

    describe('createTrack$', () => {
        it('should return createTrackSuccess on success', () => {
            const createDTO = { title: 'New Track', artist: 'New Artist', category: 'Rock', description: 'New Desc' };
            const action = TrackActions.createTrack({ track: createDTO });
            const outcome = TrackActions.createTrackSuccess({ track: mockTrack });

            actions$ = hot('-a', { a: action });
            const response = cold('-a|', { a: mockTrack });
            const expected = cold('--b', { b: outcome });
            trackService.createTrack.and.returnValue(response);

            expect(effects.createTrack$).toBeObservable(expected);
        });
    });

    describe('updateTrack$', () => {
        it('should return updateTrackSuccess on success', () => {
            const updateDTO = { title: 'Updated Track' };
            const action = TrackActions.updateTrack({ id: 1, track: updateDTO });
            const outcome = TrackActions.updateTrackSuccess({ track: mockTrack });

            actions$ = hot('-a', { a: action });
            const response = cold('-a|', { a: mockTrack });
            const expected = cold('--b', { b: outcome });
            trackService.updateTrack.and.returnValue(response);

            expect(effects.updateTrack$).toBeObservable(expected);
        });
    });

    describe('deleteTrack$', () => {
        it('should return deleteTrackSuccess on success', () => {
            const action = TrackActions.deleteTrack({ id: 1 });
            const outcome = TrackActions.deleteTrackSuccess({ id: 1 });

            actions$ = hot('-a', { a: action });
            const response = cold('-a|', { a: null });
            const expected = cold('--b', { b: outcome });
            trackService.deleteTrack.and.returnValue(response);

            expect(effects.deleteTrack$).toBeObservable(expected);
        });
    });
});
