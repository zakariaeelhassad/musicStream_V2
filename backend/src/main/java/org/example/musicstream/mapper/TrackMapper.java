package org.example.musicstream.mapper;

import org.example.musicstream.dto.TrackResponseDTO;
import org.example.musicstream.entity.Track;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


@Mapper(componentModel = "spring")
public interface TrackMapper {

    @Mapping(
            target = "fileUrl",
            expression = "java(\"/api/tracks/\" + track.getId() + \"/stream\")"
    )
    TrackResponseDTO toDto(Track track);
}

