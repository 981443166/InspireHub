package com.inspirehub.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@TableName("inspirations")
public class Inspiration {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;

    private String title;

    /** link / image / code / note */
    private String type;

    private String content;

    /** 逗号分隔 (H2)，PG 为 TEXT[] */
    private String domain;

    /** 逗号分隔 (H2)，PG 为 TEXT[] */
    private String tags;

    private String notes;

    private String language;

    private String sourceUrl;

    private String imageThumbnail;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
