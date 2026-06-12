package com.inspirehub.service.fileStorage;

import cn.hutool.core.io.FileUtil;
import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Slf4j
@Service
@ConditionalOnProperty(name = "storage.type", havingValue = "local", matchIfMissing = true)
public class LocalFileStorageService implements FileStorageService {

    @Value("${storage.local.upload-dir:./uploads/images}")
    private String uploadDir;

    @Override
    public String upload(String fileName, InputStream inputStream, String contentType) {
        String ext = FileUtil.extName(fileName);
        String newName = UUID.randomUUID().toString().replace("-", "") + "." + ext;
        Path targetPath = Path.of(uploadDir, newName);

        try {
            Files.createDirectories(targetPath.getParent());
            Files.copy(inputStream, targetPath, StandardCopyOption.REPLACE_EXISTING);
            log.info("文件上传成功: {} -> {}", fileName, targetPath);
            return "/uploads/images/" + newName;
        } catch (IOException e) {
            log.error("文件上传失败: {}", fileName, e);
            throw new RuntimeException("文件上传失败", e);
        }
    }

    @Override
    public String getUrl(String fileName) {
        if (StrUtil.startWith(fileName, "/uploads")) {
            return fileName;
        }
        return "/uploads/images/" + fileName;
    }

    @Override
    public void delete(String fileName) {
        String name = fileName.replace("/uploads/images/", "");
        Path filePath = Path.of(uploadDir, name);
        try {
            Files.deleteIfExists(filePath);
            log.info("文件删除: {}", filePath);
        } catch (IOException e) {
            log.warn("文件删除失败: {}", filePath);
        }
    }
}
