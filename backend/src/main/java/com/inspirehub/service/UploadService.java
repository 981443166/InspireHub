package com.inspirehub.service;

import com.inspirehub.common.BusinessException;
import com.inspirehub.common.ErrorCode;
import com.inspirehub.service.fileStorage.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class UploadService {

    private final FileStorageService fileStorageService;

    private static final Set<String> ALLOWED_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp", "image/gif");

    private static final long MAX_SIZE = 10 * 1024 * 1024; // 10MB

    /**
     * 上传图片，返回原始图 URL + 缩略图 URL
     */
    public String uploadImage(MultipartFile file) {
        // 校验类型
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
            throw new BusinessException(ErrorCode.FILE_TYPE_NOT_ALLOWED);
        }
        // 校验大小
        if (file.getSize() > MAX_SIZE) {
            throw new BusinessException(ErrorCode.FILE_TOO_LARGE);
        }

        try {
            byte[] bytes = file.getBytes();

            // 上传原始图
            String url = fileStorageService.upload(file.getOriginalFilename(),
                    new ByteArrayInputStream(bytes), contentType);

            // 生成缩略图
            ByteArrayOutputStream thumbOut = new ByteArrayOutputStream();
            Thumbnails.of(new ByteArrayInputStream(bytes))
                    .size(400, 300)
                    .outputFormat("jpg")
                    .toOutputStream(thumbOut);

            String thumbName = "thumb_" + file.getOriginalFilename();
            fileStorageService.upload(thumbName,
                    new ByteArrayInputStream(thumbOut.toByteArray()),
                    "image/jpeg");

            log.info("图片上传成功: {}, size={}KB", file.getOriginalFilename(), file.getSize() / 1024);
            return url;
        } catch (IOException e) {
            log.error("图片处理失败", e);
            throw new BusinessException(ErrorCode.UPLOAD_FAILED);
        }
    }
}
