package org.example.musicstream.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tracks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Track {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String title;

    @Column(nullable = false, length = 50)
    private String artist;

    @Column(length = 200)
    private String description;

    @Column
    private Long duration;

    @Column(nullable = false, length = 30)
    private String category;

    @Column(length = 255)
    private String fileName;

    @Column
    private Long fileSize;

    @Column(length = 50)
    private String mimeType;

    @Column
    private String filePath;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

//    @PrePersist
//    void onCreate() {
//        this.createdAt = LocalDateTime.now();
//    }
}
