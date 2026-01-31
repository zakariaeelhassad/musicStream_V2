import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Track } from '../../../core/models/track.model';
import { AudioPlayerService } from '../../../core/services/audio-player.service';
import {
  selectCurrentTrack,
  selectIsPlaying,
  selectVolume,
  selectProgress,
  selectCurrentTime,
  selectDuration
} from '../../../store/player/player.selectors';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="currentTrack$ | async as track" 
         class="bg-black/90 backdrop-blur-xl border-t border-white/10 shadow-2xl">
      <div class="container mx-auto px-4 py-4">
        <!-- Progress Bar -->
        <div class="mb-4">
          <input
            type="range"
            min="0"
            max="100"
            [value]="progress$ | async"
            (input)="onSeek($event)"
            class="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider">
          <div class="flex justify-between text-xs text-gray-400 mt-1">
            <span>{{ formatTime(currentTime$ | async) }}</span>
            <span>{{ formatTime(duration$ | async) }}</span>
          </div>
        </div>

        <div class="flex items-center gap-6">
          <!-- Track Info -->
          <div class="flex items-center gap-4 flex-1 min-w-0">
            <div class="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg class="h-8 w-8 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <div class="min-w-0 flex-1">
              <h3 class="text-white font-semibold truncate">{{ track.title }}</h3>
              <p class="text-gray-400 text-sm truncate">{{ track.artist }}</p>
            </div>
          </div>

          <!-- Player Controls -->
          <div class="flex items-center gap-4">
            <!-- Previous -->
            <button 
              class="text-gray-400 hover:text-white transition p-2">
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
              </svg>
            </button>

            <!-- Play/Pause -->
            <button 
              (click)="togglePlayPause()"
              class="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
              <svg *ngIf="!(isPlaying$ | async)" class="h-6 w-6 text-black ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
              <svg *ngIf="isPlaying$ | async" class="h-6 w-6 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </button>

            <!-- Next -->
            <button 
              class="text-gray-400 hover:text-white transition p-2">
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
              </svg>
            </button>
          </div>

          <!-- Volume Control -->
          <div class="flex items-center gap-3 w-32">
            <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clip-rule="evenodd" />
            </svg>
            <input
              type="range"
              min="0"
              max="100"
              [value]="(volume$ | async)! * 100"
              (input)="onVolumeChange($event)"
              class="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider">
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .slider::-webkit-slider-thumb {
      appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: white;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .slider::-moz-range-thumb {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: white;
      cursor: pointer;
      border: none;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .slider::-webkit-slider-thumb:hover {
      transform: scale(1.2);
    }

    .slider::-moz-range-thumb:hover {
      transform: scale(1.2);
    }
  `]
})
export class AudioPlayerComponent {
  private store = inject(Store);
  private audioPlayer = inject(AudioPlayerService);

  currentTrack$: Observable<Track | null> = this.store.select(selectCurrentTrack);
  isPlaying$: Observable<boolean> = this.store.select(selectIsPlaying);
  volume$: Observable<number> = this.store.select(selectVolume);
  progress$: Observable<number> = this.store.select(selectProgress);
  currentTime$: Observable<number> = this.store.select(selectCurrentTime);
  duration$: Observable<number> = this.store.select(selectDuration);

  togglePlayPause(): void {
    this.isPlaying$.pipe(take(1)).subscribe(isPlaying => {
      if (isPlaying) {
        this.audioPlayer.pause();
      } else {
        this.audioPlayer.resume();
      }
    });
  }

  onSeek(event: Event): void {
    const input = event.target as HTMLInputElement;
    const progress = parseFloat(input.value);
    this.audioPlayer.seek(progress);
  }

  onVolumeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const volume = parseFloat(input.value) / 100;
    this.audioPlayer.setVolume(volume);
  }

  formatTime(seconds: number | null): string {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}
