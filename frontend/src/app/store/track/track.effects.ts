import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, mergeMap } from 'rxjs/operators';
import { TrackService } from '../../core/services/track.service';
import * as TrackActions from './track.actions';

@Injectable()
export class TrackEffects {
    private actions$ = inject(Actions);
    private trackService = inject(TrackService);

    loadTracks$ = createEffect(() =>
        this.actions$.pipe(
            ofType(TrackActions.loadTracks),
            switchMap(() =>
                this.trackService.getAllTracks().pipe(
                    map((tracks) => TrackActions.loadTracksSuccess({ tracks })),
                    catchError((error) =>
                        of(TrackActions.loadTracksFailure({ error: error.message || 'Failed to load tracks' }))
                    )
                )
            )
        )
    );

    createTrack$ = createEffect(() =>
        this.actions$.pipe(
            ofType(TrackActions.createTrack),
            mergeMap(({ track }) =>
                this.trackService.createTrack(track).pipe(
                    map((createdTrack) => TrackActions.createTrackSuccess({ track: createdTrack })),
                    catchError((error) =>
                        of(TrackActions.createTrackFailure({ error: error.message || 'Failed to create track' }))
                    )
                )
            )
        )
    );

    createTrackWithFile$ = createEffect(() =>
        this.actions$.pipe(
            ofType(TrackActions.createTrackWithFile),
            mergeMap(({ track, file }) =>
                this.trackService.createTrack(track).pipe(
                    switchMap((createdTrack) =>
                        this.trackService.uploadAudio(createdTrack.id, file).pipe(
                            map((updatedTrack) => TrackActions.createTrackSuccess({ track: updatedTrack })),
                            catchError((error) =>
                                of(TrackActions.createTrackFailure({ error: error.message || 'Failed to upload audio' }))
                            )
                        )
                    ),
                    catchError((error) =>
                        of(TrackActions.createTrackFailure({ error: error.message || 'Failed to create track' }))
                    )
                )
            )
        )
    );

    updateTrack$ = createEffect(() =>
        this.actions$.pipe(
            ofType(TrackActions.updateTrack),
            mergeMap(({ id, track }) =>
                this.trackService.updateTrack(id, track).pipe(
                    map((updatedTrack) => TrackActions.updateTrackSuccess({ track: updatedTrack })),
                    catchError((error) =>
                        of(TrackActions.updateTrackFailure({ error: error.message || 'Failed to update track' }))
                    )
                )
            )
        )
    );

    deleteTrack$ = createEffect(() =>
        this.actions$.pipe(
            ofType(TrackActions.deleteTrack),
            mergeMap(({ id }) =>
                this.trackService.deleteTrack(id).pipe(
                    map(() => TrackActions.deleteTrackSuccess({ id })),
                    catchError((error) =>
                        of(TrackActions.deleteTrackFailure({ error: error.message || 'Failed to delete track' }))
                    )
                )
            )
        )
    );

    uploadAudio$ = createEffect(() =>
        this.actions$.pipe(
            ofType(TrackActions.uploadAudio),
            mergeMap(({ id, file }) =>
                this.trackService.uploadAudio(id, file).pipe(
                    map((track) => TrackActions.uploadAudioSuccess({ track })),
                    catchError((error) =>
                        of(TrackActions.uploadAudioFailure({ error: error.message || 'Failed to upload audio' }))
                    )
                )
            )
        )
    );
}
