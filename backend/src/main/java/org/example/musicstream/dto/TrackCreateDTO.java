package org.example.musicstream.dto;

import jakarta.validation.constraints.*;

public record TrackCreateDTO(

        @NotBlank
        @Size(max = 50)
        String title,

        @NotBlank
        @Size(max = 50)
        String artist,

        @Size(max = 200)
        String description,

        @NotBlank
        @Size(max = 30)
        String category

) {}
