package org.example.musicstream.repository;

import org.example.musicstream.entity.Track;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrackRepository extends JpaRepository<Track, Long> {

    List<Track> findByTitleContainingIgnoreCase(String title);

    List<Track> findByCategoryIgnoreCase(String category);

    List<Track> findByArtistContainingIgnoreCase(String artist);
}
