import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs/operators';
import * as PlayerActions from '../../store/player/player.actions';
import * as PlayerSelectors from '../../store/player/player.selectors';

@Injectable({
    providedIn: 'root'
})
export class AudioPlayerService {
    private store = inject(Store);
    private audio: HTMLAudioElement | null = null;
    private isUpdatingFromAudio = false;

    constructor() {
        this.initializeAudioElement();
        this.subscribeToStoreChanges();
    }

    private initializeAudioElement(): void {
        this.audio = new Audio();
        this.audio.volume = 0.7;

        this.audio.addEventListener('timeupdate', () => {
            if (this.audio && !this.isUpdatingFromAudio) {
                this.isUpdatingFromAudio = true;
                this.store.dispatch(PlayerActions.updateCurrentTime({ currentTime: this.audio.currentTime }));
                this.isUpdatingFromAudio = false;
            }
        });

        this.audio.addEventListener('loadedmetadata', () => {
            if (this.audio) {
                this.store.dispatch(PlayerActions.updateDuration({ duration: this.audio.duration }));
            }
        });

        this.audio.addEventListener('ended', () => {
            this.store.dispatch(PlayerActions.setPlaying({ isPlaying: false }));
            this.store.select(PlayerSelectors.selectHasNext).pipe(take(1)).subscribe(hasNext => {
                if (hasNext) {
                    this.store.dispatch(PlayerActions.next());
                    this.store.dispatch(PlayerActions.play());
                }
            });
        });

        this.audio.addEventListener('play', () => {
            this.store.dispatch(PlayerActions.setPlaying({ isPlaying: true }));
        });

        this.audio.addEventListener('pause', () => {
            this.store.dispatch(PlayerActions.setPlaying({ isPlaying: false }));
        });

        this.audio.addEventListener('error', (e) => {
            console.error('Audio playback error:', e);
            this.store.dispatch(PlayerActions.setPlaying({ isPlaying: false }));
        });
    }

    private subscribeToStoreChanges(): void {
        this.store.select(PlayerSelectors.selectCurrentTrack)
            .pipe(filter(track => track !== null))
            .subscribe(track => {
                if (this.audio && track?.fileUrl) {
                    this.audio.src = track.fileUrl;
                    this.audio.load();
                }
            });

        this.store.select(PlayerSelectors.selectIsPlaying).subscribe(isPlaying => {
            if (this.audio) {
                if (isPlaying && this.audio.paused) {
                    this.audio.play().catch(err => console.error('Playback error:', err));
                } else if (!isPlaying && !this.audio.paused) {
                    this.audio.pause();
                }
            }
        });

        this.store.select(PlayerSelectors.selectVolume).subscribe(volume => {
            if (this.audio) {
                this.audio.volume = volume;
            }
        });

        this.store.select(PlayerSelectors.selectCurrentTime).subscribe(time => {
            if (this.audio && !this.isUpdatingFromAudio && Math.abs(this.audio.currentTime - time) > 1) {
                this.audio.currentTime = time;
            }
        });
    }
}
