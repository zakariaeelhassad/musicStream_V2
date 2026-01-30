package org.example.musicstream.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileStorageService {

    /**
     * Store an audio file and return the file path
     */
    String storeFile(MultipartFile file, Long trackId) throws IOException;

    /**
     * Delete a file by its path
     */
    void deleteFile(String filePath) throws IOException;

    /**
     * Get audio duration in seconds from file
     */
    Long getAudioDuration(MultipartFile file) throws IOException;

    /**
     * Validate if the file is a valid audio file
     */
    void validateAudioFile(MultipartFile file);
}
