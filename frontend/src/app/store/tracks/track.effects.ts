import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { TrackApiService } from '../../core/services/track-api.service';
import { TrackActions } from './track.actions';

@Injectable()
export class TrackEffects {
    private actions$ = inject(Actions);
    private trackApi = inject(TrackApiService);

    loadTracks$ = createEffect(() =>
        this.actions$.pipe(
            ofType(TrackActions.loadTracks),
            switchMap(() =>
                this.trackApi.getAllTracks().pipe(
                    map(tracks => TrackActions.loadTracksSuccess({ tracks })),
                    catchError(error => of(TrackActions.loadTracksFailure({
                        error: error.message || 'Failed to load tracks'
                    })))
                )
            )
        )
    );

    loadTrack$ = createEffect(() =>
        this.actions$.pipe(
            ofType(TrackActions.loadTrack),
            switchMap(({ id }) =>
                this.trackApi.getTrackById(id).pipe(
                    map(track => TrackActions.loadTrackSuccess({ track })),
                    catchError(error => of(TrackActions.loadTrackFailure({
                        error: error.message || 'Failed to load track'
                    })))
                )
            )
        )
    );

    createTrack$ = createEffect(() =>
        this.actions$.pipe(
            ofType(TrackActions.createTrack),
            switchMap(({ track }) =>
                this.trackApi.createTrack(track).pipe(
                    map(createdTrack => TrackActions.createTrackSuccess({ track: createdTrack })),
                    catchError(error => of(TrackActions.createTrackFailure({
                        error: error.message || 'Failed to create track'
                    })))
                )
            )
        )
    );

    updateTrack$ = createEffect(() =>
        this.actions$.pipe(
            ofType(TrackActions.updateTrack),
            switchMap(({ id, track }) =>
                this.trackApi.updateTrack(id, track).pipe(
                    map(updatedTrack => TrackActions.updateTrackSuccess({ track: updatedTrack })),
                    catchError(error => of(TrackActions.updateTrackFailure({
                        error: error.message || 'Failed to update track'
                    })))
                )
            )
        )
    );

    deleteTrack$ = createEffect(() =>
        this.actions$.pipe(
            ofType(TrackActions.deleteTrack),
            switchMap(({ id }) =>
                this.trackApi.deleteTrack(id).pipe(
                    map(() => TrackActions.deleteTrackSuccess({ id })),
                    catchError(error => of(TrackActions.deleteTrackFailure({
                        error: error.message || 'Failed to delete track'
                    })))
                )
            )
        )
    );

    uploadAudio$ = createEffect(() =>
        this.actions$.pipe(
            ofType(TrackActions.uploadAudio),
            switchMap(({ trackId, file }) =>
                this.trackApi.uploadAudioFile(trackId, file).pipe(
                    map(track => TrackActions.uploadAudioSuccess({ track })),
                    catchError(error => of(TrackActions.uploadAudioFailure({
                        error: error.message || 'Failed to upload audio file'
                    })))
                )
            )
        )
    );
}
