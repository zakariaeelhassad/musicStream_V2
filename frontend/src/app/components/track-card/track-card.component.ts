import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Track } from '../../core/models/track.model';

@Component({
    selector: 'app-track-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './track-card.component.html',
    styleUrls: []
})
export class TrackCardComponent {
    @Input() track!: Track;
    @Input() currentDuration?: number;
    @Input() isPlaying = false;

    @Output() play = new EventEmitter<Track>();
    @Output() edit = new EventEmitter<Track>();
    @Output() delete = new EventEmitter<Track>();

    onPlay(): void {
        this.play.emit(this.track);
    }

    onEdit(): void {
        this.edit.emit(this.track);
    }

    onDelete(): void {
        if (confirm(`Are you sure you want to delete "${this.track.title}"?`)) {
            this.delete.emit(this.track);
        }
    }

    formatDuration(seconds?: number): string {
        if (seconds === undefined || seconds === null || !isFinite(seconds)) return '--:--';
        if (seconds === 0) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}
