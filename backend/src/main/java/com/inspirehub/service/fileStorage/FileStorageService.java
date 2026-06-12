package com.inspirehub.service.fileStorage;

import java.io.InputStream;

/**
 * 文件存储服务接口 — 支持本地 / OSS / MinIO 切换
 */
public interface FileStorageService {

    /** 上传文件，返回访问 URL */
    String upload(String fileName, InputStream inputStream, String contentType);

    /** 获取文件访问 URL */
    String getUrl(String fileName);

    /** 删除文件 */
    void delete(String fileName);
}
