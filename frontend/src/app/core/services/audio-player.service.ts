import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, fromEvent, interval } from 'rxjs';
import { takeWhile, tap } from 'rxjs/operators';
import { Track } from '../models/track.model';
import { TrackApiService } from './track-api.service';
import { PlayerActions } from '../../store/player/player.actions';

@Injectable({
    providedIn: 'root'
})
export class AudioPlayerService {
    private store = inject(Store);
    private trackApi = inject(TrackApiService);
    private audio: HTMLAudioElement | null = null;
    private currentTrack$ = new BehaviorSubject<Track | null>(null);

    constructor() {
        this.initializeAudio();
    }

    private initializeAudio(): void {
        this.audio = new Audio();
        this.audio.volume = 0.7;

        // Listen to audio events
        fromEvent(this.audio, 'loadedmetadata').subscribe(() => {
            if (this.audio) {
                this.store.dispatch(PlayerActions.setDuration({
                    duration: this.audio.duration
                }));
            }
        });

        fromEvent(this.audio, 'timeupdate').subscribe(() => {
            if (this.audio) {
                this.store.dispatch(PlayerActions.updateCurrentTime({
                    currentTime: this.audio.currentTime
                }));
            }
        });

        fromEvent(this.audio, 'ended').subscribe(() => {
            this.store.dispatch(PlayerActions.stop());
            this.store.dispatch(PlayerActions.nextTrack());
        });

        fromEvent(this.audio, 'error').subscribe((error) => {
            console.error('Audio playback error:', error);
            this.store.dispatch(PlayerActions.stop());
        });
    }

    playTrack(track: Track): void {
        if (!this.audio) return;

        const streamUrl = this.trackApi.getStreamUrl(track.id);
        this.audio.src = streamUrl;
        this.audio.load();

        this.audio.play().then(() => {
            this.currentTrack$.next(track);
            this.store.dispatch(PlayerActions.playTrack({ track }));
        }).catch(error => {
            console.error('Failed to play track:', error);
        });
    }

    pause(): void {
        if (this.audio && !this.audio.paused) {
            this.audio.pause();
            this.store.dispatch(PlayerActions.pause());
        }
    }

    resume(): void {
        if (this.audio && this.audio.paused) {
            this.audio.play().then(() => {
                this.store.dispatch(PlayerActions.resume());
            }).catch(error => {
                console.error('Failed to resume playback:', error);
            });
        }
    }

    stop(): void {
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.store.dispatch(PlayerActions.stop());
        }
    }

    setVolume(volume: number): void {
        if (this.audio) {
            this.audio.volume = Math.max(0, Math.min(1, volume));
            this.store.dispatch(PlayerActions.setVolume({ volume }));
        }
    }

    seek(progress: number): void {
        if (this.audio && this.audio.duration) {
            const time = (progress / 100) * this.audio.duration;
            this.audio.currentTime = time;
            this.store.dispatch(PlayerActions.setProgress({ progress }));
        }
    }

    getCurrentTrack() {
        return this.currentTrack$.asObservable();
    }
}
