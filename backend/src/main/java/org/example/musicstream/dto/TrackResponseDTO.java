package org.example.musicstream.dto;

import java.time.LocalDateTime;

public record TrackResponseDTO(

        Long id,
        String title,
        String artist,
        String description,
        Long duration,
        String category,
        String fileUrl,
        LocalDateTime createdAt

) {}
