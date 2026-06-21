package com.inspirehub.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.inspirehub.common.Result;
import com.inspirehub.dto.InspirationCreateRequest;
import com.inspirehub.dto.InspirationUpdateRequest;
import com.inspirehub.dto.InspirationVO;
import com.inspirehub.service.InspirationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "灵感", description = "灵感 CRUD + 筛选 + 全文搜索")
@RestController
@RequestMapping("/api/inspirations")
@RequiredArgsConstructor
public class InspirationController {

    private final InspirationService inspirationService;

    @Operation(summary = "创建灵感", description = "创建一条灵感记录。类型: link/image/code/note/html")
    @PostMapping
    public Result<InspirationVO> create(@Parameter(hidden = true) Authentication auth,
                                        @Valid @RequestBody InspirationCreateRequest request) {
        Long userId = (Long) auth.getPrincipal();
        return Result.success(inspirationService.create(userId, request));
    }

    @Operation(summary = "分页列表", description = "分页获取灵感列表，支持 type/domain/tags 组合筛选（AND 逻辑）")
    @GetMapping
    public Result<IPage<InspirationVO>> list(
            @Parameter(hidden = true) Authentication auth,
            @Parameter(description = "页码", example = "1") @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "每页条数", example = "20") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "类型筛选 (逗号分隔)", example = "code,html") @RequestParam(required = false) String type,
            @Parameter(description = "领域筛选 (逗号分隔)", example = "design") @RequestParam(required = false) String domain,
            @Parameter(description = "标签筛选 (逗号分隔)", example = "css,button") @RequestParam(required = false) String tags) {
        Long userId = (Long) auth.getPrincipal();
        return Result.success(inspirationService.list(userId, page, size, type, domain, tags));
    }

    @Operation(summary = "全文搜索", description = "按关键字检索标题/备注/内容")
    @GetMapping("/search")
    public Result<List<InspirationVO>> search(@Parameter(hidden = true) Authentication auth,
                                               @Parameter(description = "搜索关键词") @RequestParam String q) {
        Long userId = (Long) auth.getPrincipal();
        return Result.success(inspirationService.search(userId, q));
    }

    @Operation(summary = "获取详情")
    @GetMapping("/{id}")
    public Result<InspirationVO> getById(@Parameter(hidden = true) Authentication auth,
                                          @Parameter(description = "灵感 ID") @PathVariable Long id) {
        Long userId = (Long) auth.getPrincipal();
        return Result.success(inspirationService.getById(userId, id));
    }

    @Operation(summary = "更新灵感", description = "部分字段更新")
    @PutMapping("/{id}")
    public Result<InspirationVO> update(@Parameter(hidden = true) Authentication auth,
                                         @Parameter(description = "灵感 ID") @PathVariable Long id,
                                         @Valid @RequestBody InspirationUpdateRequest request) {
        Long userId = (Long) auth.getPrincipal();
        return Result.success(inspirationService.update(userId, id, request));
    }

    @Operation(summary = "删除灵感")
    @DeleteMapping("/{id}")
    public Result<Void> delete(@Parameter(hidden = true) Authentication auth,
                                @Parameter(description = "灵感 ID") @PathVariable Long id) {
        Long userId = (Long) auth.getPrincipal();
        inspirationService.delete(userId, id);
        return Result.success();
    }
}
