package com.inspirehub.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.inspirehub.common.Result;
import com.inspirehub.dto.InspirationCreateRequest;
import com.inspirehub.dto.InspirationUpdateRequest;
import com.inspirehub.dto.InspirationVO;
import com.inspirehub.service.InspirationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inspirations")
@RequiredArgsConstructor
public class InspirationController {

    private final InspirationService inspirationService;

    /** 创建灵感 */
    @PostMapping
    public Result<InspirationVO> create(Authentication auth,
                                        @Valid @RequestBody InspirationCreateRequest request) {
        Long userId = (Long) auth.getPrincipal();
        return Result.success(inspirationService.create(userId, request));
    }

    /** 分页列表 + 筛选 */
    @GetMapping
    public Result<IPage<InspirationVO>> list(
            Authentication auth,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String domain,
            @RequestParam(required = false) String tags) {
        Long userId = (Long) auth.getPrincipal();
        return Result.success(inspirationService.list(userId, page, size, type, domain, tags));
    }

    /** 全文搜索 */
    @GetMapping("/search")
    public Result<List<InspirationVO>> search(Authentication auth,
                                               @RequestParam String q) {
        Long userId = (Long) auth.getPrincipal();
        return Result.success(inspirationService.search(userId, q));
    }

    /** 获取详情 */
    @GetMapping("/{id}")
    public Result<InspirationVO> getById(Authentication auth, @PathVariable Long id) {
        Long userId = (Long) auth.getPrincipal();
        return Result.success(inspirationService.getById(userId, id));
    }

    /** 更新灵感 */
    @PutMapping("/{id}")
    public Result<InspirationVO> update(Authentication auth,
                                        @PathVariable Long id,
                                        @Valid @RequestBody InspirationUpdateRequest request) {
        Long userId = (Long) auth.getPrincipal();
        return Result.success(inspirationService.update(userId, id, request));
    }

    /** 删除灵感 */
    @DeleteMapping("/{id}")
    public Result<Void> delete(Authentication auth, @PathVariable Long id) {
        Long userId = (Long) auth.getPrincipal();
        inspirationService.delete(userId, id);
        return Result.success();
    }
}
