import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackFormComponent } from '../track-form/track-form.component';
import { Track, TrackCreateDTO, TrackUpdateDTO } from '../../core/models/track.model';

@Component({
    selector: 'app-track-dialog',
    standalone: true,
    imports: [CommonModule, TrackFormComponent],
    templateUrl: './track-dialog.component.html',
    styleUrls: ['./track-dialog.component.css']
})
export class TrackDialogComponent {
    @Input() track?: Track;
    @Input() isLoading = false;
    @Input() isOpen = false;

    @Output() submit = new EventEmitter<{ data: TrackCreateDTO | TrackUpdateDTO, file?: File }>();
    @Output() close = new EventEmitter<void>();

    onSubmit(event: { data: TrackCreateDTO | TrackUpdateDTO, file?: File }): void {
        this.submit.emit(event);
    }

    onClose(): void {
        this.close.emit();
    }

    onOverlayClick(event: MouseEvent): void {
        if (event.target === event.currentTarget) {
            this.onClose();
        }
    }
}
