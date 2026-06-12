package com.inspirehub.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.inspirehub.dto.InspirationCreateRequest;
import com.inspirehub.dto.InspirationUpdateRequest;
import com.inspirehub.dto.InspirationVO;

import java.util.List;

public interface InspirationService {

    /** 创建灵感 */
    InspirationVO create(Long userId, InspirationCreateRequest request);

    /** 分页列表（支持多条件筛选） */
    IPage<InspirationVO> list(Long userId, int page, int size,
                              String type, String domain, String tags);

    /** 获取详情 */
    InspirationVO getById(Long userId, Long id);

    /** 更新灵感 */
    InspirationVO update(Long userId, Long id, InspirationUpdateRequest request);

    /** 删除灵感 */
    void delete(Long userId, Long id);

    /** 全文搜索 */
    List<InspirationVO> search(Long userId, String keyword);
}
