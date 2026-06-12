package com.inspirehub.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 抓取链接的 Open Graph 元信息（标题、描述、缩略图）
 */
@Slf4j
@Service
public class LinkMetadataService {

    private static final Pattern OG_IMAGE = Pattern.compile(
            "<meta[^>]+property=[\"']og:image[\"'][^>]+content=[\"']([^\"']+)[\"']",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern OG_TITLE = Pattern.compile(
            "<meta[^>]+property=[\"']og:title[\"'][^>]+content=[\"']([^\"']+)[\"']",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern OG_DESC = Pattern.compile(
            "<meta[^>]+property=[\"']og:description[\"'][^>]+content=[\"']([^\"']+)[\"']",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern TWITTER_IMAGE = Pattern.compile(
            "<meta[^>]+name=[\"']twitter:image[\"'][^>]+content=[\"']([^\"']+)[\"']",
            Pattern.CASE_INSENSITIVE);

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(5))
            .followRedirects(HttpClient.Redirect.NORMAL)
            .build();

    /** 异步抓取链接的 og:image，返回 URL 或 null */
    @Async("taskExecutor")
    public void enrichLinkMeta(com.inspirehub.entity.Inspiration inspiration,
                                com.inspirehub.mapper.InspirationMapper mapper) {
        if (!"link".equals(inspiration.getType())) return;
        String url = inspiration.getContent();
        if (url == null || !url.startsWith("http")) return;

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .timeout(Duration.ofSeconds(5))
                    .header("User-Agent", "InspireHub/1.0 (Link Preview)")
                    .GET()
                    .build();

            HttpResponse<InputStream> response = httpClient.send(request,
                    HttpResponse.BodyHandlers.ofInputStream());

            if (response.statusCode() == 200) {
                String html = new String(response.body().readAllBytes());
                // 限制只读前 64KB，避免超大页面
                if (html.length() > 65536) html = html.substring(0, 65536);

                String image = extractFirst(OG_IMAGE, html);
                if (image == null) image = extractFirst(TWITTER_IMAGE, html);

                if (image != null) {
                    inspiration.setImageThumbnail(image);
                    // 如果有 og:title 且当前标题为空，自动填充
                    String ogTitle = extractFirst(OG_TITLE, html);
                    if (ogTitle != null && inspiration.getTitle() == null) {
                        inspiration.setTitle(ogTitle);
                    }
                    mapper.updateById(inspiration);
                    log.info("链接元信息抓取成功: {} -> og:image={}", url, image);
                }
            }
        } catch (Exception e) {
            log.debug("链接元信息抓取跳过: {} ({})", url, e.getMessage());
        }
    }

    private String extractFirst(Pattern pattern, String html) {
        Matcher m = pattern.matcher(html);
        return m.find() ? m.group(1) : null;
    }
}
