import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Track } from '../../../core/models/track.model';
import { TrackActions } from '../../../store/tracks/track.actions';
import { selectAllTracks, selectTrackLoading, selectTrackError } from '../../../store/tracks/track.selectors';
import { AudioPlayerService } from '../../../core/services/audio-player.service';

@Component({
    selector: 'app-track-list',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <h2 class="text-3xl font-bold text-white">Your Music Library</h2>
        <a 
          routerLink="/tracks/new"
          class="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl">
          + Add New Track
        </a>
      </div>

      <!-- Error Message -->
      <div *ngIf="error$ | async as error" class="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
        {{ error }}
      </div>

      <!-- Loading State -->
      <div *ngIf="loading$ | async" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!(loading$ | async) && (tracks$ | async)?.length === 0" 
           class="text-center py-16 bg-white/5 rounded-xl backdrop-blur-sm">
        <svg class="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
        <h3 class="text-xl font-semibold text-gray-300 mb-2">No tracks yet</h3>
        <p class="text-gray-400 mb-6">Start building your music library by adding your first track</p>
        <a routerLink="/tracks/new" 
           class="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
          Add Your First Track
        </a>
      </div>

      <!-- Track Grid -->
      <div *ngIf="!(loading$ | async) && (tracks$ | async)?.length! > 0" 
           class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let track of tracks$ | async" 
             class="group bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20">
          
          <!-- Track Image Placeholder -->
          <div class="h-48 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
            <svg class="h-20 w-20 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>

          <!-- Track Info -->
          <div class="p-6">
            <h3 class="text-xl font-bold text-white mb-2 truncate">{{ track.title }}</h3>
            <p class="text-purple-300 mb-1 truncate">{{ track.artist }}</p>
            <p class="text-gray-400 text-sm mb-4 truncate">{{ track.category }}</p>
            
            <div class="flex items-center gap-2 text-sm text-gray-400 mb-4">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ formatDuration(track.duration) }}</span>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-2">
              <button 
                (click)="playTrack(track)"
                class="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
                Play
              </button>
              
              <a 
                [routerLink]="['/tracks', track.id, 'edit']"
                class="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition flex items-center justify-center">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </a>
              
              <button 
                (click)="deleteTrack(track.id)"
                class="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition flex items-center justify-center">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    :host {
      display: block;
    }
  `]
})
export class TrackListComponent implements OnInit {
    private store = inject(Store);
    private audioPlayer = inject(AudioPlayerService);

    tracks$: Observable<Track[]> = this.store.select(selectAllTracks);
    loading$: Observable<boolean> = this.store.select(selectTrackLoading);
    error$: Observable<string | null> = this.store.select(selectTrackError);

    ngOnInit(): void {
        this.store.dispatch(TrackActions.loadTracks());
    }

    playTrack(track: Track): void {
        this.audioPlayer.playTrack(track);
    }

    deleteTrack(id: number): void {
        if (confirm('Are you sure you want to delete this track?')) {
            this.store.dispatch(TrackActions.deleteTrack({ id }));
        }
    }

    formatDuration(seconds: number): string {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}
