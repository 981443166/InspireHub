package com.inspirehub.controller;

import com.inspirehub.common.Result;
import com.inspirehub.service.ImportExportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.Map;

@Tag(name = "导入导出", description = "数据备份与迁移")
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ImportExportController {

    private final ImportExportService importExportService;

    @Operation(summary = "导出灵感", description = "导出当前用户所有灵感为 JSON 文件下载")
    @GetMapping("/export")
    public ResponseEntity<byte[]> exportJson(@Parameter(hidden = true) Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        String json = importExportService.exportJson(userId);

        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=inspirehub-export.json")
                .contentType(MediaType.APPLICATION_JSON)
                .body(bytes);
    }

    @Operation(summary = "导入灵感", description = "导入 JSON 数组，已存在的 title 自动跳过（去重）")
    @PostMapping("/import")
    public Result<Map<String, Integer>> importJson(@Parameter(hidden = true) Authentication auth,
                                                    @RequestBody String json) {
        Long userId = (Long) auth.getPrincipal();
        int count = importExportService.importJson(userId, json);
        return Result.success(Map.of("imported", count));
    }
}
