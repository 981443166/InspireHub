package com.inspirehub.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * 简易内存限流器（无需额外依赖）
 */
@Configuration
public class RateLimiterConfig {

    @Bean
    public RateLimiter rateLimiter() {
        return new RateLimiter();
    }

    public static class RateLimiter {
        private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

        /** 尝试获取令牌，返回是否允许 */
        public boolean tryAcquire(String key, int maxRequests, int windowSeconds) {
            long now = System.currentTimeMillis();
            Bucket bucket = buckets.computeIfAbsent(key, k -> new Bucket(now, windowSeconds));
            return bucket.tryAcquire(now, maxRequests);
        }

        private static class Bucket {
            private final AtomicInteger count;
            private volatile long windowStart;
            private final int windowMs;

            Bucket(long now, int windowSec) {
                this.count = new AtomicInteger(0);
                this.windowStart = now;
                this.windowMs = windowSec * 1000;
            }

            boolean tryAcquire(long now, int max) {
                if (now - windowStart > windowMs) {
                    synchronized (this) {
                        if (now - windowStart > windowMs) {
                            windowStart = now;
                            count.set(0);
                        }
                    }
                }
                int current = count.incrementAndGet();
                return current <= max;
            }
        }
    }
}
