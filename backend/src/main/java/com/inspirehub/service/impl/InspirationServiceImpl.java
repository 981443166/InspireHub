package com.inspirehub.service.impl;

import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.inspirehub.common.BusinessException;
import com.inspirehub.common.ErrorCode;
import com.inspirehub.dto.InspirationCreateRequest;
import com.inspirehub.dto.InspirationUpdateRequest;
import com.inspirehub.dto.InspirationVO;
import com.inspirehub.entity.Inspiration;
import com.inspirehub.mapper.InspirationMapper;
import com.inspirehub.service.InspirationService;
import com.inspirehub.service.LinkMetadataService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class InspirationServiceImpl implements InspirationService {

    private final InspirationMapper inspirationMapper;
    private final LinkMetadataService linkMetadataService;

    @Override
    @Transactional
    @CacheEvict(value = "tags", key = "#userId")
    public InspirationVO create(Long userId, InspirationCreateRequest request) {
        Inspiration entity = Inspiration.builder()
                .userId(userId)
                .title(request.getTitle())
                .type(request.getType())
                .content(request.getContent())
                .domain(listToStr(request.getDomain()))
                .tags(listToStr(request.getTags()))
                .notes(request.getNotes())
                .language(request.getLanguage())
                .sourceUrl(request.getSourceUrl())
                .build();

        inspirationMapper.insert(entity);

        // 异步抓取链接缩略图
        linkMetadataService.enrichLinkMeta(entity, inspirationMapper);

        return toVO(entity);
    }

    @Override
    public IPage<InspirationVO> list(Long userId, int page, int size,
                                     String type, String domain, String tags) {
        // count 专用 wrapper（不带 ORDER BY）
        LambdaQueryWrapper<Inspiration> countWrapper = buildQuery(userId, type, domain, tags);
        long total = inspirationMapper.selectCount(countWrapper);

        // 列表 wrapper（带排序 + 分页）
        LambdaQueryWrapper<Inspiration> listWrapper = buildQuery(userId, type, domain, tags);
        listWrapper.orderByDesc(Inspiration::getCreatedAt);
        int offset = (page - 1) * size;
        listWrapper.last("LIMIT " + size + " OFFSET " + offset);

        List<InspirationVO> records = inspirationMapper.selectList(listWrapper).stream()
                .map(this::toVO)
                .collect(Collectors.toList());

        Page<InspirationVO> result = new Page<>(page, size, total);
        result.setRecords(records);
        return result;
    }

    @Override
    public InspirationVO getById(Long userId, Long id) {
        return toVO(findOwn(userId, id));
    }

    @Override
    @Transactional
    @CacheEvict(value = "tags", key = "#userId")
    public InspirationVO update(Long userId, Long id, InspirationUpdateRequest request) {
        Inspiration entity = findOwn(userId, id);

        if (request.getTitle() != null) entity.setTitle(request.getTitle());
        if (request.getType() != null) entity.setType(request.getType());
        if (request.getContent() != null) entity.setContent(request.getContent());
        if (request.getDomain() != null) entity.setDomain(listToStr(request.getDomain()));
        if (request.getTags() != null) entity.setTags(listToStr(request.getTags()));
        if (request.getNotes() != null) entity.setNotes(request.getNotes());
        if (request.getLanguage() != null) entity.setLanguage(request.getLanguage());
        if (request.getSourceUrl() != null) entity.setSourceUrl(request.getSourceUrl());

        inspirationMapper.updateById(entity);
        return toVO(entity);
    }

    @Override
    @Transactional
    @CacheEvict(value = "tags", key = "#userId")
    public void delete(Long userId, Long id) {
        Inspiration entity = findOwn(userId, id);
        inspirationMapper.deleteById(entity.getId());
    }

    @Override
    public List<InspirationVO> search(Long userId, String keyword) {
        LambdaQueryWrapper<Inspiration> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Inspiration::getUserId, userId)
                .and(w -> w
                        .like(Inspiration::getTitle, keyword)
                        .or()
                        .like(Inspiration::getNotes, keyword)
                        .or()
                        .like(Inspiration::getContent, keyword)
                )
                .orderByDesc(Inspiration::getCreatedAt);

        return inspirationMapper.selectList(wrapper).stream()
                .map(this::toVO)
                .collect(Collectors.toList());
    }

    // ---- 内部 ----

    private LambdaQueryWrapper<Inspiration> buildQuery(Long userId, String type,
                                                        String domain, String tags) {
        LambdaQueryWrapper<Inspiration> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Inspiration::getUserId, userId);

        if (StrUtil.isNotBlank(type)) {
            wrapper.in(Inspiration::getType, Arrays.asList(type.split(",")));
        }
        if (StrUtil.isNotBlank(domain)) {
            for (String d : domain.split(",")) {
                wrapper.like(Inspiration::getDomain, d);
            }
        }
        if (StrUtil.isNotBlank(tags)) {
            for (String t : tags.split(",")) {
                wrapper.like(Inspiration::getTags, t);
            }
        }
        return wrapper;
    }

    private Inspiration findOwn(Long userId, Long id) {
        Inspiration entity = inspirationMapper.selectById(id);
        if (entity == null) throw new BusinessException(ErrorCode.NOT_FOUND, "灵感不存在");
        if (!entity.getUserId().equals(userId)) throw new BusinessException(ErrorCode.FORBIDDEN);
        return entity;
    }

    private InspirationVO toVO(Inspiration e) {
        return InspirationVO.builder()
                .id(e.getId()).userId(e.getUserId()).title(e.getTitle())
                .type(e.getType()).content(e.getContent())
                .domain(strToList(e.getDomain())).tags(strToList(e.getTags()))
                .notes(e.getNotes()).language(e.getLanguage())
                .sourceUrl(e.getSourceUrl()).imageThumbnail(e.getImageThumbnail())
                .createdAt(e.getCreatedAt()).updatedAt(e.getUpdatedAt())
                .build();
    }

    private static String listToStr(List<String> list) {
        return (list == null || list.isEmpty()) ? "" : String.join(",", list);
    }

    private static List<String> strToList(String s) {
        return StrUtil.isBlank(s) ? Collections.emptyList() : Arrays.asList(s.split(","));
    }
}
