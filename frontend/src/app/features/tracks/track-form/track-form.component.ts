import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TrackActions } from '../../../store/tracks/track.actions';
import { selectSelectedTrack, selectTrackLoading } from '../../../store/tracks/track.selectors';
import { Track } from '../../../core/models/track.model';

@Component({
  selector: 'app-track-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="max-w-2xl mx-auto">
      <div class="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-8">
        <!-- Header -->
        <div class="mb-8">
          <h2 class="text-3xl font-bold text-white mb-2">
            {{ isEditMode ? 'Edit Track' : 'Add New Track' }}
          </h2>
          <p class="text-gray-400">Fill in the details below to {{ isEditMode ? 'update' : 'create' }} your track</p>
        </div>

        <!-- Form -->
        <form [formGroup]="trackForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- Title -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Track Title *
            </label>
            <input
              type="text"
              formControlName="title"
              placeholder="Enter track title"
              class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition">
            <p *ngIf="trackForm.get('title')?.invalid && trackForm.get('title')?.touched" 
               class="mt-1 text-sm text-red-400">
              Title is required (max 50 characters)
            </p>
          </div>

          <!-- Artist -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Artist *
            </label>
            <input
              type="text"
              formControlName="artist"
              placeholder="Enter artist name"
              class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition">
            <p *ngIf="trackForm.get('artist')?.invalid && trackForm.get('artist')?.touched" 
               class="mt-1 text-sm text-red-400">
              Artist is required (max 50 characters)
            </p>
          </div>

          <!-- Category -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Category *
            </label>
            <select
              formControlName="category"
              class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition">
              <option value="" disabled>Select a category</option>
              <option value="Pop">Pop</option>
              <option value="Rock">Rock</option>
              <option value="Hip-Hop">Hip-Hop</option>
              <option value="Electronic">Electronic</option>
              <option value="Jazz">Jazz</option>
              <option value="Classical">Classical</option>
              <option value="R&B">R&B</option>
              <option value="Country">Country</option>
              <option value="Other">Other</option>
            </select>
            <p *ngIf="trackForm.get('category')?.invalid && trackForm.get('category')?.touched" 
               class="mt-1 text-sm text-red-400">
              Category is required
            </p>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              formControlName="description"
              rows="4"
              placeholder="Add a description (optional)"
              class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition resize-none"></textarea>
            <p *ngIf="trackForm.get('description')?.invalid && trackForm.get('description')?.touched" 
               class="mt-1 text-sm text-red-400">
              Description must be less than 200 characters
            </p>
          </div>

          <!-- File Upload (only for new tracks or after creation) -->
          <div *ngIf="!isEditMode || (isEditMode && selectedTrack)">
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Audio File {{ isEditMode ? '(Upload new to replace)' : '*' }}
            </label>
            <div class="relative">
              <input
                type="file"
                #fileInput
                (change)="onFileSelected($event)"
                accept="audio/mp3,audio/mpeg,audio/wav,audio/ogg"
                class="hidden">
              <button
                type="button"
                (click)="fileInput.click()"
                class="w-full px-4 py-3 bg-white/5 border-2 border-dashed border-white/20 rounded-lg text-gray-400 hover:border-purple-500 hover:text-purple-400 transition flex items-center justify-center gap-2">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span>{{ selectedFile ? selectedFile.name : 'Click to upload audio file' }}</span>
              </button>
            </div>
            <p class="mt-1 text-sm text-gray-400">
              Supported formats: MP3, WAV, OGG (Max 10MB)
            </p>
            <p *ngIf="!isEditMode && !selectedFile && formSubmitted" 
               class="mt-1 text-sm text-red-400">
              Audio file is required for new tracks
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4 pt-4">
            <button
              type="submit"
              [disabled]="loading$ | async"
              class="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
              <span *ngIf="!(loading$ | async)">{{ isEditMode ? 'Update Track' : 'Create Track' }}</span>
              <span *ngIf="loading$ | async" class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            </button>
            
            <a
              routerLink="/tracks"
              class="px-6 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition flex items-center justify-center">
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class TrackFormComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  trackForm!: FormGroup;
  selectedFile: File | null = null;
  isEditMode = false;
  trackId: number | null = null;
  formSubmitted = false;
  selectedTrack: Track | null = null;

  loading$: Observable<boolean> = this.store.select(selectTrackLoading);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  private initForm(): void {
    this.trackForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      artist: ['', [Validators.required, Validators.maxLength(50)]],
      category: ['', Validators.required],
      description: ['', Validators.maxLength(200)]
    });
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.trackId = +id;
      this.store.dispatch(TrackActions.loadTrack({ id: this.trackId }));

      this.store.select(selectSelectedTrack)
        .pipe(takeUntil(this.destroy$))
        .subscribe(track => {
          if (track) {
            this.selectedTrack = track;
            this.trackForm.patchValue({
              title: track.title,
              artist: track.artist,
              category: track.category,
              description: track.description || ''
            });
          }
        });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    this.formSubmitted = true;

    if (this.trackForm.invalid) {
      Object.keys(this.trackForm.controls).forEach(key => {
        this.trackForm.get(key)?.markAsTouched();
      });
      return;
    }

    if (!this.isEditMode && !this.selectedFile) {
      return;
    }

    const trackData = this.trackForm.value;

    if (this.isEditMode && this.trackId) {
      // Update track metadata
      this.store.dispatch(TrackActions.updateTrack({
        id: this.trackId,
        track: trackData
      }));

      // Upload new file if selected
      if (this.selectedFile) {
        this.store.dispatch(TrackActions.uploadAudio({
          trackId: this.trackId,
          file: this.selectedFile
        }));
      }

      setTimeout(() => this.router.navigate(['/tracks']), 1000);
    } else {
      // Create new track
      this.store.dispatch(TrackActions.createTrack({ track: trackData }));

      // Wait for track creation, then upload file
      this.store.select(selectSelectedTrack)
        .pipe(takeUntil(this.destroy$))
        .subscribe(track => {
          if (track && this.selectedFile) {
            this.store.dispatch(TrackActions.uploadAudio({
              trackId: track.id,
              file: this.selectedFile!
            }));
            setTimeout(() => this.router.navigate(['/tracks']), 1500);
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
