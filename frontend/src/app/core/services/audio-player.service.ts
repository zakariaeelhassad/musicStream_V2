import { Injectable, signal, computed, effect } from '@angular/core';
import { Track } from '../models/track.model';

export interface PlayerState {
    currentTrack: Track | null;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    playlist: Track[];
    currentIndex: number;
}

@Injectable({
    providedIn: 'root'
})
export class AudioPlayerService {
    private audio: HTMLAudioElement | null = null;

    // Signals for reactive state management
    private state = signal<PlayerState>({
        currentTrack: null,
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        volume: 0.7,
        playlist: [],
        currentIndex: -1
    });

    // Computed values
    currentTrack = computed(() => this.state().currentTrack);
    isPlaying = computed(() => this.state().isPlaying);
    currentTime = computed(() => this.state().currentTime);
    duration = computed(() => this.state().duration);
    volume = computed(() => this.state().volume);
    progress = computed(() => {
        const duration = this.state().duration;
        return duration > 0 ? (this.state().currentTime / duration) * 100 : 0;
    });
    hasNext = computed(() => {
        const { playlist, currentIndex } = this.state();
        return currentIndex < playlist.length - 1;
    });
    hasPrevious = computed(() => this.state().currentIndex > 0);

    constructor() {
        // Initialize audio element
        this.audio = new Audio();
        this.audio.volume = this.state().volume;

        // Set up event listeners
        this.setupAudioListeners();
    }

    private setupAudioListeners(): void {
        if (!this.audio) return;

        this.audio.addEventListener('timeupdate', () => {
            this.state.update(s => ({ ...s, currentTime: this.audio?.currentTime || 0 }));
        });

        this.audio.addEventListener('durationchange', () => {
            this.state.update(s => ({ ...s, duration: this.audio?.duration || 0 }));
        });

        this.audio.addEventListener('ended', () => {
            if (this.hasNext()) {
                this.next();
            } else {
                this.stop();
            }
        });

        this.audio.addEventListener('play', () => {
            this.state.update(s => ({ ...s, isPlaying: true }));
        });

        this.audio.addEventListener('pause', () => {
            this.state.update(s => ({ ...s, isPlaying: false }));
        });
    }

    loadTrack(track: Track, playlist: Track[] = []): void {
        if (!this.audio) return;

        const currentIndex = playlist.length > 0 ? playlist.findIndex(t => t.id === track.id) : 0;

        this.state.update(s => ({
            ...s,
            currentTrack: track,
            playlist: playlist.length > 0 ? playlist : [track],
            currentIndex: currentIndex >= 0 ? currentIndex : 0,
            currentTime: 0
        }));

        if (track.fileUrl) {
            this.audio.src = track.fileUrl;
            this.audio.load();
        }
    }

    play(): void {
        if (this.audio && this.state().currentTrack) {
            this.audio.play().catch(error => {
                console.error('Error playing audio:', error);
            });
        }
    }

    pause(): void {
        if (this.audio) {
            this.audio.pause();
        }
    }

    stop(): void {
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.state.update(s => ({ ...s, isPlaying: false, currentTime: 0 }));
        }
    }

    togglePlayPause(): void {
        if (this.state().isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    seek(time: number): void {
        if (this.audio) {
            this.audio.currentTime = time;
        }
    }

    seekToPercent(percent: number): void {
        const duration = this.state().duration;
        if (duration > 0) {
            this.seek((percent / 100) * duration);
        }
    }

    setVolume(volume: number): void {
        const clampedVolume = Math.max(0, Math.min(1, volume));
        if (this.audio) {
            this.audio.volume = clampedVolume;
        }
        this.state.update(s => ({ ...s, volume: clampedVolume }));
    }

    next(): void {
        const { playlist, currentIndex } = this.state();
        if (currentIndex < playlist.length - 1) {
            const nextTrack = playlist[currentIndex + 1];
            this.loadTrack(nextTrack, playlist);
            this.play();
        }
    }

    previous(): void {
        const { playlist, currentIndex } = this.state();
        if (currentIndex > 0) {
            const prevTrack = playlist[currentIndex - 1];
            this.loadTrack(prevTrack, playlist);
            this.play();
        }
    }

    formatTime(seconds: number): string {
        if (!isFinite(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}
