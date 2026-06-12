package com.inspirehub.service;

import cn.hutool.core.util.StrUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.inspirehub.common.BusinessException;
import com.inspirehub.common.ErrorCode;
import com.inspirehub.dto.InspirationVO;
import com.inspirehub.entity.Inspiration;
import com.inspirehub.mapper.InspirationMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ImportExportService {

    private final InspirationMapper inspirationMapper;
    private final InspirationService inspirationService;
    private final ObjectMapper objectMapper;

    /** 导出当前用户所有灵感为 JSON */
    public String exportJson(Long userId) {
        List<InspirationVO> all = inspirationService.list(userId, 1, 10000, null, null, null).getRecords();
        try {
            return objectMapper.writeValueAsString(all);
        } catch (Exception e) {
            throw new RuntimeException("导出失败", e);
        }
    }

    /** 从 JSON 数组导入 */
    @Transactional
    public int importJson(Long userId, String json) {
        try {
            List<Map<String, Object>> items = objectMapper.readValue(json,
                    objectMapper.getTypeFactory().constructCollectionType(List.class, Map.class));

            int count = 0;
            for (Map<String, Object> item : items) {
                String title = (String) item.get("title");
                if (StrUtil.isBlank(title)) continue;

                // 跳过重复 title
                if (inspirationMapper.selectCount(
                        new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<Inspiration>()
                                .eq(Inspiration::getUserId, userId)
                                .eq(Inspiration::getTitle, title)) > 0) {
                    continue;
                }

                Inspiration entity = Inspiration.builder()
                        .userId(userId)
                        .title(title)
                        .type(Objects.toString(item.get("type"), "note"))
                        .content(Objects.toString(item.get("content"), ""))
                        .domain(listStr(item.get("domain")))
                        .tags(listStr(item.get("tags")))
                        .notes((String) item.get("notes"))
                        .language((String) item.get("language"))
                        .sourceUrl((String) item.get("sourceUrl"))
                        .build();

                inspirationMapper.insert(entity);
                count++;
            }

            log.info("导入完成: userId={}, imported={}", userId, count);
            return count;
        } catch (Exception e) {
            log.error("导入失败", e);
            throw new BusinessException(ErrorCode.IMPORT_FAILED, "JSON 格式错误");
        }
    }

    @SuppressWarnings("unchecked")
    private String listStr(Object obj) {
        if (obj instanceof List<?> list) {
            return list.stream().map(Object::toString).collect(Collectors.joining(","));
        }
        return Objects.toString(obj, "");
    }
}
