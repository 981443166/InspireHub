package com.inspirehub.controller;

import com.inspirehub.common.Result;
import com.inspirehub.dto.TagCount;
import com.inspirehub.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    @GetMapping
    public Result<List<TagCount>> getUserTags(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return Result.success(tagService.getUserTags(userId));
    }
}
