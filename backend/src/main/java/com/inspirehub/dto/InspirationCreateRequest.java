package com.inspirehub.dto;

import com.inspirehub.annotation.ValidDomain;
import com.inspirehub.annotation.ValidType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class InspirationCreateRequest {

    @NotBlank(message = "标题不能为空")
    @Size(max = 200, message = "标题最长 200 字符")
    private String title;

    @NotBlank(message = "类型不能为空")
    @ValidType
    private String type;

    @NotBlank(message = "内容不能为空")
    private String content;

    @ValidDomain
    private List<String> domain;

    private List<String> tags;

    private String notes;

    private String language;

    private String sourceUrl;
}
