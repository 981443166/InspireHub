package com.inspirehub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InspirationVO {

    private Long id;
    private Long userId;
    private String title;
    private String type;
    private String content;
    private List<String> domain;
    private List<String> tags;
    private String notes;
    private String language;
    private String sourceUrl;
    private String imageThumbnail;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
