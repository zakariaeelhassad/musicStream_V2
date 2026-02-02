import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Track } from '../../core/models/track.model';
import * as PlayerActions from '../../store/player/player.actions';
import * as PlayerSelectors from '../../store/player/player.selectors';

@Component({
    selector: 'app-audio-player',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './audio-player.component.html',
    styleUrls: []
})
export class AudioPlayerComponent {
    private store = inject(Store);

    currentTrack$: Observable<Track | null> = this.store.select(PlayerSelectors.selectCurrentTrack);
    isPlaying$: Observable<boolean> = this.store.select(PlayerSelectors.selectIsPlaying);
    currentTime$: Observable<number> = this.store.select(PlayerSelectors.selectCurrentTime);
    duration$: Observable<number> = this.store.select(PlayerSelectors.selectDuration);
    volume$: Observable<number> = this.store.select(PlayerSelectors.selectVolume);
    progress$: Observable<number> = this.store.select(PlayerSelectors.selectProgress);
    hasNext$: Observable<boolean> = this.store.select(PlayerSelectors.selectHasNext);
    hasPrevious$: Observable<boolean> = this.store.select(PlayerSelectors.selectHasPrevious);

    onProgressClick(event: MouseEvent): void {
        const progressBar = event.currentTarget as HTMLElement;
        const rect = progressBar.getBoundingClientRect();
        const percent = ((event.clientX - rect.left) / rect.width) * 100;
        this.store.dispatch(PlayerActions.seekToPercent({ percent }));
    }

    onVolumeChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.store.dispatch(PlayerActions.setVolume({ volume: parseFloat(input.value) }));
    }

    togglePlayPause(): void {
        this.store.dispatch(PlayerActions.togglePlayPause());
    }

    next(): void {
        this.store.dispatch(PlayerActions.next());
    }

    previous(): void {
        this.store.dispatch(PlayerActions.previous());
    }

    formatTime(seconds: number): string {
        if (!isFinite(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}
