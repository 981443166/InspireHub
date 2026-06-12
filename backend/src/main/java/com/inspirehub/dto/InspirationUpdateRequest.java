package com.inspirehub.dto;

import com.inspirehub.annotation.ValidDomain;
import com.inspirehub.annotation.ValidType;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class InspirationUpdateRequest {

    @Size(max = 200, message = "标题最长 200 字符")
    private String title;

    @ValidType
    private String type;

    private String content;

    @ValidDomain
    private List<String> domain;

    private List<String> tags;

    private String notes;

    private String language;

    private String sourceUrl;
}
