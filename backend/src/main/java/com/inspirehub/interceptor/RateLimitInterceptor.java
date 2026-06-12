package com.inspirehub.interceptor;

import com.inspirehub.common.BusinessException;
import com.inspirehub.common.ErrorCode;
import com.inspirehub.config.RateLimiterConfig;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor
public class RateLimitInterceptor implements HandlerInterceptor {

    private final RateLimiterConfig.RateLimiter rateLimiter;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String path = request.getRequestURI();
        String userId = request.getRemoteAddr(); // 简化：按 IP 限流

        if (path.startsWith("/api/upload")) {
            // 上传：每分钟 10 次
            if (!rateLimiter.tryAcquire("upload:" + userId, 10, 60)) {
                throw new BusinessException(ErrorCode.FILE_TOO_LARGE, "上传过于频繁，请稍后再试");
            }
        } else if (path.startsWith("/api/import")) {
            // 导入：每分钟 5 次
            if (!rateLimiter.tryAcquire("import:" + userId, 5, 60)) {
                throw new BusinessException(ErrorCode.IMPORT_FAILED, "导入过于频繁，请稍后再试");
            }
        }
        return true;
    }
}
