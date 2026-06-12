package com.inspirehub.controller;

import com.inspirehub.common.Result;
import com.inspirehub.service.ImportExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ImportExportController {

    private final ImportExportService importExportService;

    /** 导出所有灵感为 JSON */
    @GetMapping("/export")
    public ResponseEntity<byte[]> exportJson(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        String json = importExportService.exportJson(userId);

        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=inspirehub-export.json")
                .contentType(MediaType.APPLICATION_JSON)
                .body(bytes);
    }

    /** 导入 JSON */
    @PostMapping("/import")
    public Result<Map<String, Integer>> importJson(Authentication auth,
                                                    @RequestBody String json) {
        Long userId = (Long) auth.getPrincipal();
        int count = importExportService.importJson(userId, json);
        return Result.success(Map.of("imported", count));
    }
}
