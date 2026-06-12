package com.inspirehub.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.inspirehub.entity.Inspiration;
import com.inspirehub.mapper.InspirationMapper;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("TagService")
class TagServiceImplTest {

    @Mock InspirationMapper mapper;
    @InjectMocks TagServiceImpl service;

    private Inspiration withTags(String tags) {
        return Inspiration.builder().tags(tags).build();
    }

    @Test @DisplayName("sorted by count desc")
    void sortedByCount() {
        when(mapper.selectList(any(LambdaQueryWrapper.class))).thenReturn(List.of(
            withTags("css,color,ui"), withTags("css,js"), withTags("css,color"),
            withTags("ui"), withTags("")));

        var tags = service.getUserTags(1L);

        assertThat(tags).hasSize(4);
        assertThat(tags.get(0).getName()).isEqualTo("css");
        assertThat(tags.get(0).getCount()).isEqualTo(3L);
        // color & ui both have count 2 — order between them is not defined
        var middle = tags.subList(1, 3);
        assertThat(middle).extracting("count").containsOnly(2L, 2L);
        assertThat(middle).extracting("name").contains("color", "ui");
        assertThat(tags.get(3).getName()).isEqualTo("js");
        assertThat(tags.get(3).getCount()).isEqualTo(1L);
        assertThat(tags.get(3).getName()).isEqualTo("js");
        assertThat(tags.get(3).getCount()).isEqualTo(1L);
    }

    @Test @DisplayName("empty when no inspirations")
    void empty() {
        when(mapper.selectList(any(LambdaQueryWrapper.class))).thenReturn(Collections.emptyList());
        assertThat(service.getUserTags(1L)).isEmpty();
    }
}
