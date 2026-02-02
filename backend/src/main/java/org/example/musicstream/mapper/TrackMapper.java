package org.example.musicstream.mapper;

import org.example.musicstream.dto.TrackResponseDTO;
import org.example.musicstream.entity.Track;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TrackMapper {

    @Mapping(target = "fileUrl", expression = "java(track.getFilePath() != null && !track.getFilePath().isEmpty() ? \"/api/tracks/\" + track.getId() + \"/stream\" : null)")
    TrackResponseDTO toDto(Track track);
}
