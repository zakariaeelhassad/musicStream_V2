import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackService } from '../../core/services/track.service';
import { AudioPlayerService } from '../../core/services/audio-player.service';
import { Track, TrackCreateDTO, TrackUpdateDTO } from '../../core/models/track.model';
import { TrackCardComponent } from '../../components/track-card/track-card.component';
import { TrackDialogComponent } from '../../components/track-dialog/track-dialog.component';
import { catchError, finalize, of } from 'rxjs';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, TrackCardComponent, TrackDialogComponent],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    private trackService = inject(TrackService);
    private playerService = inject(AudioPlayerService);

    tracks = signal<Track[]>([]);
    isLoading = signal(false);
    isDialogOpen = signal(false);
    isSaving = signal(false);
    selectedTrack = signal<Track | undefined>(undefined);
    error = signal<string | null>(null);

    ngOnInit(): void {
        this.loadTracks();
    }

    loadTracks(): void {
        this.isLoading.set(true);
        this.error.set(null);

        this.trackService.getAllTracks()
            .pipe(
                catchError(err => {
                    console.error('Error loading tracks:', err);
                    this.error.set('Failed to load tracks. Please make sure the backend is running.');
                    return of([]);
                }),
                finalize(() => this.isLoading.set(false))
            )
            .subscribe(tracks => {
                this.tracks.set(tracks);
            });
    }

    onPlayTrack(track: Track): void {
        if (!track.fileUrl) {
            alert('This track has no audio file. Please upload one first.');
            return;
        }

        // Load track with full stream URL
        const trackWithStreamUrl = {
            ...track,
            fileUrl: this.trackService.getStreamUrl(track.id)
        };

        this.playerService.loadTrack(trackWithStreamUrl, this.getPlayableTracks());
        this.playerService.play();
    }

    onEditTrack(track: Track): void {
        this.selectedTrack.set(track);
        this.isDialogOpen.set(true);
    }

    onDeleteTrack(track: Track): void {
        this.trackService.deleteTrack(track.id)
            .pipe(
                catchError(err => {
                    console.error('Error deleting track:', err);
                    alert('Failed to delete track. Please try again.');
                    return of(null);
                })
            )
            .subscribe(() => {
                this.loadTracks();
            });
    }

    onAddTrack(): void {
        this.selectedTrack.set(undefined);
        this.isDialogOpen.set(true);
    }

    onDialogSubmit(event: { data: TrackCreateDTO | TrackUpdateDTO, file?: File }): void {
        this.isSaving.set(true);

        const selectedTrack = this.selectedTrack();

        if (selectedTrack) {
            // Update existing track
            this.trackService.updateTrack(selectedTrack.id, event.data as TrackUpdateDTO)
                .pipe(
                    catchError(err => {
                        console.error('Error updating track:', err);
                        alert('Failed to update track. Please try again.');
                        this.isSaving.set(false);
                        return of(null);
                    })
                )
                .subscribe(updatedTrack => {
                    if (updatedTrack && event.file) {
                        // Upload audio file if provided
                        this.uploadAudioFile(updatedTrack.id, event.file);
                    } else {
                        this.isSaving.set(false);
                        this.isDialogOpen.set(false);
                        this.loadTracks();
                    }
                });
        } else {
            // Create new track
            this.trackService.createTrack(event.data as TrackCreateDTO)
                .pipe(
                    catchError(err => {
                        console.error('Error creating track:', err);
                        alert('Failed to create track. Please try again.');
                        this.isSaving.set(false);
                        return of(null);
                    })
                )
                .subscribe(newTrack => {
                    if (newTrack && event.file) {
                        // Upload audio file if provided
                        this.uploadAudioFile(newTrack.id, event.file);
                    } else {
                        this.isSaving.set(false);
                        this.isDialogOpen.set(false);
                        this.loadTracks();
                    }
                });
        }
    }

    private uploadAudioFile(trackId: number, file: File): void {
        this.trackService.uploadAudio(trackId, file)
            .pipe(
                catchError(err => {
                    console.error('Error uploading audio:', err);
                    alert('Track saved, but failed to upload audio file. You can try uploading it again later.');
                    return of(null);
                }),
                finalize(() => {
                    this.isSaving.set(false);
                    this.isDialogOpen.set(false);
                    this.loadTracks();
                })
            )
            .subscribe();
    }

    onDialogClose(): void {
        this.isDialogOpen.set(false);
        this.selectedTrack.set(undefined);
    }

    isTrackPlaying(track: Track): boolean {
        const currentTrack = this.playerService.currentTrack();
        return currentTrack?.id === track.id && this.playerService.isPlaying();
    }

    private getPlayableTracks(): Track[] {
        return this.tracks()
            .filter(t => t.fileUrl)
            .map(t => ({
                ...t,
                fileUrl: this.trackService.getStreamUrl(t.id)
            }));
    }
}
