package com.inspirehub.controller;

import com.inspirehub.common.Result;
import com.inspirehub.dto.TagCount;
import com.inspirehub.service.TagService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "标签", description = "标签云")
@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    @Operation(summary = "获取标签云", description = "返回当前用户所有标签及使用频次，按使用次数降序排列")
    @GetMapping
    public Result<List<TagCount>> getUserTags(@Parameter(hidden = true) Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return Result.success(tagService.getUserTags(userId));
    }
}
