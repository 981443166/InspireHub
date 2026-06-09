package com.inspirehub.common;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 业务错误码
 */
@Getter
@AllArgsConstructor
public enum ErrorCode {

    SUCCESS(200, "success"),
    BAD_REQUEST(400, "请求参数错误"),
    UNAUTHORIZED(401, "未登录或 token 过期"),
    FORBIDDEN(403, "无权访问该资源"),
    NOT_FOUND(404, "资源不存在"),
    CONFLICT(409, "资源冲突（如重复注册）"),
    INTERNAL_ERROR(500, "服务器内部错误"),

    // 业务错误
    USERNAME_EXISTS(1001, "用户名已存在"),
    EMAIL_EXISTS(1002, "邮箱已注册"),
    WRONG_PASSWORD(1003, "密码错误"),
    USER_NOT_FOUND(1004, "用户不存在"),
    INVALID_TOKEN(1005, "无效的认证信息"),

    FILE_TOO_LARGE(2001, "文件大小超过限制"),
    FILE_TYPE_NOT_ALLOWED(2002, "不支持的文件类型"),
    UPLOAD_FAILED(2003, "文件上传失败"),
    IMPORT_FAILED(2004, "导入失败");

    private final int code;
    private final String message;
}
