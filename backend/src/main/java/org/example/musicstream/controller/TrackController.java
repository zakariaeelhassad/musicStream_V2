package org.example.musicstream.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.musicstream.dto.TrackCreateDTO;
import org.example.musicstream.dto.TrackResponseDTO;
import org.example.musicstream.dto.TrackUpdateDTO;
import org.example.musicstream.service.TrackService;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.List;

@RestController
@RequestMapping("/api/tracks")
@RequiredArgsConstructor
public class TrackController {

    private final TrackService trackService;

    private static final String UPLOAD_DIR = "uploads/";

    /* ================= CRUD ================= */

    @PostMapping
    public ResponseEntity<TrackResponseDTO> create(
            @Valid @RequestBody TrackCreateDTO dto) {

        TrackResponseDTO createdTrack = trackService.createTrack(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTrack);
    }

    @GetMapping
    public ResponseEntity<List<TrackResponseDTO>> getAll() {
        return ResponseEntity.ok(trackService.getAllTracks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrackResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(trackService.getTrackById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TrackResponseDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody TrackUpdateDTO dto) {

        return ResponseEntity.ok(trackService.updateTrack(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        trackService.deleteTrack(id);
        return ResponseEntity.noContent().build();
    }

    /* ================= UPLOAD AUDIO ================= */

    @PostMapping("/{id}/upload")
    public ResponseEntity<TrackResponseDTO> uploadAudio(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) throws IOException {

        TrackResponseDTO updatedTrack = trackService.uploadAudioFile(id, file);
        return ResponseEntity.ok(updatedTrack);
    }

    /* ================= STREAM AUDIO ================= */

    @GetMapping("/{id}/stream")
    public ResponseEntity<Resource> stream(
            @PathVariable Long id,
            @RequestHeader(value = "Range", required = false) String rangeHeader) throws IOException {

        TrackResponseDTO track = trackService.getTrackById(id);

        if (track.filePath() == null || track.filePath().isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        // Use filePath directly from the track
        File file = new File(UPLOAD_DIR + track.filePath());

        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = new FileSystemResource(file);
        HttpHeaders headers = new HttpHeaders();

        String contentType = Files.probeContentType(file.toPath());
        if (contentType != null) {
            headers.setContentType(MediaType.parseMediaType(contentType));
        } else {
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        }

        headers.setContentLength(file.length());
        headers.set("Accept-Ranges", "bytes");

        return new ResponseEntity<>(resource, headers, HttpStatus.OK);
    }
}
