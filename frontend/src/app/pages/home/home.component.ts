import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Track, TrackCreateDTO, TrackUpdateDTO } from '../../core/models/track.model';
import { TrackCardComponent } from '../../components/track-card/track-card.component';
import { TrackDialogComponent } from '../../components/track-dialog/track-dialog.component';
import { TrackService } from '../../core/services/track.service';
import * as TrackActions from '../../store/track/track.actions';
import * as PlayerActions from '../../store/player/player.actions';
import * as TrackSelectors from '../../store/track/track.selectors';
import * as PlayerSelectors from '../../store/player/player.selectors';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, TrackCardComponent, TrackDialogComponent],
    templateUrl: './home.component.html',
    styleUrls: []
})
export class HomeComponent implements OnInit {
    private store = inject(Store);
    private trackService = inject(TrackService);

    tracks$: Observable<Track[]> = this.store.select(TrackSelectors.selectAllTracks);
    loading$: Observable<boolean> = this.store.select(TrackSelectors.selectTrackLoading);
    error$: Observable<string | null> = this.store.select(TrackSelectors.selectTrackError);
    selectedTrack$: Observable<Track | null> = this.store.select(TrackSelectors.selectSelectedTrack);
    currentTrack$: Observable<Track | null> = this.store.select(PlayerSelectors.selectCurrentTrack);
    isPlaying$: Observable<boolean> = this.store.select(PlayerSelectors.selectIsPlaying);

    isDialogOpen = false;
    isSaving = false;

    ngOnInit(): void {
        this.store.dispatch(TrackActions.loadTracks());
    }

    onPlayTrack(track: Track): void {
        if (!track.fileUrl) {
            alert('This track has no audio file. Please upload one first.');
            return;
        }

        const trackWithStreamUrl = {
            ...track,
            fileUrl: this.trackService.getStreamUrl(track.id)
        };

        this.tracks$.subscribe(tracks => {
            const playableTracks = tracks
                .filter(t => t.fileUrl)
                .map(t => ({
                    ...t,
                    fileUrl: this.trackService.getStreamUrl(t.id)
                }));

            this.store.dispatch(PlayerActions.loadTrack({
                track: trackWithStreamUrl,
                playlist: playableTracks
            }));
            this.store.dispatch(PlayerActions.play());
        }).unsubscribe();
    }

    onEditTrack(track: Track): void {
        this.store.dispatch(TrackActions.selectTrack({ track }));
        this.isDialogOpen = true;
    }

    onDeleteTrack(track: Track): void {
        this.store.dispatch(TrackActions.deleteTrack({ id: track.id }));
    }

    onAddTrack(): void {
        this.store.dispatch(TrackActions.selectTrack({ track: null }));
        this.isDialogOpen = true;
    }

    onDialogSubmit(event: { data: TrackCreateDTO | TrackUpdateDTO, file?: File }): void {
        this.isSaving = true;

        this.selectedTrack$.subscribe(selectedTrack => {
            if (selectedTrack) {
                // Update existing track
                this.store.dispatch(TrackActions.updateTrack({
                    id: selectedTrack.id,
                    track: event.data as TrackUpdateDTO
                }));

                if (event.file) {
                    this.store.dispatch(TrackActions.uploadAudio({
                        id: selectedTrack.id,
                        file: event.file
                    }));
                }
            } else {
                // Create new track
                if (event.file) {
                    // Create track with file - will upload automatically
                    this.store.dispatch(TrackActions.createTrackWithFile({
                        track: event.data as TrackCreateDTO,
                        file: event.file
                    }));
                } else {
                    // Create track without file
                    this.store.dispatch(TrackActions.createTrack({
                        track: event.data as TrackCreateDTO
                    }));
                }
            }

            this.isSaving = false;
            this.isDialogOpen = false;
        }).unsubscribe();
    }

    onDialogClose(): void {
        this.isDialogOpen = false;
        this.store.dispatch(TrackActions.selectTrack({ track: null }));
    }

    isTrackPlaying(track: Track, currentTrack: Track | null, isPlaying: boolean): boolean {
        return currentTrack?.id === track.id && isPlaying;
    }
}
