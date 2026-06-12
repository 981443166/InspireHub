package com.inspirehub.service.fileStorage;

import cn.hutool.core.util.StrUtil;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import io.minio.http.Method;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.UUID;

/**
 * MinIO / 阿里云 OSS / 腾讯云 COS 对象存储实现
 * 配置 example:
 *   storage.type=oss
 *   storage.oss.endpoint=http://localhost:9000
 *   storage.oss.access-key=minioadmin
 *   storage.oss.secret-key=minioadmin
 *   storage.oss.bucket=inspirehub
 */
@Slf4j
@Service
@ConditionalOnProperty(name = "storage.type", havingValue = "oss")
public class OssFileStorageService implements FileStorageService {

    @Value("${storage.oss.endpoint}")
    private String endpoint;

    @Value("${storage.oss.access-key}")
    private String accessKey;

    @Value("${storage.oss.secret-key}")
    private String secretKey;

    @Value("${storage.oss.bucket:inspirehub}")
    private String bucket;

    private MinioClient client;

    @jakarta.annotation.PostConstruct
    public void init() {
        this.client = MinioClient.builder()
                .endpoint(endpoint)
                .credentials(accessKey, secretKey)
                .build();
        log.info("OSS FileStorage 初始化完成: endpoint={}, bucket={}", endpoint, bucket);
    }

    @Override
    public String upload(String fileName, InputStream inputStream, String contentType) {
        try {
            String ext = fileName.contains(".") ? fileName.substring(fileName.lastIndexOf(".")) : "";
            String objectName = UUID.randomUUID().toString().replace("-", "") + ext;

            client.putObject(PutObjectArgs.builder()
                    .bucket(bucket)
                    .object(objectName)
                    .stream(inputStream, inputStream.available(), -1)
                    .contentType(contentType)
                    .build());

            // 返回预签名 URL（7 天有效），或返回对象路径
            String url = client.getPresignedObjectUrl(GetPresignedObjectUrlArgs.builder()
                    .bucket(bucket)
                    .object(objectName)
                    .method(Method.GET)
                    .expiry(7 * 24 * 60 * 60)
                    .build());

            log.info("OSS 上传成功: {} -> {}", fileName, objectName);
            return url;
        } catch (Exception e) {
            log.error("OSS 上传失败: {}", fileName, e);
            throw new RuntimeException("OSS 上传失败", e);
        }
    }

    @Override
    public String getUrl(String fileName) {
        try {
            String name = fileName;
            if (name.contains("/")) name = name.substring(name.lastIndexOf("/") + 1);
            if (StrUtil.startWith(name, "http")) return name; // already a full URL

            return client.getPresignedObjectUrl(GetPresignedObjectUrlArgs.builder()
                    .bucket(bucket)
                    .object(name)
                    .method(Method.GET)
                    .expiry(24 * 60 * 60)
                    .build());
        } catch (Exception e) {
            log.warn("获取 OSS URL 失败: {}", fileName);
            return fileName;
        }
    }

    @Override
    public void delete(String fileName) {
        try {
            String name = fileName;
            if (name.contains("/")) name = name.substring(name.lastIndexOf("/") + 1);
            client.removeObject(RemoveObjectArgs.builder().bucket(bucket).object(name).build());
            log.info("OSS 删除: {}", name);
        } catch (Exception e) {
            log.warn("OSS 删除失败: {}", fileName, e);
        }
    }
}
