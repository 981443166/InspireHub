package com.inspirehub.service;

import com.inspirehub.dto.TagCount;
import java.util.List;

public interface TagService {

    /** 获取当前用户所有标签及使用频次 */
    List<TagCount> getUserTags(Long userId);
}
