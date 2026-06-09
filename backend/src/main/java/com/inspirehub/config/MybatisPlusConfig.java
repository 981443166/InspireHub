package com.inspirehub.config;

import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * MyBatis-Plus 配置
 * <p>
 * 注：MyBatis-Plus 3.5.9+ 已移除 PaginationInnerInterceptor，
 * 分页由 MybatisPlusInterceptor 自动检测 Page 参数处理，无需额外配置。
 */
@Configuration
@MapperScan("com.inspirehub.mapper")
public class MybatisPlusConfig {

    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        return new MybatisPlusInterceptor();
    }
}
