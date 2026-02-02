import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Track, TrackCreateDTO, TrackUpdateDTO, TRACK_CATEGORIES } from '../../core/models/track.model';

@Component({
    selector: 'app-track-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './track-form.component.html',
    styleUrls: []
})
export class TrackFormComponent implements OnInit {
    private fb = inject(FormBuilder);

    @Input() track?: Track;
    @Input() isLoading = false;

    @Output() submit = new EventEmitter<{ data: TrackCreateDTO | TrackUpdateDTO, file?: File }>();
    @Output() cancel = new EventEmitter<void>();

    trackForm!: FormGroup;
    categories = TRACK_CATEGORIES;
    selectedFile: File | null = null;
    fileName: string = '';

    ngOnInit(): void {
        this.trackForm = this.fb.group({
            title: [this.track?.title || '', [Validators.required, Validators.maxLength(50)]],
            artist: [this.track?.artist || '', [Validators.required, Validators.maxLength(50)]],
            description: [this.track?.description || '', [Validators.maxLength(200)]],
            category: [this.track?.category || 'Pop', [Validators.required]]
        });
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];

            // Validate file type
            if (!file.type.startsWith('audio/')) {
                alert('Please select an audio file');
                return;
            }

            this.selectedFile = file;
            this.fileName = file.name;
        }
    }

    onSubmit(): void {
        if (this.trackForm.valid) {
            const formData = this.trackForm.value;
            this.submit.emit({
                data: formData,
                file: this.selectedFile || undefined
            });
        }
    }

    onCancel(): void {
        this.cancel.emit();
    }

    get isEditMode(): boolean {
        return !!this.track;
    }

    get title() { return this.trackForm.get('title'); }
    get artist() { return this.trackForm.get('artist'); }
    get description() { return this.trackForm.get('description'); }
    get category() { return this.trackForm.get('category'); }
}
