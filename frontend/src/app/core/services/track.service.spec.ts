import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TrackService } from './track.service';
import { Track, TrackCreateDTO, TrackUpdateDTO } from '../models/track.model';
import { environment } from '../../../environments/environment';

describe('TrackService', () => {
    let service: TrackService;
    let httpMock: HttpTestingController;
    const apiUrl = environment.apiUrl;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [TrackService]
        });
        service = TestBed.inject(TrackService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getAllTracks', () => {
        it('should return an array of tracks', () => {
            const mockTracks: Track[] = [
                { id: 1, title: 'Track 1', artist: 'Artist 1', category: 'Rock', description: 'Desc 1', duration: 180, fileUrl: 'http://localhost/api/tracks/1/stream', createdAt: '2024-01-01T00:00:00Z' },
                { id: 2, title: 'Track 2', artist: 'Artist 2', category: 'Pop', description: 'Desc 2', duration: 200, fileUrl: 'http://localhost/api/tracks/2/stream', createdAt: '2024-01-01T00:00:00Z' }
            ];

            service.getAllTracks().subscribe(tracks => {
                expect(tracks.length).toBe(2);
                expect(tracks).toEqual(mockTracks);
            });

            const req = httpMock.expectOne(`${apiUrl}/tracks`);
            expect(req.request.method).toBe('GET');
            req.flush(mockTracks);
        });
    });

    describe('getTrackById', () => {
        it('should return a single track', () => {
            const mockTrack: Track = { id: 1, title: 'Track 1', artist: 'Artist 1', category: 'Rock', description: 'Desc 1', duration: 180, fileUrl: 'http://localhost/api/tracks/1/stream', createdAt: '2024-01-01T00:00:00Z' };

            service.getTrackById(1).subscribe(track => {
                expect(track).toEqual(mockTrack);
            });

            const req = httpMock.expectOne(`${apiUrl}/tracks/1`);
            expect(req.request.method).toBe('GET');
            req.flush(mockTrack);
        });
    });

    describe('createTrack', () => {
        it('should create a new track', () => {
            const createDTO: TrackCreateDTO = { title: 'New Track', artist: 'New Artist', category: 'Rock', description: 'New Desc' };
            const mockTrack: Track = { id: 1, title: 'New Track', artist: 'New Artist', category: 'Rock', description: 'New Desc', duration: 0, createdAt: '2024-01-01T00:00:00Z' };

            service.createTrack(createDTO).subscribe(track => {
                expect(track).toEqual(mockTrack);
            });

            const req = httpMock.expectOne(`${apiUrl}/tracks`);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(createDTO);
            req.flush(mockTrack);
        });
    });

    describe('updateTrack', () => {
        it('should update an existing track', () => {
            const updateDTO: TrackUpdateDTO = { title: 'Updated Track', artist: 'Updated Artist', category: 'Pop', description: 'Updated Desc' };
            const mockTrack: Track = { id: 1, title: 'Updated Track', artist: 'Updated Artist', category: 'Pop', description: 'Updated Desc', duration: 200, createdAt: '2024-01-01T00:00:00Z' };

            service.updateTrack(1, updateDTO).subscribe(track => {
                expect(track).toEqual(mockTrack);
            });

            const req = httpMock.expectOne(`${apiUrl}/tracks/1`);
            expect(req.request.method).toBe('PUT');
            expect(req.request.body).toEqual(updateDTO);
            req.flush(mockTrack);
        });
    });

    describe('deleteTrack', () => {
        it('should delete a track', () => {
            service.deleteTrack(1).subscribe(response => {
                expect(response).toBeNull();
            });

            const req = httpMock.expectOne(`${apiUrl}/tracks/1`);
            expect(req.request.method).toBe('DELETE');
            req.flush(null);
        });
    });

    describe('uploadAudio', () => {
        it('should upload an audio file', () => {
            const file = new File(['audio content'], 'test.mp3', { type: 'audio/mpeg' });
            const mockTrack: Track = { id: 1, title: 'Track 1', artist: 'Artist 1', category: 'Rock', description: 'Desc 1', duration: 180, fileUrl: 'http://localhost/api/tracks/1/stream', createdAt: '2024-01-01T00:00:00Z' };

            service.uploadAudio(1, file).subscribe(track => {
                expect(track).toEqual(mockTrack);
            });

            const req = httpMock.expectOne(`${apiUrl}/tracks/1/upload`);
            expect(req.request.method).toBe('POST');
            expect(req.request.body instanceof FormData).toBeTruthy();
            req.flush(mockTrack);
        });
    });
});
