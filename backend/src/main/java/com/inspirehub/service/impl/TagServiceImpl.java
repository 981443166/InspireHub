package com.inspirehub.service.impl;

import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.inspirehub.dto.TagCount;
import com.inspirehub.entity.Inspiration;
import com.inspirehub.mapper.InspirationMapper;
import com.inspirehub.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TagServiceImpl implements TagService {

    private final InspirationMapper inspirationMapper;

    @Override
    @Cacheable(value = "tags", key = "#userId")
    public List<TagCount> getUserTags(Long userId) {
        // 查当前用户所有灵感的 tags 字段
        List<Inspiration> inspirations = inspirationMapper.selectList(
                new LambdaQueryWrapper<Inspiration>()
                        .eq(Inspiration::getUserId, userId)
                        .select(Inspiration::getTags));

        // 聚合统计
        Map<String, Long> counter = new HashMap<>();
        for (Inspiration insp : inspirations) {
            if (StrUtil.isBlank(insp.getTags())) continue;
            for (String tag : insp.getTags().split(",")) {
                String trimmed = tag.trim();
                if (!trimmed.isEmpty()) {
                    counter.merge(trimmed, 1L, Long::sum);
                }
            }
        }

        return counter.entrySet().stream()
                .map(e -> new TagCount(e.getKey(), e.getValue()))
                .sorted((a, b) -> Long.compare(b.getCount(), a.getCount()))
                .collect(Collectors.toList());
    }
}
